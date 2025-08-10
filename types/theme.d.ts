import lightTheme from "../assets/style/theme";

type LibraryTheme = typeof lightTheme;

declare module 'styled-components/native' {
  export interface DefaultTheme extends LibraryTheme {}
}

declare module "react" {
  interface DOMAttributes<T> {
    css?: CSSProp;
  }
}