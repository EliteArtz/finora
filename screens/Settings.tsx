import Layout01 from '../layouts/Layout01';
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
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';
import { Expense } from '../types/expenses.type';
import { Platform } from 'react-native';
import { Loan } from "../types/loans.type";

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

  const importData = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/json',
    });

    if(result.canceled) return;

    const fileContent = await FileSystem.readAsStringAsync(result.assets[0].uri);
    const data = JSON.parse(fileContent);

    Object.keys(data).forEach((key) => {
      MMKV.set(key, typeof data[key] === 'object' ? JSON.stringify(data[key]) : data[key]);
    })
  }

  const exportData = async () => {
    const json = JSON.stringify({
      currentValue: MMKV.getNumber('currentValue'),
      savings: MMKV.getNumber('savings'),
      expenses: JSON.parse(MMKV.getString('expenses') || '[]') as Expense[],
      loans: JSON.parse(MMKV.getString('loans') || '[]') as Loan[],
    });
    const filename = `backup_${new Date().toISOString().split('T')[0]}.json`;
    const path = FileSystem.cacheDirectory + filename;
    await FileSystem.writeAsStringAsync(path, json);

    if(Platform.OS === 'android') {
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

      if (!permissions.granted) {
        await FileSystem.deleteAsync(path)
        return;
      }

      const uri = await FileSystem.StorageAccessFramework.createFileAsync(
        permissions.directoryUri,
        filename,
        'application/json'
      );
      await FileSystem.StorageAccessFramework.writeAsStringAsync(
        uri,
        json
      );
    } else {
      if(!await Sharing.isAvailableAsync()) {
        await FileSystem.deleteAsync(path)
        return;
      }
      await Sharing.shareAsync(path)
    }
    await FileSystem.deleteAsync(path)
  }

  return (
    <Layout01 isSettings>
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
        <Label weight='bold' size='l'>Daten</Label>
        <RowView>
          <Button onPress={importData} isFullWidth>
            <FontAwesomeIcon icon='file-import' />
            <Label>Import</Label>
          </Button>
          <Button onPress={exportData} isFullWidth>
            <FontAwesomeIcon icon='file-export' />
            <Label>Export</Label>
          </Button>
        </RowView>
        <Button type="danger" onPress={() => setConfirmModalVisible(true)}>
          <FontAwesomeIcon icon='warning' color='danger' />
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