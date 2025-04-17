import React from "react";
import {StatusBar} from 'expo-status-bar';
import styled, {css, ThemeProvider} from 'styled-components/native'
import Label from "../components/Label/Label";
import theme from "../assets/style/theme";

import {library} from "@fortawesome/fontawesome-svg-core";
import {fab} from "@fortawesome/free-brands-svg-icons";
import {fas} from "@fortawesome/free-solid-svg-icons";
import {far} from "@fortawesome/free-regular-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";

import Constants from 'expo-constants';

library.add(fab, fas, far)

const Style_App = styled.View`
  display: flex;
  flex: 1;
  ${({ theme }) => css`
    background-color: ${theme.color.background};
    padding-top: ${Constants.statusBarHeight + theme.size.xl.value * 16};
  `}
`;

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <StatusBar style="auto" />
      <Style_App>
        <Label>Test <FontAwesomeIcon icon="check" /></Label>
      </Style_App>
    </ThemeProvider>
  );
};

export default App;