import React, {useEffect, useState} from 'react';
import BaseCard from '../BaseCard/BaseCard';
import {View} from 'react-native';
import Label from '../Label/Label';
import styled from 'styled-components/native';
import {useMMKVNumber, useMMKVObject} from 'react-native-mmkv';
import numberCurrency from '../../helpers/numberCurrency';
import {Expense} from '../../types/expenses.type';
import Separator from '../Separator/Separator';
import RowView from '../RowView/RowView';
import FontAwesomeIcon from '../FontAwesomeIcon/FontAwesomeIcon';
import Pressable from "../Pressable/Pressable";
import InputValueModal from "../../modals/InputValueModal/InputValueModal";

const Style_Item = styled(Pressable)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const TotalCard = () => {
  const [ currentValue, setCurrentValue ] = useMMKVNumber('currentValue');
  const [ expenses ] = useMMKVObject<Expense[]>('expenses');
  const [ remainingValue, setRemainingValue ] = useMMKVNumber('remainingValue');
  const [ isModalVisible, setModalVisible ] = useState(false);
  const [ savings ] = useMMKVNumber('savings');

  const fixedExpenses = expenses?.reduce((
    acc,
    expense
  ) => expense.type === 'fixed' ? acc + expense.amount - (
    expense.paid?.reduce((acc2, paid) => (
      acc2 + paid
    ), 0) || 0
  ) : acc, 0);
  const transactionExpenses = expenses?.reduce((
    acc,
    expense
  ) => expense.type === 'transaction' ? acc + expense.amount : acc, 0);

  useEffect(() => {
    if (!currentValue) {
      setRemainingValue(undefined);
      return;
    }
    const sum = expenses
      ?.reduce((acc, expense) => (
        acc
        + expense.amount
        - (expense.paid?.reduce((acc2, paid) => (
          acc2 + paid
        ), 0) || 0)
      ), 0) || 0;
    setRemainingValue(currentValue - sum - (savings || 0));
  }, [ currentValue, expenses, savings ]);

  return (
    <BaseCard>
      <Style_Item onPress={() => setModalVisible(!isModalVisible)}>
        <View style={{ flex: 1 }}>
          <Label color="textSecondary" size="s">
            Aktueller Saldo
          </Label>
          <Label color="textSecondary" weight="bold">
            {numberCurrency(currentValue)}
          </Label>
        </View>
        <FontAwesomeIcon
          color="textSecondary"
          icon="pen"
        />
        <InputValueModal
          label="Aktueller Saldo"
          isVisible={isModalVisible}
          setIsVisible={setModalVisible}
          value={currentValue}
          setValue={setCurrentValue}
        />
      </Style_Item>
      <Separator />
      <Label color="textSecondary" size="s">Restsaldo</Label>
      <Label
        color={!remainingValue ? 'textPrimary' : remainingValue < 0 ? 'danger' : 'primary'}
        weight="bold"
        size="xxl"
      >
        {numberCurrency(remainingValue)}
      </Label>
      <Separator />
      {!!fixedExpenses &&
        <RowView style={{ justifyContent: 'space-between' }}>
          <Label color="textSecondary" size="s">Fixe Kosten</Label>
          <Label color="textSecondary" size="s" weight="bold">
            {numberCurrency(fixedExpenses)}
          </Label>
        </RowView>
      }
      {!!transactionExpenses &&
        <RowView style={{ justifyContent: 'space-between' }}>
          <Label color="textSecondary" size="s">Buchungen</Label>
          <Label color="textSecondary" size="s" weight="bold">
            {numberCurrency(transactionExpenses)}
          </Label>
        </RowView>
      }
      {!!savings &&
        <RowView style={{ justifyContent: 'space-between' }}>
          <Label color="textSecondary" size="s">Ersparnisse</Label>
          <Label color="textSecondary" size="s" weight="bold">
            {numberCurrency(savings)}
          </Label>
        </RowView>
      }
    </BaseCard>
  );
};

export default TotalCard;