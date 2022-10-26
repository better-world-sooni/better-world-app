import React from 'react';
import {Canvas, Rect, RadialGradient, vec} from '@shopify/react-native-skia';

export default function GradientColorRect({width, height}) {
  return (
    <Canvas
      style={{
        width,
        height,
      }}>
      <Rect x={0} y={0} width={width} height={height}>
        <RadialGradient
          c={vec(0, 0)}
          r={width}
          colors={['#AA37FF', '#286EFF']}
        />
      </Rect>
    </Canvas>
  );
}
