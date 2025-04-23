import Modal from '../Modal/Modal';
import RowView from '../RowView/RowView';
import Label from '../Label/Label';
import Button from '../Button/Button';
import FontAwesomeIcon from '../FontAwesomeIcon/FontAwesomeIcon';
import Input from '../Input/Input';
import Separator from '../Separator/Separator';
import numberCurrency from '../../helpers/numberCurrency';
import Pressable from '../Pressable/Pressable';
import React, { useEffect, useState } from 'react';
import { useMMKVObject } from 'react-native-mmkv';
import { Expense } from '../../types/expenses.type';
import styled, { css } from 'styled-components/native';

type EditExpenseModalProps = {
  expenseId: Expense['id'] | undefined;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<EditExpenseModalProps['visible']>>;
}

type EditExpenseProps = {
  id: Expense['id'];
  type: Expense['type'];
  description: Expense['description'];
  amount: string;
  paid?: Expense['paid'];
}

const Style_ScrollView = styled.ScrollView.attrs(({ theme }) => ({
  contentContainerStyle: {
    gap: theme.size.s.value * 16
  }
}))`
  max-height: 100px;
  ${({ theme }) => css`
    border-radius: ${theme.size.s.px};
    background-color: ${theme.color.background};
    padding: ${theme.size.s.px};
  `}
`

const EditExpenseModal = ({expenseId, visible, setVisible}: EditExpenseModalProps) => {
  const [ expenses, setExpenses ] = useMMKVObject<Expense[]>('expenses');
  const [ editPaidValue, setEditPaidValue ] = useState<string>();
  const [ editExpense, setEditExpense ] = useState<EditExpenseProps>();

  const onRequestClose = () => {
    setVisible(false);
  };

  const onDeletePress = (id?: Expense['id']) => {
    if (!id) return;
    const newExpenses = expenses?.filter(expense => expense.id !== id);
    setExpenses(newExpenses);
    setVisible(false);
  };

  const onDeletePaidPress = (index: number) => {
    if(!editExpense) return;
    const newPaid = editExpense?.paid?.filter((_, i) => i !== index);
    setEditExpense({
      ...editExpense,
      paid: newPaid
    });
  }

  const onEditChange = (expense: Partial<EditExpenseProps>) => {
    if (!editExpense) return;
    setEditExpense({
      ...editExpense,
      ...expense
    });
  }

  const onSubmitEdit = () => {
    if (!editExpense || !editExpense.amount) return;
    const newExpenses = expenses?.map(expense => {
      if (expense.id !== editExpense.id) return expense;
      return {
        ...expense,
        ...editExpense,
        amount: parseFloat(editExpense.amount.replace(',', '.'))
      };
    });
    setExpenses(newExpenses);
    setVisible(false);
  }

  useEffect(() => {
    if (!expenseId) return;

    const expense = expenses?.find(expense => expense.id === expenseId);
    if (!expense) return;

    setEditExpense({
      id: expense.id,
      type: expense.type,
      description: expense.description,
      amount: expense.amount.toString(),
      paid: expense.paid
    });
  }, [ expenseId ]);

  return (

    <Modal
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <RowView style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Label size="s" color="textSecondary">
          Eintrag bearbeiten
        </Label>
        <Button
          padding="s"
          onPress={() => onDeletePress(expenseId)}
        >
          <FontAwesomeIcon color="danger" size="s" icon="trash" />
        </Button>
      </RowView>
      <Input
        placeholder="Beschreibung (optional)"
        value={editExpense?.description}
        onChangeText={(value) => onEditChange({ description: value })}
      />
      <RowView>
        <Input
          placeholder="Wert"
          value={editExpense?.amount}
          onChangeText={(value) => onEditChange({ amount: value })}
          keyboardType='decimal-pad'
          isFullWidth
        />
        <Label>€</Label>
      </RowView>
      {editExpense?.type === 'fixed' && (
        <>
          <Separator />
          <Label size="s" color="textSecondary">Bezahlt</Label>
          <Style_ScrollView style={{ maxHeight: 100}}>
            {editExpense.paid?.map((paid, index) => (
              <RowView key={index} style={{ justifyContent: 'space-between' }}>
                <Label color='textPrimary' weight='bold'>{numberCurrency(paid)}</Label>
                <Pressable onPress={() => onDeletePaidPress(index)}>
                  <FontAwesomeIcon color="danger" size="l" icon="xmark" />
                </Pressable>
              </RowView>
            ))}
          </Style_ScrollView>
          <RowView>
            <Input
              value={editPaidValue}
              placeholder='Wert in EUR'
              keyboardType='decimal-pad'
              onChangeText={setEditPaidValue}
              isFullWidth />
            <Pressable onPress={() => {
              editPaidValue && onEditChange({ paid: [ ...(editExpense?.paid || []), parseFloat(editPaidValue) ] })
              setEditPaidValue(undefined);
            }}>
              <FontAwesomeIcon color='primary' size='l' icon='add' />
            </Pressable>
          </RowView>
        </>
      )}
      <Button onPress={onSubmitEdit}><Label align="center">OK</Label></Button>
    </Modal>
  )
}

export default EditExpenseModal;