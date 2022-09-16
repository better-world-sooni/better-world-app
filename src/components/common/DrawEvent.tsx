import {MenuView} from '@react-native-menu/menu';
import React from 'react';
import {ActivityIndicator} from 'react-native';
import {MoreHorizontal} from 'react-native-feather';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import useDrawEventStatus, {
  DrawEventStatus,
} from 'src/hooks/useDrawEventStatus';
import {useGotoDrawEvent} from 'src/hooks/useGoto';
import useUpdateDrawEvent from 'src/hooks/useUpdateDrawEvent';
import {Div} from './Div';
import {Img} from './Img';
import {Span} from './Span';

enum DrawEventOption {
  DELETE = '0',
  PATCH_STATUS_TO_FINISHED = '1',
  PATCH_STATUS_TO_ANNOUNCED = '2',
  PATCH_STATUS_TO_IN_PROGRESS = '3',
}

const drawEventOptions = [
  {
    id: DrawEventOption.DELETE,
    title: '삭제',
  },
  {
    title: '상태 바꾸기',
    subactions: [
      {
        id: DrawEventOption.PATCH_STATUS_TO_FINISHED,
        title: '마감으로 바꾸기',
      },
      {
        id: DrawEventOption.PATCH_STATUS_TO_ANNOUNCED,
        title: '당첨 발표로 바꾸기',
      },
      {
        id: DrawEventOption.PATCH_STATUS_TO_IN_PROGRESS,
        title: '진행 중으로 바꾸기',
      },
    ],
  },
];

export default function DrawEvent({
  drawEvent: initialDrawEvent,
  width,
  mx,
  my,
  selectableFn = null,
}) {
  const {drawEvent, loading, deleted, deleteDrawEvent, updateDrawEventStatus} =
    useUpdateDrawEvent({
      initialDrawEvent,
    });
  const gotoDrawEvent = useGotoDrawEvent({
    drawEventId: drawEvent.id,
  });
  const drawEventStatus = useDrawEventStatus({drawEvent});
  const handlePressMenu = ({nativeEvent: {event}}) => {
    if (event == DrawEventOption.DELETE) {
      deleteDrawEvent();
    }
    if (event == DrawEventOption.PATCH_STATUS_TO_FINISHED) {
      updateDrawEventStatus(DrawEventStatus.FINISHED);
    }
    if (event == DrawEventOption.PATCH_STATUS_TO_ANNOUNCED) {
      updateDrawEventStatus(DrawEventStatus.ANNOUNCED);
    }
    if (event == DrawEventOption.PATCH_STATUS_TO_IN_PROGRESS) {
      updateDrawEventStatus(DrawEventStatus.IN_PROGRESS);
    }
  };
  if (deleted) return null;

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

      <Div absolute right0 m8 zIndex={1} rounded100 bgBlack z100>
        <MenuView onPressAction={handlePressMenu} actions={drawEventOptions}>
          <Div p4>
            {loading ? (
              <ActivityIndicator />
            ) : (
              <MoreHorizontal color={Colors.white} width={18} height={18} />
            )}
          </Div>
        </MenuView>
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
