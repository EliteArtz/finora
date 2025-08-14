import styled, { css } from "styled-components/native";
import theme from "../../assets/style/theme";
import FontAwesomeIcon from "../FontAwesomeIcon/FontAwesomeIcon";
import Pressable from "../Pressable/Pressable";

type DotLightProps = React.PropsWithChildren & {
  color?: keyof typeof theme.color;
  isActive: boolean;
  setIsActive: (value: boolean) => void;
}

const Style_RowView = styled(Pressable)`
  flex-direction: row;
  align-items: center;
  ${({theme}) => css`
    gap: ${theme.size.s.value*8}px;
  `}
`

const Style_Checkbox = styled.View<{ $color: NonNullable<DotLightProps['color']>; $isActive: NonNullable<DotLightProps['isActive']> }>`
  aspect-ratio: 1/1;
  justify-content: center;
  align-items: center;
  ${({ theme, $color, $isActive }) => css`
    border: 2px solid ${theme.color[$color]};
    border-radius: ${theme.size.s.value*8}px;
    ${$isActive && css`background-color: ${theme.color[$color]};`};
    width: ${theme.size.m.px};
  `}
`;

const Checkbox = ({ color = 'primary', children, isActive, setIsActive }: DotLightProps) => {

  return (<Style_RowView onPress={() => setIsActive(!isActive)}>
    <Style_Checkbox $color={color} $isActive={isActive}>{isActive && <FontAwesomeIcon icon='check' size='s' color='surface' />}</Style_Checkbox>
    {children}
  </Style_RowView>)
}

export default Checkbox;