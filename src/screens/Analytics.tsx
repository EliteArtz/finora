import Layout01 from "../layouts/Layout01";
import Label from "../components/Label/Label";
import SafeScrollView from "../components/ScrollView/SafeScrollView";
import { CurveType, LineChart, lineDataItem } from "react-native-gifted-charts";
import styled, { css, useTheme } from "styled-components/native";
import { useExpenseEventHandler } from "../hooks/useExpenseEventHandler";
import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import numberCurrency from "../helpers/numberCurrency";
import BaseCard from "../components/BaseCard/BaseCard";
import RowView from "../components/RowView/RowView";
import DotLight from "../components/DotLight/DotLight";
import listLastExpenseByDay from "../helpers/listLastExpenseByDay";
import Checkbox from "../components/Checkbox/Checkbox";
import Separator from "../components/Separator/Separator";
import { useIsFocused } from "@react-navigation/native";

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
`;

const Style_View = styled.View`
  ${({ theme }) => css`
    gap: ${theme.size.s.px};
  `}
`

const Style_PaddedView = styled.View`
  ${({ theme }) => css`
    padding-left: ${theme.size.s.px};
    gap: ${theme.size.s.px};
  `}
`

const Analytics = () => {
  const theme = useTheme();
  const isFocused = useIsFocused();
  const {
    state,
    expenseEvents
  } = useExpenseEventHandler();
  const {
    lastEvents,
    startDate,
    today
  } = useMemo(() => listLastExpenseByDay(expenseEvents, 0), [ expenseEvents ]);

  const [ remainingBalanceLineData, setRemainingBalanceLineData ] = useState<lineDataItem[]>([]);
  const [ balanceLineData, setBalanceLineData ] = useState<lineDataItem[]>([]);
  const [ parentWidth, setParentWidth ] = useState<number>(0);
  const [ isParentWidth, setIsParentWidth ] = useState<boolean>(false);

  const linechartStyle = {
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
  }

  const lastDay = new Date(today);
  lastDay.setMonth(today.getMonth() + 1);
  lastDay.setDate(0);

  const remainingDays = lastDay.getDate() - today.getDate();
  const averageRemainingExpense = state?.remainingBalance && Math.max(state?.remainingBalance / remainingDays, 0);


  useEffect(() => {
    setRemainingBalanceLineData(lastEvents.map(({ remainingBalance }, i) => {
      const indexDate = new Date(startDate)
      indexDate.setDate(startDate.getDate() + i)

      return {
        value: remainingBalance,
        dataPointText: numberCurrency(remainingBalance),
        label: !isParentWidth || indexDate.getDate() % 2 === 0 ? Intl.DateTimeFormat(undefined, {
          day: '2-digit',
          month: '2-digit'
        })
          .format(indexDate) : undefined
      }
    }))
    setBalanceLineData(lastEvents.map(({ balance }) => ({
      value: balance?.amount,
      dataPointText: numberCurrency(balance?.amount),
      dataPointWidth: 20,
    })))
  }, [ isParentWidth, lastEvents ]);

  return isFocused && <Layout01>
    <SafeScrollView>
      <Label size="xl" weight="bold">Analyse</Label>
      <BaseCard>
        <Style_View>
          <Label size="s" color="textSecondary" align="center">{Intl.DateTimeFormat(undefined, {
            day: '2-digit',
            month: '2-digit'
          })
            .format(startDate)} - {Intl.DateTimeFormat(undefined, { dateStyle: 'medium' })
            .format(today)}</Label>
          <View style={{ overflow: 'hidden' }} onLayout={e => setParentWidth(e.nativeEvent.layout.width)}>
            <LineChart
              {...linechartStyle}
              dataSet={[
                { data: remainingBalanceLineData }, {
                  data: balanceLineData,
                  startOpacity: 0,
                  color: theme.color.lightTransparency,
                  strokeDashArray: [ 6, 6 ]
                }
              ]}
              parentWidth={parentWidth - 20}
              adjustToWidth={isParentWidth}
              noOfSections={5}
              yAxisLabelSuffix=" €"
              endSpacing={0}
              initialSpacing={2}
              curveType={CurveType.QUADRATIC}
              isAnimated
              animateOnDataChange
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
                pointerLabelComponent: (items: lineDataItem[], _: [], i: number) => {
                  const pointerDate = new Date();
                  pointerDate.setDate(i)
                  return <Style_ToolTipContainer>
                    <View>
                      <Label size="s" align="center" color="textSecondary">Saldo</Label>
                      <Label size="s" align="center" weight="bold">{items[1].dataPointText}</Label>
                    </View>

                    <View>
                      <Label size="s" align="center" color="textSecondary">Restsaldo</Label>
                      <Label size="s" align="center" weight="bold">{items[0].dataPointText}</Label>
                    </View>
                  </Style_ToolTipContainer>
                }
              }}
            />
            <RowView gap="s" justifyContent="center">
              <DotLight color="lightTransparency" /><Label size="s" color="textSecondary">Saldo</Label>
              <DotLight color="primary" /><Label size="s" color="textSecondary">Restsaldo</Label>
            </RowView>
          </View>
          <Checkbox isActive={isParentWidth} setIsActive={setIsParentWidth}><Label size="s">Graph
            minimieren</Label></Checkbox>
          <Label>Aktueller Stand</Label>
          <RowView justifyContent="space-between">
            <Label size="s" color="textSecondary">Aktueller Saldo</Label>
            <Label size="s" weight="bold">{numberCurrency(state?.currentBalance?.amount)}</Label>
          </RowView>
          <RowView justifyContent="space-between">
            <Label size="s" color="textSecondary">Restsaldo</Label>
            <Label size="s" weight="bold">{numberCurrency(state?.remainingBalance)}</Label>
          </RowView>
          <Separator space="none" />
          <Label>Empfehlungen</Label>
          <Label size="s" color="textSecondary">Um im positiven Ergebnis zu bleiben:</Label>
          <Style_PaddedView>
            <RowView justifyContent="space-between">
              <Label size="s" color="textSecondary">Max. tägliche Ausgabe:</Label>
              <Label size="s" weight="bold">{numberCurrency(averageRemainingExpense)}</Label>
            </RowView>
          </Style_PaddedView>
        </Style_View>
      </BaseCard>
    </SafeScrollView>
  </Layout01>
}

export default Analytics;