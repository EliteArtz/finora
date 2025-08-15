import { ViewProps } from 'react-native';
import styled, { css } from 'styled-components/native';
import theme from "../../assets/style/theme";
import React from "react";

type RowViewProps = {
  gap?: keyof typeof theme.size;
  justifyContent?: React.CSSProperties['justifyContent']
  alignItems?: React.CSSProperties['alignItems']
  flexWrap?: React.CSSProperties['flexWrap']
}

type Style_RowViewProps = Required<{
  [K in keyof RowViewProps as `$${K}`]: RowViewProps[K];
}>

const Style_RowView = styled.View<Style_RowViewProps>`
  flex-direction: row;
  ${({ theme, $gap, $justifyContent, $alignItems, $flexWrap }) => css`
    justify-content: ${$justifyContent};
    align-items: ${$alignItems};
    flex-wrap: ${$flexWrap};
    column-gap: ${theme.size[$gap].px}
  `}
`;

const RowView = ({ gap='m', justifyContent='flex-start', alignItems='center', flexWrap='wrap', ...rest }:  ViewProps & RowViewProps) => {
  return (
    <Style_RowView {...rest} $gap={gap} $justifyContent={justifyContent} $alignItems={alignItems} $flexWrap={flexWrap} />
  );
};

export default RowView;