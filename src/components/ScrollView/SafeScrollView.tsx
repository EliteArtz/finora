import styled, { css } from "styled-components/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SafeScrollView = styled.ScrollView.attrs(({ theme }) => {
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

export default SafeScrollView;