import React from "react";
import styled, {css} from 'styled-components/native';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {ParamListBase, useNavigation} from "@react-navigation/native";
import Button from "../../components/Button/Button";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {DrawerNavigationProp,} from "@react-navigation/drawer";

const Style_SafeView = styled.View`
  display: flex;
  flex: 1;
  ${({ theme }) => css`
    background-color: ${theme.color.background};
  `}
`;

const Style_Layout01 = styled.View`
  display: flex;
  flex: 1;
  flex-direction: column;
  ${({ theme }) => css`
    gap: ${theme.size.l.px};
    padding-bottom: 0;
  `}
`

const Style_TopActions = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  ${({ theme }) => css`
    padding: ${theme.size.l.px};
    padding-bottom: 0;
  `}
`

const Style_FontAwesomeIcon = styled(FontAwesomeIcon).attrs(({ theme }) => ({
  color: theme.color.primary,
  size: theme.size.m.value * 16
}))``;

const Layout01 = ({ children }: { children?: React.ReactNode }) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();

  return (
    <Style_SafeView
      style={{
        paddingTop: insets.top,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <Style_Layout01>
        <Style_TopActions>
          <Button onPress={navigation.openDrawer}>
            <Style_FontAwesomeIcon icon="bars" />
          </Button>
          <Button onPress={() => navigation.navigate('Settings')}>
            <Style_FontAwesomeIcon icon="gear"/>
          </Button>
        </Style_TopActions>
        {children}
      </Style_Layout01>
    </Style_SafeView>
  );
};

export default Layout01;