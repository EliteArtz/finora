import styled, {css} from "styled-components/native";
import {Modal as RNModal, ModalProps, View} from "react-native";

const Style_ModalPositioning = styled.View`
  display: flex;
  flex: 1;
  flex-direction: row;
  background-color: rgba(0, 0, 0, 0.4);
  justify-content: center;
  align-items: center;
  ${({ theme }) => css`
    padding: ${theme.size.l.px};
  `}
`

const Style_ModalContainer = styled.View`
  flex: 1;
  ${({ theme }) => css`
    background-color: ${theme.color.surface};
    padding: ${theme.size.m.px};
    gap: ${theme.size.m.px};
    border-radius: ${theme.size.s.px};
  `}
`

const Modal = ({
  children,
  animationType = 'fade',
  transparent = true,
  ...rest
}: ModalProps) => {
  return (
    <View>
      <RNModal
        animationType={animationType}
        transparent={transparent} {...rest}
      >
        <Style_ModalPositioning>
          <Style_ModalContainer>
            {children}
          </Style_ModalContainer>
        </Style_ModalPositioning>
      </RNModal>
    </View>
  )
};

export default Modal;