import React, { useState } from 'react';
import { useMMKVObject } from 'react-native-mmkv';
import Label from '../Label/Label';
import BaseCard from '../BaseCard/BaseCard';
import numberCurrency from '../../helpers/numberCurrency';
import { Expense } from '../../types/expenses.type';
import styled, { useTheme } from 'styled-components/native';
import { View } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import Separator from '../Separator/Separator';
import FontAwesomeIcon from '../FontAwesomeIcon/FontAwesomeIcon';
import Pressable from '../Pressable/Pressable';
import EditExpenseModal from '../../modals/EditExpenseModal/EditExpenseModal';
import Modal from "../Modal/Modal";
import RowView from "../RowView/RowView";
import Button from "../Button/Button";

type ExpensesCardProps = {
  type: Expense['type'];
}

const Style_Item = styled(Pressable)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;


const ExpensesCard = ({ type }: ExpensesCardProps) => {
  const theme = useTheme();
  const [ expenses, setExpenses ] = useMMKVObject<Expense[]>('expenses');
  const [ expenseId, setExpenseId ] = useState<Expense['id']>();
  const expense = expenses?.find(expense => expense.id === expenseId);
  const [ isEditExpenseModalVisible, setEditExpenseModalVisible ] = useState(false);
  const [ isInfoModalVisible, setInfoModalVisible ] = useState(false);
  const filteredExpenses = expenses?.filter(expense => expense.type === type);

  const onPressItem = (id: string) => {
    setExpenseId(id);
    setEditExpenseModalVisible(true);
  };

  const onDeletePress = (id?: Expense['id']) => {
    if (!id) return;
    const newExpenses = expenses?.filter(expense => expense.id !== id);
    setExpenses(newExpenses);
    setEditExpenseModalVisible(false);
  };

  const onInfoPress = (id?: Expense['id']) => {
    if (!id) return;
    setExpenseId(id);
    setInfoModalVisible(true);
  }

  return (
    <BaseCard>
      {filteredExpenses?.map(({ id, description, amount, paid }, index) => (
        <React.Fragment key={id}>
          {index !== 0 && <Separator />}
          <Style_Item
            onPress={() => onPressItem(id)}
          >
            <View style={{ flex: 1 }}>
              {description &&
                <Label color="textSecondary" size="s">{description}</Label>
              }
              <Label weight="bold">{numberCurrency(amount)}</Label>
            </View>
            {type === 'fixed' ? (
                <Pressable hitSlop={10} onPress={() => onInfoPress(id)}>
                  {paid && paid.reduce((acc, x) => acc + x, 0) >= amount ? (
                    <FontAwesomeIcon icon="check-circle" color="primary" size="l" />
                  ) : (
                    <CircularProgress
                      value={paid && Math.min(
                        paid.reduce((acc, x) => acc + x, 0),
                        amount
                      ) || 0}
                      duration={1000}
                      radius={12}
                      maxValue={amount}
                      inActiveStrokeWidth={24}
                      activeStrokeWidth={10}
                      showProgressValue={false}
                      circleBackgroundColor={theme.color.background}
                      inActiveStrokeColor={theme.color.background}
                    />
                  )}
                </Pressable>
            ) : (
              <Pressable
                hitSlop={10}
                onPress={() => onDeletePress(id)}
              >
                <FontAwesomeIcon
                  color="textSecondary"
                  size="l"
                  icon="xmark"
                />
              </Pressable>
            )}
          </Style_Item>
        </React.Fragment>
      ))}
      <EditExpenseModal
        expenseId={expenseId}
        visible={isEditExpenseModalVisible}
        setVisible={setEditExpenseModalVisible}
      />

      <Modal
        visible={isInfoModalVisible}
        onRequestClose={() => setInfoModalVisible(false)}
      >
        {expense?.description &&
          <Label>{expense.description}</Label>
        }
        <RowView style={{justifyContent: 'space-between'}}>
          <Label color="textSecondary" size="s">Bezahlt</Label>
          <Label color="textSecondary" size="s" weight='bold'>{numberCurrency(
            expense?.paid && Math.min(
              expense.paid.reduce((acc, x) => acc + x, 0),
              expense.amount
            ) || 0
          )}</Label>
        </RowView>
        <RowView style={{justifyContent: 'space-between'}}>
          <Label color="textSecondary" size="s">Restbetrag</Label>
          <Label color="textSecondary" size="s" weight='bold'>{numberCurrency(
            expense ?
              expense.amount - (Math.min(
                expense.paid?.reduce((acc, x) => acc + x, 0) || 0,
                expense.amount
              ))
            : 0
          )
          }</Label>
        </RowView>
        <Button onPress={() => setInfoModalVisible(false)}><Label>OK</Label></Button>
      </Modal>
    </BaseCard>
  );
};

export default ExpensesCard;