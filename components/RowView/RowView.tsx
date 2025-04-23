import { ViewProps } from 'react-native';
import styled, { css } from 'styled-components/native';

const Style_RowView = styled.View`
  flex-direction: row;
  align-items: center;
  ${({ theme }) => css`
    gap: ${theme.size.m.px}
  `}
`;

const RowView = ({ ...rest }: ViewProps) => {
  return (
    <Style_RowView {...rest} />
  );
};

export default RowView;