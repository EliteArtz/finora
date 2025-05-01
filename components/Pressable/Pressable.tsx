import { PressableProps } from 'react-native';
import styled from 'styled-components/native';

const Style_Pressable = styled.Pressable.attrs(({ theme }) => ({
  android_ripple: {
    color: theme.color.light_transparency,
  },
  hitSlop: theme.size.s.value * 16,
}))``;

const Pressable = ({ ...rest }: PressableProps) => {
  return (
    <Style_Pressable {...rest} />
  );
};

export default Pressable;