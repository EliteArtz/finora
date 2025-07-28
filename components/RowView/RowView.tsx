import { ViewProps } from 'react-native';
import styled, { css } from 'styled-components/native';
import theme from "../../assets/style/theme";
import React from "react";

type RowViewProps = ViewProps & {
  gap?: keyof typeof theme.size;
  justifyContent?: React.CSSProperties['justifyContent']
}

const Style_RowView = styled.View<{ $gap: NonNullable<RowViewProps['gap']>; $justifyContent: NonNullable<RowViewProps['justifyContent']> }>`
  flex-direction: row;
  align-items: center;
  ${({ theme, $gap, $justifyContent }) => css`
    justify-content: ${$justifyContent};
    gap: ${theme.size[$gap].px}
  `}
`;

const RowView = ({ gap='m', justifyContent='flex-start', ...rest }: RowViewProps) => {
  return (
    <Style_RowView {...rest} $gap={gap} $justifyContent={justifyContent} />
  );
};

export default RowView;