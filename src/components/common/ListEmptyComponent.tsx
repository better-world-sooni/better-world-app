import React from 'react';
import {IMAGES} from 'src/modules/images';
import {Div} from './Div';
import {Img} from './Img';

export default function ListEmptyComponent({h}) {
  return (
    <Div h={h} itemsCenter justifyCenter bgWhite>
      <Img h40 w200 source={IMAGES.notAThing}></Img>
    </Div>
  );
}
