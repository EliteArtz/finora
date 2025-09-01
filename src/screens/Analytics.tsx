import Layout01 from "../layouts/Layout01";
import Label from "../components/Label/Label";
import SafeScrollView from "../components/ScrollView/SafeScrollView";
import { CurveType, LineChart, lineDataItem } from "react-native-gifted-charts";
import styled, { css, useTheme } from "styled-components/native";
import { useExpenseEventHandler } from "../hooks/useExpenseEventHandler";
import { Key, useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import numberCurrency from "../helpers/numberCurrency";
import BaseCard from "../components/BaseCard/BaseCard";
import RowView from "../components/RowView/RowView";
import DotLight from "../components/DotLight/DotLight";
import listLastExpenseByDay from "../helpers/listLastExpenseByDay";
import Checkbox from "../components/Checkbox/Checkbox";
import Separator from "../components/Separator/Separator";
import { useIsFocused } from "@react-navigation/native";
import Pressable from "../components/Pressable/Pressable";
import FontAwesomeIcon from "../components/FontAwesomeIcon/FontAwesomeIcon";
import Presets from "../components/Presets/Presets";

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

  const presetItems = [
    {
      label: 'Aktueller Monat',
      key: 0
    },
    {
      label: '2 Monate',
      key: 1
    },
    {
      label: '3 Monate',
      key: 2
    }
  ];
  const [ selectedPreset, setSelectedPreset ] = useState<Key>(presetItems[0].key);

  const {
    lastEvents,
    startDate,
    today
  } = useMemo(() => listLastExpenseByDay(expenseEvents, Number(selectedPreset)), [ expenseEvents, selectedPreset ]);

  const [ remainingBalanceLineData, setRemainingBalanceLineData ] = useState<lineDataItem[]>([]);
  const [ balanceLineData, setBalanceLineData ] = useState<lineDataItem[]>([]);
  const [ currentPointDatas, setCurrentPointDatas ] = useState<{
    remainingBalanceLineData: lineDataItem; balanceLineData: lineDataItem
  } | undefined>();
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
  const averageRemainingExpense = useMemo(() => state?.remainingBalance &&
    Math.max(state?.remainingBalance / remainingDays, 0), [ state ]);

  const averageDailyVariableExpense = useMemo(() => expenseEvents && expenseEvents
    ?.filter(event => event.expense?.type === 'variable' && event.action === 'added')
    ?.reduce((acc, event) => acc + event.expense!.amount, 0) / today.getDate(), [ state, expenseEvents ]);
  const daysUntilNegative = useMemo(() => state?.remainingBalance && averageDailyVariableExpense &&
    state.remainingBalance / averageDailyVariableExpense, [ state, averageDailyVariableExpense ]);
  const dateUntilNegative = new Date(today);
  daysUntilNegative && dateUntilNegative.setDate(today.getDate() + daysUntilNegative);

  // Set visual line data (remainingbalance data vs. currentbalance data)
  useEffect(() => {
    setRemainingBalanceLineData(lastEvents.map(({ remainingBalance }, i) => {
      const indexDate = new Date(startDate)
      indexDate.setDate(startDate.getDate() + i)

      return {
        value: remainingBalance,
        dataPointText: numberCurrency(remainingBalance),
        date: indexDate.toISOString(),
        labelTextStyle: {
          ...linechartStyle.xAxisLabelTextStyle,
          display: !isParentWidth || indexDate.getDate() % 2 === 0 ? 'flex' : 'none',

        },
        label: Intl.DateTimeFormat(undefined, {
          day: '2-digit',
          month: '2-digit'
        })
          .format(indexDate)
      }
    }))
    setBalanceLineData(lastEvents.map(({ balance }) => ({
      value: balance?.amount,
    })))
  }, [ isParentWidth, lastEvents ]);

  useEffect(() => {
    if (isFocused) return;
    setIsParentWidth(false);
  }, [ isFocused ]);

  const warningRemainingBalance = <Pressable>
    <Label size="s" color="warning">Anhand Ihrer variablen Ausgaben könnte Ihr Restsaldo im Minus
      fallen!</Label>
    <Style_PaddedView>
      <RowView justifyContent="space-between">
        <Label size="s" color="textSecondary">Bisherige durchschn. Tagesausgabe:</Label>
        <Label size="s" weight="bold">{numberCurrency(averageDailyVariableExpense)}</Label>
      </RowView>
    </Style_PaddedView>
    <Style_PaddedView>
      <RowView justifyContent="space-between">
        <Label size="s" color="textSecondary">Wann es im Minus sein könnte:</Label>
        <Label size="s" weight="bold">{Intl.DateTimeFormat(undefined, { dateStyle: 'medium' })
          .format(dateUntilNegative)}</Label>
      </RowView>
      <RowView gap="s" flexWrap="nowrap">
        <FontAwesomeIcon icon="arrow-right" size="s" color="textSecondary" />
        <Label size="s" color="textSecondary">Beachten Sie die max. durchschnittliche Tagesausgabe, um am Ende
          des Monats positiv zu bleiben.</Label>
      </RowView>
    </Style_PaddedView>
  </Pressable>;

  const remainingBalanceNegative = <Pressable>
    <Label size="s" color="danger">Ihr Restsaldo liegt im Minus!</Label>
    <RowView flexWrap="nowrap">
      <FontAwesomeIcon icon="arrow-right" size="s" color="textSecondary" />
      <Label size="s" color="textSecondary">Können fixe Kosten verringert werden?</Label>
    </RowView>
    <RowView flexWrap="nowrap">
      <FontAwesomeIcon icon="arrow-right" size="s" color="textSecondary" />
      <Label size="s" color="textSecondary">Benötigen/Nutzen Sie wirklich alle Abonnements zurzeit?</Label>
    </RowView>
  </Pressable>

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
          <Presets items={presetItems} selectedKey={selectedPreset} setSelectedKey={setSelectedPreset} />
          {currentPointDatas?.remainingBalanceLineData && currentPointDatas.balanceLineData && <View>
            <Label>Datenpunkt</Label>
            <RowView justifyContent="space-between">
              <Label size="s" color="textSecondary">Datum</Label>
              <Label size="s" weight="bold">{currentPointDatas.remainingBalanceLineData.label}</Label>
            </RowView>
            <RowView justifyContent="space-between">
              <Label size="s" color="textSecondary">Aktueller Saldo</Label>
              <Label size="s" weight="bold">{numberCurrency(currentPointDatas.balanceLineData.value)}</Label>
            </RowView>
            <RowView justifyContent="space-between">
              <Label size="s" color="textSecondary">Restsaldo</Label>
              <Label
                size="s"
                color={state?.remainingBalance && state.remainingBalance < 0 ?
                  'danger' :
                  daysUntilNegative && daysUntilNegative < remainingDays ? 'warning' : 'primary'}
                weight="bold"
              >{numberCurrency(currentPointDatas?.remainingBalanceLineData?.value)}</Label>
            </RowView></View>}
          <View onLayout={e => setParentWidth(e.nativeEvent.layout.width)}>
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
              width={parentWidth - 60}
              parentWidth={parentWidth - 20}
              adjustToWidth={isParentWidth}
              noOfSections={5}
              yAxisLabelSuffix=" €"
              endSpacing={!isParentWidth ? 10 : 0}
              initialSpacing={2}
              curveType={CurveType.QUADRATIC}
              labelsExtraHeight={10}
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
              getPointerProps={({ pointerIndex }: { pointerIndex: number }) => setCurrentPointDatas({
                remainingBalanceLineData: remainingBalanceLineData[pointerIndex],
                balanceLineData: balanceLineData[pointerIndex],
              })}
              pointerConfig={{
                activatePointersOnLongPress: true,
                persistPointer: true,
                pointerColor: theme.color.primary,
                showPointerStrip: false,
                radius: 4,
              }}
            />
          </View>
          <RowView gap="s" justifyContent="center">
            <DotLight color="lightTransparency" /><Label size="s" color="textSecondary">Saldo</Label>
            <DotLight color="primary" /><Label size="s" color="textSecondary">Restsaldo</Label>
          </RowView>
          <Checkbox isActive={isParentWidth} setIsActive={setIsParentWidth}><Label size="s">Graph
            minimieren</Label></Checkbox>
        </Style_View>
      </BaseCard>
      <BaseCard>
        <Style_View>
          <Label>Aktueller Stand</Label>
          <RowView justifyContent="space-between">
            <Label size="s" color="textSecondary">Aktueller Saldo</Label>
            <Label size="s" weight="bold">{numberCurrency(state?.currentBalance?.amount)}</Label>
          </RowView>
          <RowView justifyContent="space-between">
            <Label size="s" color="textSecondary">Restsaldo</Label>
            <Label
              size="s"
              color={state?.remainingBalance && state.remainingBalance < 0 ?
                'danger' :
                daysUntilNegative && daysUntilNegative < remainingDays ? 'warning' : 'primary'}
              weight="bold"
            >{numberCurrency(state?.remainingBalance)}</Label>
          </RowView>
          <Separator space="none" />
          <Label>Empfehlungen / Maßnahmen</Label>
          {state?.remainingBalance && state?.remainingBalance < 0 ?
            remainingBalanceNegative :
            daysUntilNegative && daysUntilNegative < remainingDays && warningRemainingBalance}
          <Label size="s" color="primary">Um im positiven Ergebnis zu bleiben, können Sie folgendes
            berücksichtigen:</Label>
          <Style_PaddedView>
            <Pressable>
              <RowView justifyContent="space-between">
                <Label size="s">Durschn. Tagesausgabe:</Label>
                <Label size="s" weight="bold">{numberCurrency(averageRemainingExpense)}</Label>
              </RowView>
              {state?.remainingBalance && state.remainingBalance < 0 && <RowView>
                <FontAwesomeIcon icon="arrow-right" size="s" color="textSecondary" />
                <Label size="s" color="textSecondary">Das bedeutet einen sofortigen Ausgabestopp!</Label>
              </RowView>}
            </Pressable>
          </Style_PaddedView>
        </Style_View>
      </BaseCard>
    </SafeScrollView>
  </Layout01>
}

export default Analytics;