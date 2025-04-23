import React, {ReactNode} from "react";
import styled, { css, DefaultTheme } from 'styled-components/native';
import {PressableProps} from "react-native";
import theme from '../../assets/style/theme';

type ButtonProps = PressableProps & {
  children?: ReactNode;
  type?: 'default' | 'primary' | 'danger';
  padding?: keyof typeof theme.size;
  size?: keyof typeof theme.size;
  onPress?: PressableProps['onPress'];
};

type Style_ButtonProps = {
  $type: ButtonProps['type'];
  $padding: NonNullable<ButtonProps['padding']>;
  $size: NonNullable<ButtonProps['padding']>;
}

const handleButtonType = (type: ButtonProps['type'], theme: DefaultTheme) => {
  switch (type) {
    case 'primary':
      return theme.color.primary;
    case 'danger':
      return theme.color.danger;
    default:
      return theme.color.surface
  }
}

const Style_ButtonContainer = styled.View`
  border-radius: 999px;
  overflow: hidden;
`

const Style_Button = styled.Pressable.attrs<Style_ButtonProps>(({theme}) => ({
  android_ripple: {
    color: theme.color.light_transparency,
    borderless: true,
  }
}))`
  border-radius: 999px;
  ${({ theme, $type, $padding, $size }) => css`
    background-color: ${handleButtonType($type, theme)};
    font-size: ${theme.size[$size].px};
    padding: ${theme.size[$padding].px};
  `}
`

const Button = ({
  children,
  type = 'default',
  padding = 'm',
  size = 'xl',
  ...rest
}: ButtonProps) => {
  return (
    <Style_ButtonContainer>
      <Style_Button
        $type={type}
        $padding={padding}
        $size={size}
        {...rest}
      >{children}</Style_Button>
    </Style_ButtonContainer>
  )
}

export default Button;