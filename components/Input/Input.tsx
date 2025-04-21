import {TextInputProps} from "react-native";
import React from "react";
import styled, {css} from "styled-components/native";

const Style_TextInput = styled.TextInput`
  min-width: 200px;
  ${({ theme }) => css`
    padding: ${theme.size.s.px};
    border-bottom-color: ${theme.color.textPrimary};
    border-bottom-width: 1px;
  `}
`

const Input = ({ ...rest }: TextInputProps) => {
  return (
    <Style_TextInput
      {...rest}
    />
  )
}

export default Input;