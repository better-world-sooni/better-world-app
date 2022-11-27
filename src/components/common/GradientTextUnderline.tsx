import React from 'react';
import {
  Canvas,
  Rect,
  RadialGradient,
  Text,
  Mask,
  Group,
  Circle,
  useFont,
  vec,
  Box,
  rect,
} from '@shopify/react-native-skia';

export default function GradientTextUnderline({
  text,
  fontSize,
  width,
  height,
  selected,
  notSelectedColor = '#000000',
}) {
  const font = selected
    ? useFont(require('assets/fonts/NotoSansKR-Bold.otf'), fontSize)
    : useFont(require('assets/fonts/NotoSansKR-Medium.otf'), fontSize - 2);
  if (font === null) {
    return null;
  }
  return selected ? (
    <Canvas style={{width, height}}>
      <Mask
        mask={
          <>
            <Text x={3} y={fontSize} text={text} font={font} />
            <Box box={rect(0, fontSize + 5, width, 2)}></Box>
          </>
        }>
        <Rect x={0} y={0} width={width} height={height}>
          <RadialGradient
            c={vec(0, 0)}
            r={height * 2}
            colors={['#AA37FF', '#286EFF']}
          />
        </Rect>
      </Mask>
    </Canvas>
  ) : (
    <Canvas style={{width, height}}>
      <Mask
        mask={
          <>
            <Text x={3} y={fontSize} text={text} font={font} />
          </>
        }>
        <Rect
          x={0}
          y={0}
          width={width}
          height={height}
          color={notSelectedColor}></Rect>
      </Mask>
    </Canvas>
  );
}
