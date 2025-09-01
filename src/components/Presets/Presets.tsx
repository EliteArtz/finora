import { Key } from "react";
import styled, { css } from "styled-components/native";
import Pressable from "../Pressable/Pressable";
import Label from "../Label/Label";
import RowView from "../RowView/RowView";

type Preset = {
  key: Key; label: string;
}

type PresetsProps = {
  items: Preset[]; selectedKey: Preset['key']; setSelectedKey: (key: Preset['key']) => void;
}

const Style_PresetItem = styled(Pressable)<{ $isSelected: boolean }>`
  border-radius: 999px;
  ${({
    theme,
    $isSelected
  }) => css`
    padding: ${theme.size.s.value * 4}px ${theme.size.m.value * 8}px;
    border: 1px solid ${theme.color.textSecondary};
    background-color: ${$isSelected ? theme.color.textSecondary : 'transparent'};
  `}
`

const Presets = ({
  items,
  selectedKey,
  setSelectedKey
}: PresetsProps) => {

  return <RowView gap="s" style={{ rowGap: 12 }} justifyContent="center">{items.map((item) => (<Style_PresetItem
    key={item.key}
    onPress={() => setSelectedKey(item.key)}
    $isSelected={item.key === selectedKey}
  >
    <Label size="s" color={item.key === selectedKey ? 'surface' : 'textSecondary'}>{item.label}</Label>
  </Style_PresetItem>))}</RowView>;
}

export default Presets;