import theme from "../assets/style/theme";

type ThemeType = typeof theme;

declare module 'styled-components/native' {
  export interface DefaultTheme extends ThemeType {}
}

declare module "react" {
  interface DOMAttributes<T> {
    css?: CSSProp;
  }
}