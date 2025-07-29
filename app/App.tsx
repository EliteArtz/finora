import 'react-native-gesture-handler';
import React, { ComponentProps, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider } from 'styled-components/native';
import lightTheme, { darkTheme } from '../assets/style/theme';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

import Home from '../screens/Home';
import { createStaticNavigation } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';
import { useFonts } from '@expo-google-fonts/inter/useFonts';
import { Appearance, Platform, useColorScheme } from 'react-native';
import Settings from '../screens/Settings';
import { useMMKVString } from 'react-native-mmkv';
import LoanFunds from '../screens/LoanFunds';
import FontAwesomeIcon from '../components/FontAwesomeIcon/FontAwesomeIcon';

SplashScreen.setOptions({
  duration: 1000,
  fade: true
})

SplashScreen.preventAutoHideAsync()

library.add(fab, fas, far);

const RootStack = createDrawerNavigator({
  initialRouteName: 'Home',
  backBehavior: 'initialRoute',
  screenOptions: {
    drawerType: 'slide',
    drawerHideStatusBarOnOpen: true,
    swipeEdgeWidth: 50,
    headerShown: false,
  },
  screens: {
    Home: {
      screen: Home,
      options: {
        drawerIcon: ({ focused }) => (<FontAwesomeIcon icon="home" color={focused ? 'primary' : 'textSecondary'} />)
      },
    },
    LoanFunds: {
      screen: LoanFunds,
      options: {
        title: 'Schulden',
        drawerIcon: ({ focused }) => (
          <FontAwesomeIcon icon="hand-holding-dollar" color={focused ? 'primary' : 'textSecondary'} />)
      },
    },
    Settings: {
      screen: Settings,
      options: {
        title: 'Einstellungen',
        drawerIcon: ({ focused }) => (<FontAwesomeIcon icon="cog" color={focused ? 'primary' : 'textSecondary'} />)
      },
    },
  },

});

const Navigation = createStaticNavigation(RootStack);

const App = () => {
  const [ selectedTheme ] = useMMKVString('theme') || [ useColorScheme() ];
  const scheme = selectedTheme === 'dark' ? 'dark' : 'light';
  const invScheme = selectedTheme === 'dark' ? 'light' : 'dark';
  const themeObject = selectedTheme === 'dark' ? darkTheme : lightTheme;
  const navigatorTheme: ComponentProps<typeof Navigation>['theme'] = {
    colors: {
      primary: themeObject.color.primary,
      background: themeObject.color.background,
      card: themeObject.color.surface,
      text: themeObject.color.textPrimary,
      border: 'white',
      notification: 'white'
    },
    dark: selectedTheme === 'dark',
    fonts: {
      regular: {
        fontFamily: 'Inter_400Regular',
        fontWeight: 'normal'
      },
      medium: {
        fontFamily: 'Inter_700Bold',
        fontWeight: 'normal'
      },
      bold: {
        fontFamily: 'Inter_700Bold',
        fontWeight: 'bold'
      },
      heavy: {
        fontFamily: 'Inter_700Bold',
        fontWeight: 'bold'
      }
    }
  };
  const [ loaded ] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });

  useEffect(() => {
    Appearance.setColorScheme(scheme);
    if (Platform.OS === 'android') {
      NavigationBar.setButtonStyleAsync(scheme);
    }
  }, [ scheme, invScheme ]);

  useEffect(() => {
    if (!loaded) return;
    SplashScreen.hide();
  }, [ loaded ]);

  return loaded && (<React.StrictMode>
    <SafeAreaProvider>
      <ThemeProvider theme={themeObject}>
        <StatusBar style={invScheme} />
        <Navigation theme={navigatorTheme} />
      </ThemeProvider>
    </SafeAreaProvider>
  </React.StrictMode>);
};

export default App;