import Button from '../Button/Button';
import uuid from 'react-native-uuid';
import Modal from '../Modal/Modal';
import Label from '../Label/Label';
import Input from '../Input/Input';
import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {useMMKVObject} from 'react-native-mmkv';
import {Expense} from '../../types/expenses.type';
import {Picker as RNPicker} from '@react-native-picker/picker';
import Picker from '../Picker/Picker';
import RowView from '../RowView/RowView';
import FontAwesomeIcon from '../FontAwesomeIcon/FontAwesomeIcon';

const Style_FullInput = styled(Input)`
  flex: 1;
`;

const ExpenseButton = () => {
  const [ isModalVisible, setIsModalVisible ] = useState(false);
  const [ type, setType ] = useState<Expense['type']>('transaction');
  const [ description, setDescription ] = useState<string>();
  const [ expense, setExpense ] = useState<string>();
  const [ expenses, setExpenses ] = useMMKVObject<Expense[]>('expenses');

  const onRequestClose = () => {
    setIsModalVisible(false);
    setDescription(undefined);
    setExpense(undefined);
  };

  const onPress = () => {
    setIsModalVisible(true);
  };

  const onSubmit = () => {
    if (!expense) return;
    const expenseObject: Expense = {
      id: uuid.v4(),
      type,
      description,
      amount: parseFloat(
        expense.replace(',', '.')
      ),
    };
    if (expenses?.length) {
      setExpenses([ ...expenses, expenseObject ]);
    } else {
      setExpenses([ expenseObject ]);
    }
  };

  useEffect(() => {
    if (!expenses) return;
    onRequestClose();
  }, [ expenses ]);

  return (
    <>
      <Button type="primary" padding="l" onPress={onPress}>
        <FontAwesomeIcon
          color="textPrimary"
          size="l"
          icon="pen"
        />
      </Button>
      <Modal
        visible={isModalVisible}
        onRequestClose={onRequestClose}
      >
        <Label size="s" color="textSecondary">Eintrag verfassen</Label>
        <Picker
          mode="dropdown"
          selectedValue={type}
          onValueChange={(item) => setType(item as Expense['type'])}
        >
          <RNPicker.Item label="Buchung" value="transaction" />
          <RNPicker.Item label="Fixe Kosten" value="fixed" />
        </Picker>
        <Input
          placeholder="Beschreibung (optional)"
          value={description}
          onChangeText={setDescription}
        />
        <RowView>
          <Style_FullInput
            placeholder="Wert"
            keyboardType="decimal-pad"
            value={expense}
            onChangeText={setExpense}
          />
          <Label>€</Label>
        </RowView>
        <Button onPress={onSubmit} disabled={!expense}>
          <Label align="center">OK</Label>
        </Button>
      </Modal>
    </>
  );
};

export default ExpenseButton;