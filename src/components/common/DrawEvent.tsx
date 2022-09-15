import React from 'react';
import useDrawEventStatus from 'src/hooks/useDrawEventStatus';
import {useGotoDrawEvent} from 'src/hooks/useGoto';
import {Div} from './Div';
import {Img} from './Img';
import {Span} from './Span';

export default function DrawEvent({
  drawEvent,
  width,
  mx,
  my,
  selectableFn = null,
}) {
  const gotoDrawEvent = useGotoDrawEvent({
    drawEventId: drawEvent.id,
  });
  const drawEventStatus = useDrawEventStatus({drawEvent});

  return (
    <Div
      w={width}
      mx={mx}
      my={my}
      relative
      onPress={selectableFn ? () => selectableFn(drawEvent) : gotoDrawEvent}>
      <Div
        absolute
        mt={-8}
        mx8
        zIndex={1}
        px12
        py6
        rounded12
        backgroundColor={drawEventStatus.color}>
        <Span bold white>
          {drawEventStatus.string}
        </Span>
      </Div>
      <Div>
        <Img uri={drawEvent.image_uri} w={width} h={width} rounded10></Img>
        <Div absolute bottom0 right0 m8 zIndex={1}>
          <Img uri={drawEvent.nft_collection.image_uri} h20 w20 rounded50 />
        </Div>
      </Div>
      <Div mt8>
        <Span gray700 bold numberOfLines={1}>
          {drawEvent.name}
        </Span>
      </Div>
      <Div mt4>
        <Span bold fontSize={16} numberOfLines={1}>
          {drawEvent.giveaway_merchandise}
        </Span>
      </Div>
    </Div>
  );
}
