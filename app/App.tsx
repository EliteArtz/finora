import React from "react";
import {StatusBar} from 'expo-status-bar';
import styled, {css, ThemeProvider} from 'styled-components/native'
import Label from "../components/Label/Label";
import theme from "../assets/style/theme";

const Style_App = styled.View`
  display: flex;
  flex: 1;
  ${({ theme }) => css`
    background-color: ${theme.color.background};
  `}
`;

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <StatusBar style="auto" />
      <Style_App>
        <Label>Text</Label>
      </Style_App>
    </ThemeProvider>
  );
};

export default App;