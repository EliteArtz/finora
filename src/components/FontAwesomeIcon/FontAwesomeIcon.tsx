import styled, { DefaultTheme } from 'styled-components/native';
import { FontAwesomeIcon as RNFontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { ComponentProps } from 'react';

type FontAwesomeIconProps = Omit<ComponentProps<typeof RNFontAwesomeIcon>, 'color' | 'size'> & {
  color?: keyof DefaultTheme['color'];
  size?: keyof DefaultTheme['size'];
}

type StyleFontAwesomeIconProps = {
  $color: NonNullable<FontAwesomeIconProps['color']>;
  $size: NonNullable<FontAwesomeIconProps['size']>;
}

const Style_FontAwesomeIcon = styled(RNFontAwesomeIcon).attrs<StyleFontAwesomeIconProps>(({
  theme,
  $color,
  $size
}) => ({
  color: theme.color[$color],
  size: theme.size[$size].value * 16,
}))``;

const FontAwesomeIcon = ({ color = 'textPrimary', size = 'm', ...rest }: FontAwesomeIconProps) => {
  return (
    <Style_FontAwesomeIcon
      $color={color}
      $size={size}
      {...rest}
    />
  );
};

export default FontAwesomeIcon;