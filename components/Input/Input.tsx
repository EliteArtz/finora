import {TextInputProps as RNTextInputProps} from "react-native";
import React from "react";
import styled, {css} from "styled-components/native";

type TextInputProps = RNTextInputProps & {
  isFullWidth?: boolean;
};

type StyleTextInputProps = {
  $isFullWidth: NonNullable<TextInputProps['isFullWidth']>;
}

const Style_TextInput = styled.TextInput.attrs<StyleTextInputProps>(({ theme }) => ({
  placeholderTextColor: theme.color.textSecondary,
}))`
  font-family: 'Inter_400Regular';
  ${({ theme }) => css`
    color: ${theme.color.textPrimary};
    padding: ${theme.size.s.px};
    border-bottom-color: ${theme.color.textPrimary};
    border-bottom-width: 1px;
  `}
  ${({ $isFullWidth }) => $isFullWidth && css`
    flex: 1;
  `}
`

const Input = ({ isFullWidth=false, ...rest }: TextInputProps) => {
  return (
    <Style_TextInput
      $isFullWidth={isFullWidth}
      {...rest}
    />
  )
}

export default Input;