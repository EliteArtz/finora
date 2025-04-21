import React, {useEffect, useState} from "react";
import BaseCard from "../BaseCard/BaseCard";
import {View} from "react-native";
import Label from "../Label/Label";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import styled, {css, useTheme} from "styled-components/native";
import {useMMKVNumber, useMMKVObject} from "react-native-mmkv";
import Button from "../Button/Button";
import Input from "../Input/Input";
import numberCurrency from "../../helpers/numberCurrency";
import {Expense} from "../../types/expenses.type";
import Modal from "../Modal/Modal";

const Style_Item = styled.Pressable`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const Style_Separator = styled.View`
  height: 1px;
  background-color: rgba(0, 0, 0, 0.1);
  ${({ theme }) => css`
    margin-block: ${theme.size.m.px};
  `}
`

const TotalCard = () => {
  const theme = useTheme();
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
  }

  const onEndEditing = () => {
    setModalVisible(false)
    setCurrentValue(editValue ? parseFloat(
      editValue?.replace(',', '.')
    ) : undefined)
  }

  return (
    <BaseCard>
      <Style_Item onPress={() => setModalVisible(!isModalVisible)}>
        <View>
          <Label color="textSecondary" size="s">
            Aktueller Saldo
          </Label>
          <Label color="textSecondary" weight="bold">
            {numberCurrency(currentValue)}
          </Label>
        </View>
        <Modal
          animationType="fade"
          visible={isModalVisible}
          onRequestClose={onRequestClose}
          transparent
        >
          <Input
            keyboardType="decimal-pad"
            value={editValue}
            placeholder="Aktueller Saldo"
            onChangeText={setEditValue}
            onEndEditing={onEndEditing}
            autoFocus
          />
          <Button
            padding="s"
            onPress={onEndEditing}
          >
            <Label align="center">OK</Label>
          </Button>
        </Modal>
        <FontAwesomeIcon
          color={theme.color.textSecondary}
          size={theme.size.m.value * 16}
          icon="pen"
        />
      </Style_Item>
      <Style_Separator />
      <Label color="textSecondary" size="s">Restsaldo</Label>
      <Label
        color={!remainingValue ? 'textPrimary' : remainingValue < 0 ? 'danger' : 'primary'}
        weight="bold"
        size="xxl"
      >
        {numberCurrency(remainingValue)}
      </Label>
    </BaseCard>
  )
}

export default TotalCard;