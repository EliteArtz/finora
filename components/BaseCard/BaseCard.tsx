import React from "react";
import styled, {css} from "styled-components/native";

type BaseCardProps = {
  children?: React.ReactNode;
}

const Style_BaseCard = styled.View`
  display: flex;
  ${({ theme }) => css`
    background-color: ${theme.color.surface};
    padding: ${theme.size.l.px};
    border-radius: ${theme.size.s.px};
  `}
`

const BaseCard = ({children}: BaseCardProps) => {
  return (
    <Style_BaseCard>
      {children}
    </Style_BaseCard>
  )
}

export default BaseCard;