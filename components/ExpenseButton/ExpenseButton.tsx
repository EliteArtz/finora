import Button from '../Button/Button';
import uuid from 'react-native-uuid';
import Modal from '../Modal/Modal';
import Label from '../Label/Label';
import Input from '../Input/Input';
import React, { useEffect, useState } from 'react';
import { useMMKVObject } from 'react-native-mmkv';
import { Expense } from '../../types/expenses.type';
import { Picker as RNPicker, PickerItemProps } from '@react-native-picker/picker';
import Picker from '../Picker/Picker';
import RowView from '../RowView/RowView';
import FontAwesomeIcon from '../FontAwesomeIcon/FontAwesomeIcon';
import { ScrollView, View } from 'react-native';
import { useTheme } from "styled-components/native";

const ExpenseButton = () => {
  const theme = useTheme();
  const [ isModalVisible, setIsModalVisible ] = useState(false);
  const [ type, setType ] = useState<Expense['type']>('transaction');
  const [ description, setDescription ] = useState<string>();
  const [ expense, setExpense ] = useState<string>();
  const [ expenses, setExpenses ] = useMMKVObject<Expense[]>('expenses');
  const props: Partial<PickerItemProps> = {
    color: theme.color.primary,
    style: {
      backgroundColor: theme.color.surface,
    }
  }

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
      amount: parseFloat(expense.replace(',', '.')),
    };
    setExpenses(expenses?.length ? [ ...expenses, expenseObject ] : [ expenseObject ]);
  };

  useEffect(() => {
    if (!expenses) return;
    onRequestClose();
  }, [ expenses ]);

  return (<>
      <Button type="primary" padding="l" onPress={onPress}>
        <FontAwesomeIcon
          color="surface"
          size="l"
          icon="plus"
        />
      </Button>
      <View>
        <ScrollView>
          <Modal
            visible={isModalVisible}
            onRequestClose={onRequestClose}
          >
            <Label size="s" color="textSecondary">Eintrag verfassen</Label>
            <Picker
              mode="dropdown"
              selectedValue={type}
              textColor="primary"
              onValueChange={(item) => setType(item as Expense['type'])}
            >
              <RNPicker.Item label="Buchung" value="transaction" {...props} />
              <RNPicker.Item label="Fixe Kosten" value="fixed" {...props} />
            </Picker>
            <Input
              placeholder="Beschreibung (optional)"
              value={description}
              onChangeText={setDescription}
            />
            <RowView>
              <Input
                placeholder="Wert"
                keyboardType="decimal-pad"
                value={expense}
                onChangeText={setExpense}
                onSubmitEditing={onSubmit}
                isFullWidth
              />
              <Label>€</Label>
            </RowView>
            <Button onPress={onSubmit} disabled={!expense}>
              <Label align="center">Hinzufügen</Label>
            </Button>
          </Modal>
        </ScrollView>
      </View>
    </>);
};

export default ExpenseButton;