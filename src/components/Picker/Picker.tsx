import styled, { css } from 'styled-components/native';
import { Picker as RNPicker } from '@react-native-picker/picker';
import { ComponentProps } from 'react';
import theme from "../../assets/style/theme";

type BaseProps = {
  textColor?: keyof typeof theme.color
}

type PickerProps = ComponentProps<typeof RNPicker> & BaseProps;

const Style_Picker = styled(RNPicker)
  .attrs<{ $color: NonNullable<BaseProps['textColor']> }>(({
    theme,
    $color
  }) => ({
    dropdownIconColor: theme.color[$color],
  }))`
  ${({
    theme,
    $color
  }) => css`
    color: ${theme.color[$color]};
  `}
`;

const Picker = ({
  textColor = 'textPrimary',
  ...rest
}: PickerProps) => <Style_Picker $color={textColor} {...rest} />

export default Picker;