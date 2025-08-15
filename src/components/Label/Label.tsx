import React from 'react';
import styled, { css } from 'styled-components/native';
import theme from '../../assets/style/theme';

type LabelProps = {
  children?: React.ReactNode;
  color?: keyof typeof theme['color'];
  size?: keyof typeof theme['size'];
  weight?: 'bold' | 'normal';
  align?: 'left' | 'center' | 'right';
}

type StyleLabelProps = {
  $color: NonNullable<LabelProps['color']>;
  $size: NonNullable<LabelProps['size']>;
  $weight: NonNullable<LabelProps['weight']>;
  $align: NonNullable<LabelProps['align']>;
};

const Style_Label = styled.Text<StyleLabelProps>`
    flex-shrink: 1;
  ${({ theme, $color, $size, $weight, $align }) => css`
    color: ${theme['color'][$color]};
    font-size: ${theme.size[$size].px};
    font-family: ${$weight === 'normal' ? 'Inter_400Regular' : 'Inter_700Bold'};
    text-align: ${$align};
  `}
`;

const Label = ({
  children,
  color = 'textPrimary',
  size = 'm',
  weight = 'normal',
  align = 'left'
}: LabelProps) => {
  return <Style_Label
    $color={color}
    $size={size}
    $weight={weight}
    $align={align}
  >{children}</Style_Label>;
};

export default Label;