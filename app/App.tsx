import 'react-native-gesture-handler';
import React from "react";
import {StatusBar} from 'expo-status-bar';
import {ThemeProvider} from 'styled-components/native';
import theme from "../assets/style/theme";

import {library} from "@fortawesome/fontawesome-svg-core";
import {fab} from "@fortawesome/free-brands-svg-icons";
import {fas} from "@fortawesome/free-solid-svg-icons";
import {far} from "@fortawesome/free-regular-svg-icons";

import Home from "../screens/Home";
import {createStaticNavigation} from "@react-navigation/native";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {createDrawerNavigator} from "@react-navigation/drawer";

library.add(fab, fas, far)

const RootStack = createDrawerNavigator({
  initialRouteName: 'Home',
  screenOptions: {
    headerShown: false,
    drawerActiveTintColor: theme.color.primary,
    drawerInactiveTintColor: theme.color.textPrimary
  },
  screens: {
    Home: {
      screen: Home,
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

const App = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <StatusBar style="auto" />
        <Navigation />
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;