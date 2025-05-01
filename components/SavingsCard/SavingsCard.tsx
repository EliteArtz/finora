import BaseCard from '../BaseCard/BaseCard';
import Label from '../Label/Label';
import { View } from 'react-native';
import numberCurrency from '../../helpers/numberCurrency';
import FontAwesomeIcon from '../FontAwesomeIcon/FontAwesomeIcon';
import Pressable from '../Pressable/Pressable';
import styled from 'styled-components/native';
import React, { useState } from 'react';
import { useMMKVNumber } from 'react-native-mmkv';
import InputValueModal from '../../modals/InputValueModal/InputValueModal';

const Style_Item = styled(Pressable)`
  flex-direction: row;
  align-items: center;
`;

const SavingsCard = () => {
  const [ isModalVisible, setModalVisible ] = useState(false);
  const [ savings, setSavings ] = useMMKVNumber('savings');

  return (
    <BaseCard>
      <Style_Item onPress={() => setModalVisible(true)}>
        <View style={{ flex: 1 }}>
          <Label color="textSecondary" size="s">
            Ersparnis
          </Label>
          <Label color="textSecondary" weight="bold">
            {numberCurrency(savings)}
          </Label>
        </View>
        <FontAwesomeIcon icon="pen" color="textSecondary" />
        <InputValueModal
          label="Ersparnis"
          isVisible={isModalVisible}
          setIsVisible={setModalVisible}
          value={savings}
          setValue={setSavings}
        />
      </Style_Item>
    </BaseCard>
  );
};

export default SavingsCard;