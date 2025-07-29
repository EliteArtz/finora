import Modal from "../../components/Modal/Modal";
import RowView from "../../components/RowView/RowView";
import Label from "../../components/Label/Label";
import Button from "../../components/Button/Button";
import React, {useState} from "react";
import styled from "styled-components/native";
import Input from "../../components/Input/Input";
import parseValue from "../../helpers/parseValue";

type InputValueModalProps = {
  label: string;
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  value: number | undefined;
  setValue: React.Dispatch<React.SetStateAction<number | undefined>>;
}

const Style_FullInput = styled(Input)`
  flex: 1;
`;

const InputValueModal = ({
  label,
  isVisible,
  setIsVisible,
  value,
  setValue
}: InputValueModalProps) => {
  const [ editValue, setEditValue ] = useState(value?.toString());

  const onRequestClose = () => {
    setIsVisible(false);
    setEditValue(value?.toString());
  };

  const onSubmitEditing = () => {
    setIsVisible(false);
    setValue(editValue ? parseValue(editValue) : undefined);
  };

  return (
    <Modal
      visible={isVisible}
      onRequestClose={onRequestClose}
    >
      <RowView>
        <Style_FullInput

          keyboardType="decimal-pad"
          value={editValue}
          placeholder={label}
          returnKeyType='done'
          onChangeText={setEditValue}
          onSubmitEditing={onSubmitEditing}
        />
        <Label>€</Label>
      </RowView>
      <Button
        padding="s"
        onPress={onSubmitEditing}
      >
        <Label align="center">OK</Label>
      </Button>
    </Modal>
  )
}

export default InputValueModal;