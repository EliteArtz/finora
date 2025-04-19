import React from "react";
import styled, {css, useTheme} from 'styled-components/native';
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
    padding: ${theme.size.l.px};
  `}
`

const Style_TopActions = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const Layout01 = ({ children }: { children: React.ReactNode }) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();
  const theme = useTheme();

  return (
    <Style_SafeView
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <Style_Layout01>
        <Style_TopActions>
          <Button onPress={() => navigation.openDrawer()}>
            <FontAwesomeIcon
              color={theme.color.primary}
              size={theme.size.m.value * 16}
              icon="bars"
            />
          </Button>
          <Button>
            <FontAwesomeIcon
              color={theme.color.primary}
              size={theme.size.m.value * 16}
              icon="gear"
            />
          </Button>
        </Style_TopActions>
        {children}
      </Style_Layout01>
    </Style_SafeView>
  );
};

export default Layout01;