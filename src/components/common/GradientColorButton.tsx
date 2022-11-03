import React from 'react';
import {Canvas, Rect, RadialGradient, vec} from '@shopify/react-native-skia';
import {Div} from './Div';
import {Span} from './Span';

export default function GradientColorButton({
  width,
  height,
  text,
  onPress,
  fontSize,
  borderRadius = 0,
}) {
  return (
    <Div
      relative
      w={width}
      h={height}
      itemsCenter
      justifyCenter
      onPress={onPress}
      overflowHidden
      borderRadius={borderRadius}>
      <Canvas
        style={{
          width,
          height,
          position: 'absolute',
          borderRadius,
          overflow: 'hidden',
        }}>
        <Rect x={0} y={0} width={width} height={height}>
          <RadialGradient
            c={vec(0, 0)}
            r={width}
            colors={['#AA37FF', '#286EFF']}
          />
        </Rect>
      </Canvas>
      <Div>
        <Span white bold fontSize={fontSize}>
          {text}
        </Span>
      </Div>
    </Div>
  );
}
