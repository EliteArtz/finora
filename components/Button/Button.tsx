import React, {ReactNode} from "react";
import styled, {css} from "styled-components/native";
import {PressableProps} from "react-native";
import theme from "../../assets/style/theme";

type ButtonProps = PressableProps & {
  children?: ReactNode;
  type?: 'default' | 'primary';
  padding?: keyof typeof theme.size;
  size?: keyof typeof theme.size;
  onPress?: PressableProps['onPress'];
};

type Style_ButtonProps = {
  $type: ButtonProps['type'];
  $padding: NonNullable<ButtonProps['padding']>;
  $size: NonNullable<ButtonProps['padding']>;
}

const Style_ButtonContainer = styled.View`
  border-radius: 999px;
  overflow: hidden;
`

const Style_Button = styled.Pressable<Style_ButtonProps>`
  border-radius: 999px;
  ${({ theme, $type, $padding, $size }) => css`
    color: ${theme.color.primary};
    background-color: ${$type === 'default' ? theme.color.surface : theme.color.primary};
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
        android_ripple={{
          color: 'rgba(0,0,0,0.2)',
          radius: 100,
          borderless: true
        }}
        {...rest}
      >{children}</Style_Button>
    </Style_ButtonContainer>
  )
}

export default Button;