import React from 'react';
import { useMMKVObject } from 'react-native-mmkv';
import Label from '../Label/Label';
import BaseCard from '../BaseCard/BaseCard';
import numberCurrency from '../../helpers/numberCurrency';
import { Expense } from '../../types/expenses.type';
import styled, { useTheme } from 'styled-components/native';
import { FlatList, View } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import Separator from '../Separator/Separator';
import FontAwesomeIcon from '../FontAwesomeIcon/FontAwesomeIcon';
import Pressable from '../Pressable/Pressable';

type ExpensesCardProps = {
  type: Expense['type'];
  setExpenseId: React.Dispatch<React.SetStateAction<Expense['id'] | undefined>>;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const Style_Item = styled(Pressable)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;


const ExpensesCard = ({ type, setExpenseId, setModalVisible }: ExpensesCardProps) => {
  const theme = useTheme();
  const [ expenses, setExpenses ] = useMMKVObject<Expense[]>('expenses');
  const filteredExpenses = expenses?.filter(expense => expense.type === type);

  const onPressItem = (id: string) => {
    setExpenseId(id);
    setModalVisible(true);
  }

  const onDeletePress = (id?: Expense['id']) => {
    if (!id) return;
    const newExpenses = expenses?.filter(expense => expense.id !== id);
    setExpenses(newExpenses);
    setModalVisible(false);
  };


  return (
    <BaseCard>
      <FlatList
        ItemSeparatorComponent={Separator}
        data={filteredExpenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item: { id, description, amount, paid } }) => (
          <React.Fragment key={id}>
            <Style_Item
              onPress={() => onPressItem(id)}
            >
              <View style={{flex: 1}}>
                {description &&
                  <Label color="textSecondary" size="s">{description}</Label>
                }
                <Label weight="bold">{numberCurrency(amount)}</Label>
              </View>
              {type === 'fixed' ? (
                <>
                  {paid && paid.reduce((acc, x) => acc + x, 0) >= amount ? (
                    <FontAwesomeIcon icon='check-circle' color='primary' size='l' />
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
                </>
              ) : (
                <Pressable
                  hitSlop={10} onPress={() => {
                  onDeletePress(id);
                }}
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
        )}
      />
    </BaseCard>
  );
};

export default ExpensesCard;