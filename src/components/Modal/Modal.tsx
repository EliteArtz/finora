import styled, { css } from 'styled-components/native';
import { Modal as RNModal, ModalProps, Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Style_Backdrop = styled.Pressable`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
`;

const Style_ModalContainer = styled.View`
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

const Style_KeyboardAvoidingView = styled.KeyboardAvoidingView.attrs({
  behavior: Platform.OS === 'ios' ? 'padding' : 'height'
})`
  flex: 1;
`

const Modal = ({
  children,
  animationType = 'fade',
  transparent = true,
  ...rest
}: ModalProps) => {
  const insets = useSafeAreaInsets();
  return (
    <View>
      <RNModal
        animationType={animationType}
        transparent={transparent}
        statusBarTranslucent
        {...rest}
      >
        <Style_Backdrop onPress={rest.onRequestClose} />
        <Style_KeyboardAvoidingView
          style={{
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          }}
        >
          <Style_ModalContainer>
            {children}
          </Style_ModalContainer>
        </Style_KeyboardAvoidingView>
      </RNModal>
    </View>
  );
};

export default Modal;