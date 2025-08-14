import styled, { css } from "styled-components/native";
import theme from "../../assets/style/theme";

type DotLightProps = {
  color?: keyof typeof theme.color;
}

const Style_DotLight = styled.View<{ $color: NonNullable<DotLightProps['color']> }>`
  aspect-ratio: 1/1;
  border-radius: 999px;
  ${({ theme, $color }) => css`
    background-color: ${theme.color[$color]};
    width: ${theme.size.s.px};
  `}
`;

const DotLight = ({ color = 'primary' }: DotLightProps) => {

  return (<Style_DotLight $color={color} />)
}

export default DotLight;