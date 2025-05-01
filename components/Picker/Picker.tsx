import styled, { css } from 'styled-components/native';
import { Picker as RNPicker } from '@react-native-picker/picker';
import { ComponentProps } from 'react';


const Style_Picker = styled(RNPicker).attrs(({ theme }) => ({
  dropdownIconColor: theme.color.textPrimary,
}))`
  ${({ theme }) => css`
    color: ${theme.color.textPrimary};
  `}
`;

const Picker = ({ ...rest }: ComponentProps<typeof RNPicker>) => {
  return (
    <Style_Picker {...rest} />
  );
};

export default Picker;