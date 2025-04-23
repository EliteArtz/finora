import React from 'react';
import { useMMKVObject } from 'react-native-mmkv';
import Label from '../Label/Label';
import BaseCard from '../BaseCard/BaseCard';
import numberCurrency from '../../helpers/numberCurrency';
import { Expense } from '../../types/expenses.type';
import styled, { useTheme } from 'styled-components/native';
import { View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import CircularProgress from 'react-native-circular-progress-indicator';
import Modal from '../Modal/Modal';
import Separator from '../Separator/Separator';

type ExpensesCardProps = {
  type: Expense['type']
}

const Style_Item = styled.Pressable.attrs(({theme}) => ({
  android_ripple: {
    color: theme.color.light_transparency
  }
}))`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ExpensesCard = ({ type }: ExpensesCardProps) => {
  const theme = useTheme();
  const [ expenses ] = useMMKVObject<Expense[]>('expenses');
  const filteredExpenses = expenses?.filter(expense => expense.type === type);

  return (
    <BaseCard>
      {filteredExpenses?.map((
        { id, amount, paid, description, type: eType },
        index
      ) => eType === type && (
        <React.Fragment key={id}>
          {index !== 0 && (<Separator />)}
          <Style_Item>
            <View>
              {description &&
                <Label color="textSecondary" size="s">{description}</Label>
              }
              <Label weight="bold">{numberCurrency(amount)}</Label>
            </View>
            {eType === 'fixed' ? (
              <CircularProgress
                value={paid && paid.reduce((acc, x) => acc + x, 0) || 0}
                duration={0}
                radius={12}
                maxValue={amount}
                inActiveStrokeWidth={24}
                activeStrokeWidth={10}
                showProgressValue={false}
                circleBackgroundColor={theme.color.background}
                inActiveStrokeColor={theme.color.background}
              />
            ) : (
              <FontAwesomeIcon
                icon="xmark"
                size={theme.size.l.value * 16}
                color={theme.color.textSecondary}
              />
            )}
          </Style_Item>
        </React.Fragment>
      ))}
      <Modal transparent visible={false}>

      </Modal>
    </BaseCard>
  );
};

export default ExpensesCard;