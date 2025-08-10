import React, { useState } from 'react';
import BaseCard from '../BaseCard/BaseCard';
import { View } from 'react-native';
import Label from '../Label/Label';
import styled from 'styled-components/native';
import numberCurrency from '../../helpers/numberCurrency';
import Separator from '../Separator/Separator';
import RowView from '../RowView/RowView';
import FontAwesomeIcon from '../FontAwesomeIcon/FontAwesomeIcon';
import Pressable from '../Pressable/Pressable';
import InputValueModal from '../../modals/InputValueModal/InputValueModal';
import uuid from "react-native-uuid";
import { useExpenseEventHandler } from "../../hooks/useExpenseEventHandler";

const Style_Item = styled(Pressable)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const TotalCard = () => {
  const {
    state,
    addExpenseEvent,
    calculateRemainingBalance
  } = useExpenseEventHandler();
  const {
    remainingBalance,
    fixedValue,
    variableValue
  } = calculateRemainingBalance({});
  const [ isModalVisible, setModalVisible ] = useState(false);

  const setValue = (value: number | undefined) => addExpenseEvent({
    action: 'updated',
    currentBalance: value ? {
      id: uuid.v4(),
      amount: value,
      date: new Date().toISOString()
    } : null,
    previousExpense: state?.currentBalance
  })

  return (<BaseCard>
    <Style_Item onPress={() => setModalVisible(true)}>
      <View style={{ flex: 1 }}>
        <Label color="textSecondary" size="s">
          Aktueller Saldo
        </Label>
        <Label color="textSecondary" weight="bold">
          {numberCurrency(state?.currentBalance?.amount)}
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
        value={state?.currentBalance?.amount}
        setValue={setValue}
      />
    </Style_Item>
    <Separator />
    <Label color="textSecondary" size="s">Restsaldo</Label>
    <Label
      color={!remainingBalance ? 'textPrimary' : remainingBalance < 0 ? 'danger' : 'primary'}
      weight="bold"
      size="xxl"
    >
      {numberCurrency(remainingBalance)}
    </Label>
    {(fixedValue || variableValue || state?.savings?.amount) && <Separator />}
    {fixedValue && <RowView style={{ justifyContent: 'space-between' }}>
      <Label color="textSecondary" size="s">Fixe Kosten</Label>
      <Label color="textSecondary" size="s" weight="bold">
        {numberCurrency(fixedValue)}
      </Label>
    </RowView>}

    {variableValue && <RowView style={{ justifyContent: 'space-between' }}>
      <Label color="textSecondary" size="s">Buchungen</Label>
      <Label color="textSecondary" size="s" weight="bold">
        {numberCurrency(variableValue)}
      </Label>
    </RowView>}
    {state?.savings?.amount && <RowView style={{ justifyContent: 'space-between' }}>
      <Label color="textSecondary" size="s">Ersparnisse</Label>
      <Label color="textSecondary" size="s" weight="bold">
        {numberCurrency(state.savings.amount)}
      </Label>
    </RowView>}
  </BaseCard>);
};

export default TotalCard;