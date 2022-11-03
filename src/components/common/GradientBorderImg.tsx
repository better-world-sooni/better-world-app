import React from 'react';
import {
  Canvas,
  Circle,
  ImageShader,
  RadialGradient,
  useImage,
  vec,
} from '@shopify/react-native-skia';

export default function GradientBorderImg({radius, borderWidth, uri}) {
  const image = useImage(uri);
  if (image === null) {
    return null;
  }
  return (
    <Canvas
      style={{
        width: (radius + borderWidth) * 2,
        height: (radius + borderWidth) * 2,
      }}>
      <Circle
        cx={radius + borderWidth}
        cy={radius + borderWidth}
        r={radius + borderWidth}>
        <RadialGradient
          c={vec(0, 0)}
          r={(radius + borderWidth) * 2}
          colors={['#AA37FF', '#286EFF']}
        />
      </Circle>
      <Circle cx={radius + borderWidth} cy={radius + borderWidth} r={radius}>
        <ImageShader
          image={image}
          fit="cover"
          rect={{
            x: borderWidth,
            y: borderWidth,
            width: radius * 2,
            height: radius * 2,
          }}
        />
      </Circle>
    </Canvas>
  );
}
