import Layout01 from '../layouts/Layout01/Layout01';
import Button from '../components/Button/Button';
import { useMMKV, useMMKVString } from 'react-native-mmkv';
import styled, { css } from 'styled-components/native';
import Label from '../components/Label/Label';
import { Picker as RNPicker } from '@react-native-picker/picker';
import Picker from '../components/Picker/Picker';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Separator from '../components/Separator/Separator';

const Style_Settings = styled.ScrollView.attrs(({ theme }) => ({
  contentContainerStyle: {
    gap: theme.size.l.value * 16,
  }
}))`
  ${({ theme }) => css`
    padding-inline: ${theme.size.l.px};
  `}
`;

const Style_RowView = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  ${({ theme }) => css`
    padding-left: ${theme.size.m.px};
    gap: ${theme.size.m.px}
  `}
`;

const Style_FontAwesomeIcon = styled(FontAwesomeIcon).attrs(({ theme }) => ({
  color: theme.color.textPrimary,
}))``

const Settings = () => {
  const MMKV = useMMKV();
  const [ theme, setTheme ] = useMMKVString('theme');
  return (
    <Layout01>
      <Style_Settings>
        <Label size="xl" weight="bold">Einstellungen</Label>
        <Style_RowView>
          <Label><Style_FontAwesomeIcon icon='palette' /></Label>
          <Picker mode="dropdown" style={{flex: 1}} selectedValue={theme} onValueChange={(value) => setTheme(value as string)}>
            <RNPicker.Item value="light" label="Light Theme" />
            <RNPicker.Item value="dark" label="Dark Theme" />
          </Picker>
        </Style_RowView>
        <Separator />
        <Button onPress={() => MMKV.clearAll()}>
          <Label align='center'>Alle Daten löschen</Label>
        </Button>
      </Style_Settings>
    </Layout01>
  );
};

export default Settings;