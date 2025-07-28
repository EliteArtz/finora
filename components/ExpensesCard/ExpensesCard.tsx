import React, { useMemo, useState } from 'react';
import { useMMKVObject } from 'react-native-mmkv';
import Label from '../Label/Label';
import BaseCard from '../BaseCard/BaseCard';
import numberCurrency from '../../helpers/numberCurrency';
import { Expense } from '../../types/expenses.type';
import { useTheme } from 'styled-components/native';
import { FlatList } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import Separator from '../Separator/Separator';
import FontAwesomeIcon from '../FontAwesomeIcon/FontAwesomeIcon';
import EditExpenseModal from '../../modals/EditExpenseModal/EditExpenseModal';
import Modal from "../Modal/Modal";
import RowView from "../RowView/RowView";
import Button from "../Button/Button";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ListItem from "./ListItem";

type ExpensesCardProps = {
  type: Expense['type'];
}

const ExpensesCard = ({ type }: ExpensesCardProps) => {
  const theme = useTheme();

  const [ expenses ] = useMMKVObject<Expense[]>('expenses');
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
            circleBackgroundColor={theme.color.background}
            inActiveStrokeColor={theme.color.background}
          />),
      }
    }), [ expenses ]);


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
      {expense?.description && <Label>{expense.description}</Label>}
      <RowView style={{ justifyContent: 'space-between' }}>
        <Label color="textSecondary" size="s">Bezahlt</Label>
        <Label
          color="textSecondary"
          size="s"
          weight="bold"
        >{numberCurrency(expense?.paid && Math.min(expense.paid.reduce((acc, x) => acc + x, 0), expense.amount) ||
          0)}</Label>
      </RowView>
      <RowView style={{ justifyContent: 'space-between' }}>
        <Label color="textSecondary" size="s">Restbetrag</Label>
        <Label
          color="textSecondary"
          size="s"
          weight="bold"
        >{numberCurrency(expense ?
          expense.amount - (Math.min(expense.paid?.reduce((acc, x) => acc + x, 0) || 0, expense.amount)) :
          0)}</Label>
      </RowView>
      <Button onPress={() => setInfoModalVisible(false)}><Label>OK</Label></Button>
    </Modal>
  </BaseCard>);
};

export default ExpensesCard;