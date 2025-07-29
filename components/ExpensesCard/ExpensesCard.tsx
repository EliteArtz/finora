import React, { useEffect, useMemo, useState } from 'react';
import { useMMKVObject } from 'react-native-mmkv';
import Label from '../Label/Label';
import BaseCard from '../BaseCard/BaseCard';
import numberCurrency from '../../helpers/numberCurrency';
import { Expense } from '../../types/expenses.type';
import styled, { css, useTheme } from 'styled-components/native';
import { FlatList, View } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import Separator from '../Separator/Separator';
import FontAwesomeIcon from '../FontAwesomeIcon/FontAwesomeIcon';
import EditExpenseModal from '../../modals/EditExpenseModal/EditExpenseModal';
import Modal from "../Modal/Modal";
import RowView from "../RowView/RowView";
import Button from "../Button/Button";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ListItem from "./ListItem";
import Pressable from "../Pressable/Pressable";

type ExpensesCardProps = {
  type: Expense['type'];
}

const Style_AmountView = styled.View`
  ${({ theme }) => css`
    background-color: ${theme.color.background};
    padding: ${theme.size.s.px};
    border-radius: ${theme.size.s.value * 8}px;
  `}
`

const ExpensesCard = ({ type }: ExpensesCardProps) => {
  const theme = useTheme();
  const [ expenses, setExpenses ] = useMMKVObject<Expense[]>('expenses');
  const [ expenseId, setExpenseId ] = useState<Expense['id']>();
  const expense = useMemo(() => expenses?.find(expense => expense.id === expenseId), [ expenseId, expenses ]);
  const [ isEditExpenseModalVisible, setEditExpenseModalVisible ] = useState(false);
  const [ isInfoModalVisible, setInfoModalVisible ] = useState(false);
  const filteredExpenses = useMemo(() => expenses?.filter(expense => expense.type === type)
    ?.map(({
      id,
      description,
      amount,
      paid
    }) => {
      const reducedPaid = paid && paid.reduce((acc, x) => acc + x, 0) || 0;
      const color = theme.color.background;
      return {
        id,
        amount,
        description: description && <Label color="textSecondary" size="s">{description}</Label>,
        paid: Math.min(reducedPaid, amount),
        progressPaid: reducedPaid >= amount ?
          (<FontAwesomeIcon icon="check-circle" color="primary" size="l" />) :
          (<CircularProgress
            value={Math.min(reducedPaid, amount)}
            duration={1000}
            radius={12}
            maxValue={amount}
            inActiveStrokeWidth={24}
            activeStrokeWidth={10}
            showProgressValue={false}
            circleBackgroundColor={color}
            inActiveStrokeColor={color}
          />),
      }
    }), [ expenses, theme ]);

  useEffect(() => {
    if (expenses?.find(e => !e.date)) {
      setExpenses(expenses?.map(e => ({
        ...e, ...(!e.date && {
          date: new Date().toISOString()
        })
      })))
      console.log(expenses)
    }
  }, []);


  return (<BaseCard>
    <Label color="primary" size="m" weight="bold">{type === 'fixed' ? 'Fixe Kosten' : 'Buchungen'}</Label>
    <GestureHandlerRootView>
      <FlatList
        data={filteredExpenses}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <Separator space={'none'} />}
        renderItem={({ item }) => <ListItem
          item={item}
          type={type}
          setExpenseId={setExpenseId}
          setEditExpenseModalVisible={setEditExpenseModalVisible}
          setInfoModalVisible={setInfoModalVisible}
        />}
      />
    </GestureHandlerRootView>
    <EditExpenseModal
      expenseId={expenseId}
      visible={isEditExpenseModalVisible}
      setVisible={setEditExpenseModalVisible}
    />

    <Modal
      visible={isInfoModalVisible}
      onRequestClose={() => setInfoModalVisible(false)}
    >
      <RowView justifyContent={expense?.description ? 'space-between' : 'flex-end'}>
        {expense?.description && <Label>{expense.description}</Label>}
        <Pressable onPress={() => setEditExpenseModalVisible(true)}>
          <FontAwesomeIcon
            icon="pen"
            color="textSecondary"
            size="s"
          />
        </Pressable>
      </RowView>
      {expense?.date && <RowView justifyContent="space-between">
        <Label color="textSecondary" size="s">Datum</Label>
        <Label
          color="textSecondary"
          size="s"
          weight="bold"
        >{new Intl.DateTimeFormat(undefined, {
          dateStyle: 'medium',
          timeStyle: 'short',
        }).format(new Date(expense.date))}</Label>
      </RowView>}
      <Style_AmountView>
        <RowView justifyContent="space-between">
          <Label color="textPrimary" size="s">Wert</Label>
          <Label
            color="textPrimary"
            size="s"
            weight="bold"
          >{numberCurrency(expense?.amount || 0)}</Label>
        </RowView>

        {expense?.paid && <><Separator /><RowView justifyContent="space-between">
          <View style={{ flex: 1 }}>
            <Label color="success" size="s" align="left">Bezahlt</Label>
            <Label
              color="textPrimary"
              size="s"
              weight="bold"
              align="left"
            >{numberCurrency(Math.min(expense.paid.reduce((acc, x) => acc + x, 0), expense.amount) || 0)}</Label>
          </View>
          <View style={{ flex: 1 }}>
            <Label color="warning" size="s" align="right">Restbetrag</Label>
            <Label
              color="textPrimary"
              size="s"
              weight="bold"
              align="right"
            >{numberCurrency(expense ?
              expense.amount - (Math.min(expense.paid?.reduce((acc, x) => acc + x, 0) || 0, expense.amount)) :
              0)}</Label>
          </View>
        </RowView></>}
      </Style_AmountView>
      <Button onPress={() => setInfoModalVisible(false)}><Label>OK</Label></Button>
    </Modal>
  </BaseCard>);
};

export default ExpensesCard;