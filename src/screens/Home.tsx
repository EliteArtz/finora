import React from 'react';
import Layout01 from '../layouts/Layout01';
import styled, { css } from 'styled-components/native';
import TotalCard from '../components/TotalCard/TotalCard';
import ExpensesCard from '../components/ExpensesCard/ExpensesCard';
import ExpenseButton from '../components/ExpenseButton/ExpenseButton';
import SavingsCard from "../components/SavingsCard/SavingsCard";
import SafeScrollView from "../components/ScrollView/SafeScrollView";


const Style_BottomAction = styled.View`
  width: 100%;
  position: absolute;
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
const Home = () => {
  return (<Layout01>
    <SafeScrollView>
      <TotalCard />
      <SavingsCard />
      <Style_CardContainer>
        <ExpensesCard type="fixed" />
      </Style_CardContainer>
      <Style_CardContainer>
        <ExpensesCard type="variable" />
      </Style_CardContainer>
    </SafeScrollView>
    <Style_BottomAction>
      <ExpenseButton />
    </Style_BottomAction>
  </Layout01>);
};

export default Home;