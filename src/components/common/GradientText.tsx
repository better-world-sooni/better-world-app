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
} from '@shopify/react-native-skia';

export default function GradientText({text, fontSize, width, height}) {
  const font = useFont(require('assets/fonts/NotoSansKR-Bold.otf'), fontSize);
  if (font === null) {
    return null;
  }
  return (
    <Canvas style={{width, height}}>
      <Mask mask={<Text x={0} y={fontSize} text={text} font={font} />}>
        <Rect x={0} y={0} width={width} height={height}>
          <RadialGradient
            c={vec(0, 0)}
            r={height * 2}
            colors={['#AA37FF', '#286EFF']}
          />
        </Rect>
      </Mask>
    </Canvas>
  );
}
