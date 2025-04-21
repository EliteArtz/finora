import React, {useEffect} from "react";
import {useMMKVObject} from "react-native-mmkv";
import Label from "../Label/Label";
import BaseCard from "../BaseCard/BaseCard";
import numberCurrency from "../../helpers/numberCurrency";
import {Expense} from "../../types/expenses.type";
import styled, {css, useTheme} from "styled-components/native";
import {Pressable, View} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import CircularProgress from "react-native-circular-progress-indicator";

type ExpensesCardProps = {
  type: Expense['type']
}

const Style_ExpensesContainer = styled.View`
`

const Style_Item = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const Style_Separator = styled.View`
  height: 1px;
  background-color: rgba(0, 0, 0, 0.1);
  ${({ theme }) => css`
    margin-block: ${theme.size.s.px};
  `}
`

const ExpensesCard = ({ type }: ExpensesCardProps) => {
  const theme = useTheme();
  const [ expenses, setExpenses ] = useMMKVObject<Expense[]>('expenses');
  const filteredExpenses = expenses?.filter(expense => expense.type === type);

  useEffect(() => {
    setExpenses([
      {
        type: 'fixed',
        description: "Verpflegung",
        amount: 400,
        paid: [ 200 ]
      },
      {
        type: 'fixed',
        amount: 178.02,
        description: '1&1 Rechnung',
        paid: [ 30.69 ]
      },
      {
        type: 'fixed',
        amount: 30.69,
        description: 'Freenet Flat SIM',
        paid: [ 30.69 ]
      },
      {
        type: 'transaction',
        amount: 9.78,
        description: 'Netto Einkauf'
      },
      {
        type: 'transaction',
        amount: 59.99,
        description: 'Honkai Star Rail Top-Up'
      },
      {
        type: 'transaction',
        amount: 1.99,
        description: 'Netto Einkauf'
      }
    ])
  }, []);

  return (
    <BaseCard>
      <Style_ExpensesContainer>
        {filteredExpenses?.map((
          { amount, paid, description, type: eType },
          index
        ) => eType === type && (
          <React.Fragment>
            <Style_Item>
              <View>
                {description &&
                  <Label
                    color="textSecondary"
                    size="s"
                  >
                    {description}
                  </Label>
                }
                <Label weight="bold">{numberCurrency(amount)}</Label>
              </View>
              {eType === "fixed" ? (
                <Pressable onPress={() => alert("edited")} hitSlop={6}>
                  <CircularProgress
                    value={(paid && paid.reduce((acc, x) => acc + x, 0) || 0)}
                    duration={0}
                    radius={12}
                    maxValue={amount}
                    inActiveStrokeWidth={24}
                    activeStrokeWidth={10}
                    showProgressValue={false}
                    circleBackgroundColor={theme.color.background}
                    inActiveStrokeColor={theme.color.background}
                  />
                </Pressable>
              ) : (
                <Pressable onPress={() => alert("deleted")} hitSlop={6}>
                  <FontAwesomeIcon
                    icon="xmark"
                    size={theme.size.l.value * 16}
                    color={theme.color.textSecondary}
                  />
                </Pressable>
              )}
            </Style_Item>
            {(filteredExpenses.length - 1) !== index && (<Style_Separator />)}
          </React.Fragment>
        ))}
      </Style_ExpensesContainer>
    </BaseCard>
  )
}

export default ExpensesCard;