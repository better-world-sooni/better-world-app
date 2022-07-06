import React from 'react';
import {useGotoMerchandise} from 'src/hooks/useGoto';
import {getCommaSeparatedNumber} from 'src/utils/numberUtils';
import {Div} from './Div';
import {Img} from './Img';
import {Span} from './Span';

export default function Merchandise({
  merchandise,
  width,
  mx,
  my,
  selectableFn = null,
}) {
  const gotoMerchandise = useGotoMerchandise({
    merchandiseId: merchandise.id,
  });
  return (
    <Div
      w={width}
      mx={mx}
      my={my}
      relative
      onPress={
        selectableFn ? () => selectableFn(merchandise) : gotoMerchandise
      }>
      <Div absolute top0 m12 zIndex={1}>
        <Img uri={merchandise.nft_collection.image_uri} h30 w30 rounded50 />
      </Div>
      <Img uri={merchandise.image_uri} w={width} h={width} rounded10></Img>
      <Div mt8>
        <Span gray700 bold>
          {merchandise.name}
        </Span>
      </Div>
      <Div mt4>
        {!merchandise.is_airdrop_only ? (
          <Span bold fontSize={16}>
            {getCommaSeparatedNumber(merchandise.price)} 원
          </Span>
        ) : merchandise.coupon?.discount_percent == 100 ? (
          <Span bold success fontSize={16}>
            드랍 가능
          </Span>
        ) : (
          <Span bold fontSize={16}>
            주문불가
          </Span>
        )}
      </Div>
    </Div>
  );
}
