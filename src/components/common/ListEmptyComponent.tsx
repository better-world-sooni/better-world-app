import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {IMAGES} from 'src/modules/images';
import {Div} from './Div';
import {Img} from './Img';
import {Span} from './Span';

export default function ListEmptyComponent({h}) {
  return (
    <Div h={h} itemsCenter justifyCenter bgWhite>
      <Img rounded10 h100 w100 source={IMAGES.betterWorldPlanet}></Img>
      <Div justifyCenter itemsCenter mt16>
        <Span bold>내용이 없습니다.</Span>
      </Div>
    </Div>
  );
}
