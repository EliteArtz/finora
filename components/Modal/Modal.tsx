import styled, {css} from "styled-components/native";
import {ModalProps} from "react-native";

const Style_Modal = styled.Modal`
  background-color: rgba(0, 0, 0, 0.25);
`

const Style_ModalPositioning = styled.View`
  display: flex;
  flex: 1;
  background-color: rgba(0, 0, 0, 0.2);
  justify-content: center;
  align-items: center;
`

const Style_ModalContainer = styled.View`
  ${({ theme }) => css`
    background-color: ${theme.color.surface};
    padding: ${theme.size.m.px};
    gap: ${theme.size.m.px};
    border-radius: ${theme.size.s.px};
  `}
`

const Modal = ({children, ...rest}: ModalProps) => {
  return (
    <Style_Modal {...rest}>
      <Style_ModalPositioning>
        <Style_ModalContainer>
          {children}
        </Style_ModalContainer>
      </Style_ModalPositioning>
    </Style_Modal>
  )
};

export default Modal;