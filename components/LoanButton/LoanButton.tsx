import React, { useState } from 'react';
import Button from '../Button/Button';
import { useMMKVObject } from 'react-native-mmkv';
import FontAwesomeIcon from '../FontAwesomeIcon/FontAwesomeIcon';
import { ScrollView, View } from 'react-native';
import { Loan } from '../../types/loans.type';
import Modal from '../Modal/Modal';
import Label from '../Label/Label';
import Input from '../Input/Input';

const LoanButton = () => {
  const [ isModalVisible, setIsModalVisible ] = useState(false);
  const [ loans, setLoans ] = useMMKVObject<Loan[]>('loans');

  const onPress = () => setIsModalVisible(true);
  const onRequestClose = () => setIsModalVisible(false);

  return (
    <>
      <Button type="primary" padding="l" onPress={onPress}>
        <FontAwesomeIcon
          color="textPrimary"
          size="l"
          icon="pen"
        />
      </Button>
      <View>
        <ScrollView>
          <Modal
            visible={isModalVisible}
            onRequestClose={onRequestClose}
          >
            <Label color="textSecondary" size="s">Eintrag verfassen</Label>
            <Input
              placeholder="Beschreibung (optional)"
            />
          </Modal>
        </ScrollView>
      </View>
    </>
  );
};

export default LoanButton;