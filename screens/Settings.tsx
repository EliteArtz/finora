import Layout01 from '../layouts/Layout01/Layout01';
import Button from '../components/Button/Button';
import {useMMKV, useMMKVString} from 'react-native-mmkv';
import styled, {css} from 'styled-components/native';
import Label from '../components/Label/Label';
import {Picker as RNPicker} from '@react-native-picker/picker';
import Picker from '../components/Picker/Picker';
import Separator from '../components/Separator/Separator';
import RowView from '../components/RowView/RowView';
import FontAwesomeIcon from '../components/FontAwesomeIcon/FontAwesomeIcon';
import Modal from '../components/Modal/Modal';
import React, {useState} from 'react';

const Style_Settings = styled.ScrollView.attrs(({ theme }) => ({
  contentContainerStyle: {
    gap: theme.size.l.value * 16,
  }
}))`
  ${({ theme }) => css`
    padding-inline: ${theme.size.l.px};
  `}
`;

const Settings = () => {
  const MMKV = useMMKV();
  const [ isConfirmModalVisible, setConfirmModalVisible ] = useState(false);
  const [ theme, setTheme ] = useMMKVString('theme');
  return (
    <Layout01>
      <Style_Settings>
        <Label size="xl" weight="bold">Einstellungen</Label>
        <RowView>
          <Label><FontAwesomeIcon color="textPrimary" icon="palette" /></Label>
          <Picker
            mode="dropdown"
            style={{ flex: 1 }}
            selectedValue={theme}
            onValueChange={(value) => setTheme(value as string)}
          >
            <RNPicker.Item value="light" label="Hell" />
            <RNPicker.Item value="dark" label="Dunkel" />
          </Picker>
        </RowView>
        <Separator />
        <Button type="danger" onPress={() => setConfirmModalVisible(true)}>
          <Label color="danger" align="center">Alle Daten löschen</Label>
        </Button>
        <Modal
          visible={isConfirmModalVisible}
          onRequestClose={() => setConfirmModalVisible(false)}
        >
          <Label align="center">Wirklich alle Daten löschen?</Label>
          <RowView>
            <Button
              type="danger" isFullWidth onPress={() => {
              MMKV.clearAll();
              setConfirmModalVisible(false);
            }}
            >
              <Label align="center" color="danger">Löschen</Label>
            </Button>
            <Button isFullWidth onPress={() => setConfirmModalVisible(false)}>
              <Label align="center">Abbrechen</Label>
            </Button>
          </RowView>
        </Modal>
      </Style_Settings>
    </Layout01>
  );
};

export default Settings;