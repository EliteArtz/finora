import React from 'react';
import Layout01 from '../layouts/Layout01/Layout01';
import styled, {css} from 'styled-components/native';
import Label from '../components/Label/Label';
import TotalCard from '../components/TotalCard/TotalCard';
import ExpensesCard from '../components/ExpensesCard/ExpensesCard';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ExpenseButton from '../components/ExpenseButton/ExpenseButton';
import SavingsCard from "../components/SavingsCard/SavingsCard";


const Style_BottomAction = styled.View`
  width: 100%;
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: center;
  ${({ theme }) => css`
    bottom: ${theme.size.xl.px};
  `}
`;

const Style_CardContainer = styled.View`
  display: flex;
  ${({ theme }) => css`
    gap: ${(theme.size.s.value / 1.5) * 16}px;
  `}
`;

const Style_ScrollView = styled.ScrollView.attrs(({ theme }) => {
  const insets = useSafeAreaInsets();
  return {
    contentContainerStyle: {
      gap: theme.size.l.value * 16,
      paddingBottom: insets.bottom,
    }
  };
})`
  display: flex;
  flex: 1;
  flex-direction: column;
  ${({ theme }) => css`
    padding-inline: ${theme.size.l.px};
  `}
`;

const Home = () => {

  return (
    <Layout01>
      <Style_ScrollView>
        <TotalCard />
        <SavingsCard />
        <Style_CardContainer>
          <Label size="s" color="textSecondary">
            Fixe Kosten
          </Label>
          <ExpensesCard type="fixed" />
        </Style_CardContainer>
        <Style_CardContainer>
          <Label size="s" color="textSecondary">
            Buchungen
          </Label>
          <ExpensesCard type="transaction" />
        </Style_CardContainer>
      </Style_ScrollView>
      <Style_BottomAction>
        <ExpenseButton />
      </Style_BottomAction>
    </Layout01>
  );
};

export default Home;