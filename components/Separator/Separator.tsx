import styled, { css, DefaultTheme } from 'styled-components/native';

type SeparatorProps = {
  space?: keyof DefaultTheme['size'] | 'none';
}

type Style_SeparatorProps = {
  $space: NonNullable<SeparatorProps['space']>;
}

const Style_Separator = styled.View<Style_SeparatorProps>`
  height: 1px;
  ${({ theme, $space }) => css`
    background-color: ${theme.color.light_transparency};
    ${$space !== 'none' && css`
      margin-block: ${theme.size[$space].px};
    `};
  `}
`;

const Separator = ({ space = 'm' }: SeparatorProps) => {
  return (<Style_Separator $space={space} />);
};

export default Separator;