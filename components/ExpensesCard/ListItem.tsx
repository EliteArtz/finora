import styled, { css } from "styled-components/native";
import { useMMKVObject } from "react-native-mmkv";
import { Expense } from "../../types/expenses.type";
import React, { useRef } from "react";
import Label from "../Label/Label";
import FontAwesomeIcon from "../FontAwesomeIcon/FontAwesomeIcon";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Pressable from "../Pressable/Pressable";
import Swipeable, { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable";
import { View } from "react-native";
import numberCurrency from "../../helpers/numberCurrency";


type ItemProps = {
  item: {
    id: Expense['id']; description: React.ReactNode; amount: Expense['amount']; progressPaid: React.ReactNode;
  }, type: Expense['type'], setExpenseId: React.Dispatch<React.SetStateAction<Expense['id'] | undefined>>
  setEditExpenseModalVisible: React.Dispatch<React.SetStateAction<boolean>>
  setInfoModalVisible: React.Dispatch<React.SetStateAction<boolean>>
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

const Style_Item = styled(AnimatedPressable)`
  overflow: hidden;
  ${({ theme }) => css`
    padding-block: ${theme.size.m.px};
    background-color: ${theme.color.surface};
    border-radius: ${theme.size.s.value / 2 * 16}px;
  `}
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Style_DeleteAction = styled(Animated.View)`
  ${({ theme }) => css`
    background-color: ${theme.color.danger};
    justify-content: center;
    align-items: center;
    padding-inline: ${theme.size.xxl.px};
  `}
`

const Style_EditAction = styled(Animated.View)`
  ${({ theme }) => css`
    background-color: ${theme.color.textSecondary};
    justify-content: center;
    align-items: center;
    padding-inline: ${theme.size.xxl.px};
  `}
`

const Item = ({
  item: {
    id,
    description,
    amount,
    progressPaid
  },
  type,
  setExpenseId,
  setEditExpenseModalVisible,
  setInfoModalVisible,
}: ItemProps) => {
  const ref = useRef<SwipeableMethods>(null);
  const height = useSharedValue<number | undefined>(undefined);
  const [ expenses, setExpenses ] = useMMKVObject<Expense[]>('expenses');

  const renderRightActions = () => {
    return (<Style_DeleteAction>
      <FontAwesomeIcon icon="trash" color="surface" />
    </Style_DeleteAction>)
  }

  const renderLeftActions = () => {
    return (<Style_EditAction>
      <FontAwesomeIcon icon="pen" color="surface" />
    </Style_EditAction>)
  }

  const onDeletePress = () => {
    const newExpenses = expenses?.filter(expense => expense.id !== id);
    setExpenses(newExpenses);
    setEditExpenseModalVisible(false);
  };

  const onPressItem = (id: string) => {
    setExpenseId(id);
    setEditExpenseModalVisible(true);
  };

  const onInfoPress = (id?: Expense['id']) => {
    if (!id) return;
    setExpenseId(id);
    setInfoModalVisible(true);
  }

  const animatedStyle = useAnimatedStyle(() => ({
    height: withTiming(height.value!, {
      duration: 250
    }, () => {
      if (height.value === 0) runOnJS(onDeletePress)()
    })
  }));

  return (<Swipeable
    ref={ref}
    renderRightActions={type === 'transaction' ? renderRightActions : undefined}
    renderLeftActions={renderLeftActions}
    overshootRight={false}
    overshootLeft={false}
    rightThreshold={130}
    leftThreshold={130}
    containerStyle={[ { overflow: "hidden" }, animatedStyle ]}
    onSwipeableOpen={(direction) => {
      if (direction === 'left') {
        height.value = 0;
      } else if (direction === 'right') {
        onPressItem(id);
        ref.current?.close()
      }
    }}
  >
    <Style_Item
      onLayout={(e) => {
        if (height.value !== 0) height.value = e.nativeEvent.layout.height
      }}
      onPress={() => onInfoPress(id)}
    >
      <View style={{ flex: 1 }}>
        {description}
        <Label weight="bold">{numberCurrency(amount)}</Label>
      </View>
      {type === 'fixed' && progressPaid}
    </Style_Item></Swipeable>)
};

export default Item;