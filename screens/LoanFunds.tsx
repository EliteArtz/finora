import Label from '../components/Label/Label';
import Layout01 from '../layouts/Layout01/Layout01';
import styled, { css } from 'styled-components/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BaseCard from '../components/BaseCard/BaseCard';
import { CircularProgressBase } from 'react-native-circular-progress-indicator';
import { useMMKVObject } from 'react-native-mmkv';
import { Loan } from '../types/loans.type';
import { useEffect } from 'react';
import uuid from 'react-native-uuid';
import numberCurrency from '../helpers/numberCurrency';
import RowView from '../components/RowView/RowView';
import FontAwesomeIcon from '../components/FontAwesomeIcon/FontAwesomeIcon';
import Pressable from '../components/Pressable/Pressable';
import Separator from '../components/Separator/Separator';
import LoanButton from '../components/LoanButton/LoanButton';

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

const Style_ProgressBar = styled(CircularProgressBase).attrs(({ theme }) => ({
  circleBackgroundColor: theme.color.background,
  inActiveStrokeColor: theme.color.background,
  activeStrokeColor: theme.color.primary,
  inActiveStrokeWidth: 24,
  radius: 75,
  duration: 1000,
}))``;

const Style_ProgressBarContainer = styled.View`
  justify-content: center;
  align-items: center;
`;

const Style_Item = styled(Pressable)`
  ${({ theme }) => css`
    gap: ${theme.size.m.px};
  `}
`;

const Style_BottomAction = styled.View`
  width: 100%;
  position: absolute;
  flex-direction: row;
  justify-content: center;
  ${({ theme }) => css`
    bottom: ${theme.size.xl.px};
  `}
`;

const LoanFunds = () => {
  const [ loans, setLoans ] = useMMKVObject<Loan[]>('loans');

  useEffect(() => {
    setLoans([
      {
        id: uuid.v4(),
        description: 'Leihgeld an Mama',
        lend: [ 500 ],
        returned: [ 300 ],
      }
    ]);
  }, []);
  return (
    <Layout01>
      <Style_ScrollView>
        <Label size="xl" weight="bold">Leihgelder</Label>
        {loans?.map(({ id, description, lend, returned }) => {
          const totalLend = lend?.reduce((acc, amount) => (acc + amount), 0) || 0;
          const totalReturned = returned?.reduce((acc, amount) => (acc + amount), 0) || 0;
          const rest = totalLend - totalReturned;
          return (
            <BaseCard key={id}>
              <Style_Item>
                <RowView>
                  {description &&
                    <Label weight="bold">{description}</Label>
                  }
                  <FontAwesomeIcon
                    icon="pen"
                    color="textSecondary"
                    size="s"
                    style={{
                      marginLeft: 'auto',
                    }}
                  />
                </RowView>
                <Style_ProgressBarContainer>
                  <Style_ProgressBar
                    value={totalReturned}
                    maxValue={totalLend}
                  >
                    <Label align="center" weight="bold">{numberCurrency(totalReturned)}</Label>
                    <Label align="center" color="textSecondary" size="s">/{numberCurrency(totalLend)}</Label>
                  </Style_ProgressBar>
                </Style_ProgressBarContainer>
                <Separator space="none" />
                <RowView
                  style={{
                    justifyContent: 'space-between',
                  }}
                >
                  <Label color="textSecondary" size="s">
                    Restbetrag
                  </Label>
                  <Label color="textSecondary" size="s" weight="bold">
                    {numberCurrency(rest)}
                  </Label>
                </RowView>
              </Style_Item>
            </BaseCard>
          );
        })}
      </Style_ScrollView>
      <Style_BottomAction>
        <LoanButton />
      </Style_BottomAction>
    </Layout01>
  );
};

export default LoanFunds;