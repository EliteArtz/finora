import React from 'react';
import styled, { css } from 'styled-components/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import Button from '../../components/Button/Button';
import { DrawerNavigationProp, } from '@react-navigation/drawer';
import FontAwesomeIcon from '../../components/FontAwesomeIcon/FontAwesomeIcon';

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
`;

const Style_TopActions = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  ${({ theme }) => css`
    padding: ${theme.size.l.px};
    padding-bottom: 0;
  `}
`;

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
            <FontAwesomeIcon color="primary" icon="bars" />
          </Button>
          <Button onPress={() => navigation.navigate('Settings')}>
            <FontAwesomeIcon color="primary" icon="gear" />
          </Button>
        </Style_TopActions>
        {children}
      </Style_Layout01>
    </Style_SafeView>
  );
};

export default Layout01;