import styled, { css } from 'styled-components/native';
import { Modal as RNModal, ModalProps, Platform, View } from "react-native";

const Style_Backdrop = styled.Pressable`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
`;

const Style_ModalContainer = styled.KeyboardAvoidingView`
  align-self: stretch;
  margin-block: auto;
  ${({ theme }) => css`
    background-color: ${theme.color.surface};
    padding: ${theme.size.m.px};
    margin-inline: ${theme.size.l.px};
    gap: ${theme.size.m.px};
    border-radius: ${theme.size.s.px};
  `}
`;

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
        transparent={transparent}
        {...rest}
      >
        <Style_Backdrop onPress={rest.onRequestClose} />
        <Style_ModalContainer behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          {children}
        </Style_ModalContainer>
      </RNModal>
    </View>
  );
};

export default Modal;