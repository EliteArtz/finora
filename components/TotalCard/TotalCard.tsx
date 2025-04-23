import React, { useEffect, useState } from 'react';
import BaseCard from '../BaseCard/BaseCard';
import { View } from 'react-native';
import Label from '../Label/Label';
import styled from 'styled-components/native';
import { useMMKVNumber, useMMKVObject } from 'react-native-mmkv';
import Button from '../Button/Button';
import Input from '../Input/Input';
import numberCurrency from '../../helpers/numberCurrency';
import { Expense } from '../../types/expenses.type';
import Modal from '../Modal/Modal';
import Separator from '../Separator/Separator';
import RowView from '../RowView/RowView';
import FontAwesomeIcon from '../FontAwesomeIcon/FontAwesomeIcon';

const Style_Item = styled.Pressable`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Style_FullInput = styled(Input)`
  flex: 1;
`;

const TotalCard = () => {
  const [ currentValue, setCurrentValue ] = useMMKVNumber('currentValue');
  const [ expenses ] = useMMKVObject<Expense[]>('expenses');
  const [ remainingValue, setRemainingValue ] = useMMKVNumber('remainingValue');
  const [ editValue, setEditValue ] = useState(currentValue?.toString());
  const [ isModalVisible, setModalVisible ] = useState(false);

  useEffect(() => {
    if (!currentValue) {
      setRemainingValue(undefined);
      return;
    }
    const sum = expenses
      ?.map(expense =>
        expense.amount - (expense.paid?.reduce((acc, x) => acc + x, 0) || 0)
      )
      .reduce((acc, x) => acc + x, 0)
      || 0;
    setRemainingValue(currentValue - sum);
  }, [ currentValue, expenses ]);

  const onRequestClose = () => {
    setModalVisible(false);
    setEditValue(currentValue?.toString());
  };

  const onEndEditing = () => {
    setModalVisible(false);
    setCurrentValue(editValue ? parseFloat(
      editValue?.replace(',', '.')
    ) : undefined);
  };

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
        <Modal
          visible={isModalVisible}
          onRequestClose={onRequestClose}
        >
          <RowView>
            <Style_FullInput
              keyboardType="decimal-pad"
              value={editValue}
              placeholder="Aktueller Saldo"
              onChangeText={setEditValue}
              onEndEditing={onEndEditing}
            />
            <Label>€</Label>
          </RowView>
          <Button
            padding="s"
            onPress={onEndEditing}
          >
            <Label align="center">OK</Label>
          </Button>
        </Modal>
        <FontAwesomeIcon
          color="textSecondary"
          icon="pen"
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
    </BaseCard>
  );
};

export default TotalCard;