import Modal from '../../components/Modal/Modal';
import RowView from '../../components/RowView/RowView';
import Label from '../../components/Label/Label';
import Button from '../../components/Button/Button';
import FontAwesomeIcon from '../../components/FontAwesomeIcon/FontAwesomeIcon';
import Input from '../../components/Input/Input';
import Separator from '../../components/Separator/Separator';
import numberCurrency from '../../helpers/numberCurrency';
import Pressable from '../../components/Pressable/Pressable';
import React, { useEffect, useState } from 'react';
import { useMMKVObject } from 'react-native-mmkv';
import { Expense } from '../../types/expenses.type';
import styled, { css } from 'styled-components/native';
import { View } from 'react-native';

type EditExpenseModalProps = {
  expenseId: Expense['id'] | undefined;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<EditExpenseModalProps['visible']>>;
}

type EditExpenseProps = {
  id: Expense['id']; type: Expense['type']; description: Expense['description']; amount: string; paid?: Expense['paid'];
}

const Style_FlatList = styled.FlatList.attrs(({ theme }) => ({
  contentContainerStyle: {
    gap: theme.size.s.value * 16,
    padding: theme.size.s.value * 16,
  }
}))`
  max-height: 100px;
  ${({ theme }) => css`
    border-radius: ${theme.size.s.px};
    background-color: ${theme.color.background};
  `}
`

const EditExpenseModal = ({
  expenseId,
  visible,
  setVisible
}: EditExpenseModalProps) => {
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
    if (!editExpense) return;
    const newPaid = editExpense?.paid?.filter((_, i) => i !== index);
    setEditExpense({
      ...editExpense,
      paid: newPaid
    });
  }

  const onEditChange = (expense: Partial<EditExpenseProps>) => {
    if (!editExpense) return;
    setEditExpense({
      ...editExpense, ...expense
    });
  }

  const onSubmitEdit = () => {
    if (!editExpense || !editExpense.amount) return;
    const newExpenses = expenses?.map(expense => {
      if (expense.id !== editExpense.id) return expense;
      return {
        ...expense, ...editExpense,
        amount: parseFloat(editExpense.amount.replace(',', '.'))
      };
    });
    setExpenses(newExpenses);
    setVisible(false);
  }

  const onSubmitPaidEdit = () => {
    editPaidValue && onEditChange({
      paid: [
        ...(editExpense?.paid || []), parseFloat(editPaidValue?.replace(',', '.'))
      ]
    })
    setEditPaidValue(undefined);
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

  return (<Modal
    visible={visible}
    onRequestClose={onRequestClose}
  >
    <View>
      <Label size="s">Beschreibung</Label>
      <RowView justifyContent="space-between">
        <Input
          placeholder="Beschreibung"
          value={editExpense?.description}
          onChangeText={(value) => onEditChange({ description: value })}
          isFullWidth
        />
        <Pressable
          onPress={() => onDeletePress(expenseId)}
          hitSlop={16}
        >
          <FontAwesomeIcon color="danger" size="s" icon="trash" />
        </Pressable>
      </RowView>
    </View>
    <View>
      <Label size="s">Wert <Label size="s" color="danger">*</Label></Label>
      <RowView>
        <Input
          placeholder="12,34"
          value={editExpense?.amount}
          onChangeText={(value) => onEditChange({ amount: value })}
          keyboardType="decimal-pad"
          isFullWidth
        />
        <Label>€</Label>
      </RowView>
    </View>
    {editExpense?.type === 'fixed' && (<>
      <Separator space="none" />
      <Label size="s" color="textSecondary">Bezahlt</Label>
      <Style_FlatList
        data={editExpense.paid}
        renderItem={({
          item: paid,
          index
        }) => (<RowView key={index} style={{ justifyContent: 'space-between' }}>
          <Label color="textPrimary" weight="bold">{typeof paid === 'number' && numberCurrency(paid)}</Label>
          <Pressable onPress={() => onDeletePaidPress(index)}>
            <FontAwesomeIcon color="danger" size="l" icon="xmark" />
          </Pressable>
        </RowView>)}
      />
      <RowView>
        <Input
          value={editPaidValue}
          placeholder="12,34"
          keyboardType="decimal-pad"
          onChangeText={setEditPaidValue}
          onSubmitEditing={onSubmitPaidEdit}
          isFullWidth
        />
        <Pressable onPress={onSubmitPaidEdit}>
          <FontAwesomeIcon color="primary" size="l" icon="add" />
        </Pressable>
      </RowView>
    </>)}
    <Button onPress={onSubmitEdit}><Label align="center">OK</Label></Button>
  </Modal>)
}

export default EditExpenseModal;