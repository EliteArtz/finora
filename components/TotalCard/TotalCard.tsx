import BaseCard from "../BaseCard/BaseCard";
import {View} from "react-native";
import Label from "../Label/Label";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import React, {useEffect} from "react";
import styled, {css, useTheme} from "styled-components/native";
import {useMMKVNumber, useMMKVObject} from "react-native-mmkv";

const Style_Item = styled.Pressable`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const Style_Separator = styled.View`
  height: 1px;
  background-color: rgba(0, 0, 0, 0.1);
  ${({ theme }) => css`
    margin-block: ${theme.size.m.px};
  `}
`

const TotalCard = () => {
  const theme = useTheme();
  const [ currentValue, setCurrentValue ] = useMMKVNumber('currentValue');
  const [ fixValues, setFixValues ] = useMMKVObject<number[]>('fixValues');
  const [ remainingValue, setRemainingValue ] = useMMKVNumber('remainingValue');

  useEffect(() => {
    setCurrentValue(undefined)
    setFixValues([400, 178.02, 99.92, 30.69])
  }, []);

  useEffect(() => {
    if(!currentValue) {
      setRemainingValue(undefined);
      return;
    }
    const sum = fixValues?.reduce((acc, x) => acc + x, 0) || 0;
    setRemainingValue( currentValue - sum );
  }, [currentValue, fixValues])

  return (
    <BaseCard>
      <Style_Item onPress={() => setCurrentValue(1766)}>
        <View>
          <Label color="textSecondary" size="s">
            Aktueller Saldo
          </Label>
          <Label color="textSecondary" weight="bold">
            {currentValue?.toLocaleString(undefined, {
              style: "currency",
              currency: "EUR"
            }) || "-"}
          </Label>
        </View>
        <FontAwesomeIcon
          color={theme.color.textSecondary}
          size={theme.size.m.value * 16}
          icon="pen"
        />
      </Style_Item>
      <Style_Separator />
      <Label color="textSecondary" size="s">Restsaldo</Label>
      <Label color="primary" weight="bold" size="xxl">
        {remainingValue?.toLocaleString(undefined, {
          style: "currency",
          currency: "EUR"
        }) || "-"}
      </Label>
    </BaseCard>
  )
}

export default TotalCard;