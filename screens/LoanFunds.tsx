import Label from "../components/Label/Label";
import Layout01 from "../layouts/Layout01/Layout01";
import styled, {css} from 'styled-components/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

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

const LoanFunds = () => {
  return (
    <Layout01>
      <Style_ScrollView>
        <Label size="xl" weight="bold">Leihgelder</Label>
      </Style_ScrollView>
    </Layout01>
  );
}

export default LoanFunds;