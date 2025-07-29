import React, { useEffect, useMemo, useState } from 'react';
import { useMMKVObject } from 'react-native-mmkv';
import Label from '../Label/Label';
import BaseCard from '../BaseCard/BaseCard';
import { Expense } from '../../types/expenses.type';
import { useTheme } from 'styled-components/native';
import { FlatList } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import Separator from '../Separator/Separator';
import FontAwesomeIcon from '../FontAwesomeIcon/FontAwesomeIcon';
import EditExpenseModal from '../../modals/EditExpenseModal/EditExpenseModal';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ListItem from "./ListItem";
import InfoExpenseModal from "../../modals/InfoExpenseModal/InfoExpenseModal";

type ExpensesCardProps = {
  type: Expense['type'];
}

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

  /**
   * Migration from without dates
   * Check if there are any expenses without dates and fill them
   */
  useEffect(() => {
    if (!expenses?.find(e => !e.date)) return;
    setExpenses(expenses?.map(e => ({
      ...e,
      ...(!e.date && {
        date: new Date().toISOString()
      })
    })))
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
    {expense && (<>
      <EditExpenseModal
        expense={expense}
        visible={isEditExpenseModalVisible}
        setVisible={setEditExpenseModalVisible}
      />
      <InfoExpenseModal
        expense={expense}
        isVisible={isInfoModalVisible}
        setIsEditModalVisible={setEditExpenseModalVisible}
        setIsVisible={setInfoModalVisible}
      />
    </>)}

  </BaseCard>);
};

export default ExpensesCard;