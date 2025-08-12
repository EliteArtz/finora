import Layout01 from "../layouts/Layout01";
import Label from "../components/Label/Label";
import SafeScrollView from "../components/ScrollView/SafeScrollView";
import { CurveType, LineChart, lineDataItem } from "react-native-gifted-charts";
import styled, { css, useTheme } from "styled-components/native";
import { useExpenseEventHandler } from "../hooks/useExpenseEventHandler";
import { useEffect, useState } from "react";
import { ExpenseEvent } from "../types/expenses.type";
import { View } from "react-native";
import numberCurrency from "../helpers/numberCurrency";
import BaseCard from "../components/BaseCard/BaseCard";
import RowView from "../components/RowView/RowView";
import DotLight from "../components/DotLight/DotLight";

const Style_LineChart = styled(LineChart)
  .attrs(({ theme }) => ({
    dataPointsColor: theme.color.primary,
    focusedDataPointColor: theme.color.primary,
    color: theme.color.primary,
    color2: theme.color.lightTransparency,
    startFillColor: theme.color.primary,
    endFillColor: theme.color.background,
    startOpacity2: 0,
    endOpacity: 0,
    yAxisColor: 'transparent',
    xAxisColor: theme.color.lightTransparency,
    rulesColor: theme.color.lightTransparency,
    verticalLinesColor: theme.color.lightTransparency,
    yAxisTextStyle: {
      color: theme.color.textSecondary,
      fontSize: theme.size.s.value * 12,
    },
    xAxisLabelTextStyle: {
      color: theme.color.textSecondary,
      fontSize: theme.size.s.value * 12,
    },
  }))`
  ${({ theme }) => css`
    color: ${theme.color.primary};
  `}
`

const Style_ToolTipContainer = styled.View`
${({ theme }) => css`
  background-color: ${theme.color.surface};
  elevation: 5;
  box-shadow: 0 0 ${theme.color.primary};
  width: 100px;
  gap: ${theme.size.s.px};
  padding: ${theme.size.s.px};
  border-radius: ${theme.size.s.px};
`}
`

const Analytics = () => {
  const theme = useTheme();
  const { expenseEvents } = useExpenseEventHandler();
  const [ remainingBalanceLineData, setRemainingBalanceLineData ] = useState<lineDataItem[]>([]);
  const [ balanceLineData, setBalanceLineData ] = useState<lineDataItem[]>([]);
  const date = new Date();
  const firstDate = new Date();
  firstDate.setDate(1)

  useEffect(() => {
    if (!expenseEvents) return;
    expenseEvents.sort((a, b) => {
      const aTime = new Date(a.date).getTime();
      const bTime = new Date(b.date).getTime();
      return aTime > bTime ? 1 : -1;
    })
    const currentDay = date.getDate();
    let lastEvents: ExpenseEvent[] = [];

    for (let i = 0; i <= currentDay; i++) {
      const expenseEvent = expenseEvents.findLast(value => {
        return new Date(value.date).getDate() <= i
      });
      lastEvents.push(expenseEvent || expenseEvents[0]);
    }
    setRemainingBalanceLineData(lastEvents.map(({ remainingBalance }, i) => {
      const indexDate = new Date()
      indexDate.setDate(i)

      return {
        value: remainingBalance,
        dataPointText: numberCurrency(remainingBalance),
        label: Intl.DateTimeFormat(undefined, {day:'2-digit', month:'2-digit'}).format(indexDate)
      }
    }))
    setBalanceLineData(lastEvents.map(({ balance }) => {

      return {
        value: balance?.amount,
        dataPointText: numberCurrency(balance?.amount),
        dataPointWidth: 20,
      }
    }))
  }, [ expenseEvents ]);

  return <Layout01>
    <SafeScrollView>
      <Label size="xl" weight="bold">Analyse</Label>
      <BaseCard>
        <Label size='s' color='textSecondary' align='center'>{Intl.DateTimeFormat(undefined, {day: '2-digit', month: '2-digit'}).format(firstDate)} - {Intl.DateTimeFormat(undefined, {dateStyle: 'medium'}).format(date)}</Label>
        <View style={{ overflow: 'hidden' }}>
        <Style_LineChart
          dataSet={[{data: remainingBalanceLineData}, { data: balanceLineData, startOpacity: 0, color: theme.color.lightTransparency, strokeDashArray: [6, 6] }]}
          noOfSections={5}
          yAxisLabelSuffix=' €'
          endSpacing={0}
          initialSpacing={2}
          curveType={CurveType.QUADRATIC}
          xAxisLabelsAtBottom
          curved
          areaChart
          rotateLabel
          showVerticalLines
          hideDataPoints
          hideRules
          scrollToEnd
          pointerConfig={{
            pointerStripUptoDataPoint: true,
            activatePointersOnLongPress: true,
            pointerVanishDelay: 10000,
            pointerColor: theme.color.primary,
            radius: 4,
            showPointerStrip: false,
            pointerLabelWidth: 120,
            pointerLabelComponent:  (items:lineDataItem[], _:[], i: number) => {
              const pointerDate = new Date();
              pointerDate.setDate(i)
              return <Style_ToolTipContainer>
                <View>
                <Label size='s' align='center' color='textSecondary'>Saldo</Label>
                <Label size='s' align='center' weight='bold'>{items[1].dataPointText}</Label>
                </View>

                <View>
                <Label size='s' align='center' color='textSecondary'>Restsaldo</Label>
                <Label size='s' align='center' weight='bold'>{items[0].dataPointText}</Label>
                </View>
              </Style_ToolTipContainer>
            }
          }}
        /></View>
        <RowView gap='s' justifyContent='center'>
          <DotLight color='lightTransparency' /> <Label size='s' color='textSecondary'>Saldo</Label>
          <DotLight color='primary' /> <Label size='s' color='textSecondary'>Restsaldo</Label>
        </RowView>
      </BaseCard>
    </SafeScrollView>
  </Layout01>
}

export default Analytics;