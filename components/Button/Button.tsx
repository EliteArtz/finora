import React, { ReactNode } from 'react';
import styled, { css, DefaultTheme } from 'styled-components/native';
import { PressableProps } from 'react-native';
import theme from '../../assets/style/theme';
import Pressable from '../Pressable/Pressable';

type ButtonProps = PressableProps & {
  children?: ReactNode;
  type?: 'default' | 'primary' | 'danger';
  padding?: keyof typeof theme.size;
  size?: keyof typeof theme.size;
  isFullWidth?: boolean;
  onPress?: PressableProps['onPress'];
};

type Style_ButtonProps = {
  $type: ButtonProps['type'];
  $padding: NonNullable<ButtonProps['padding']>;
  $size: NonNullable<ButtonProps['padding']>;
}

type Style_ButtonContainerProps = {
  $isFullWidth: ButtonProps['isFullWidth'];
}

const handleButtonType = (type: ButtonProps['type'], theme: DefaultTheme) => {
  switch (type) {
    case 'primary':
      return css`
        background-color: ${theme.color.primary};
      `;
    case 'danger':
      return css`
        border: 1px ${theme.color.danger};
      `;
    default:
      return css`
        background-color: ${theme.color.surface};
      `;
  }
};

const Style_ButtonContainer = styled.View<Style_ButtonContainerProps>`
  border-radius: 999px;
  overflow: hidden;
  ${({ $isFullWidth }) => $isFullWidth && css`
    flex: 1;
  `}
`;

const Style_Button = styled(Pressable).attrs<Style_ButtonProps>(() => ({
  android_ripple: {
    borderless: true,
  }
}))`
  flex-direction: row;
  border-radius: 999px;
  align-items: center;
  justify-content: center;
  ${({ theme, $type, $padding, $size }) => css`
    ${handleButtonType($type, theme)};
    font-size: ${theme.size[$size].px};
    padding: ${theme.size[$padding].px};
    gap: ${theme.size.s.value * 8}px;
  `}
`;

const Button = ({
  children,
  type = 'default',
  padding = 'm',
  size = 'xl',
  isFullWidth = false,
  ...rest
}: ButtonProps) => {
  return (
    <Style_ButtonContainer $isFullWidth={isFullWidth}>
      <Style_Button
        $type={type}
        $padding={padding}
        $size={size}
        {...rest}
      >{children}</Style_Button>
    </Style_ButtonContainer>
  );
};

export default Button;