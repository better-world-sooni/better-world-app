import React from 'react';
import {IMAGES} from 'src/modules/images';
import {DEVICE_HEIGHT} from 'src/modules/styles';
import {Div} from './Div';
import {Img} from './Img';

export default function ListEmptyComponent({h}) {
  return (
    <Div h={h} itemsCenter justifyCenter bgWhite>
      <Img h60 w300 source={IMAGES.notAThing}></Img>
    </Div>
  );
}
