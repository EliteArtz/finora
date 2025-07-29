import React, { ComponentProps } from "react";
import Modal from "../../components/Modal/Modal";
import Label from "../../components/Label/Label";
import RowView from "../../components/RowView/RowView";
import Button from "../../components/Button/Button";

type ConfirmModalProps = {
  heading: string;
  buttons: ComponentProps<typeof Button>[];
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<ConfirmModalProps['isVisible']>>;
}

const ConfirmModal = ({ heading, buttons, isVisible, setIsVisible }: ConfirmModalProps) => {
  const onRequestClose = () => {
    setIsVisible(false);
  }
  
  return (
    <Modal
      visible={isVisible}
      onRequestClose={onRequestClose}
    >
      <Label align="center">{heading}</Label>
      <RowView>
        {buttons.map((button, i) => (<Button key={i} {...button} isFullWidth />))}
      </RowView>
    </Modal>
  )
}

export default ConfirmModal;