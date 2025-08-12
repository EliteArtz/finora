import styled from 'styled-components/native';

const Pressable = styled.Pressable.attrs(({ theme }) => ({
  android_ripple: {
    color: theme.color.lightTransparency,
  },
  hitSlop: theme.size.s.value * 16,
}))``;

export default Pressable;