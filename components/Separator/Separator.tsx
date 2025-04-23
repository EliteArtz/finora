import styled, { css } from 'styled-components/native';


const Style_Separator = styled.View`
  height: 1px;
  ${({ theme }) => css`
    background-color: ${theme.color.light_transparency};
    margin-block: ${theme.size.m.px};
  `}
`

const Separator = () => {
  return (<Style_Separator />)
}

export default Separator;