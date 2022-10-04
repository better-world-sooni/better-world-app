import {MenuView} from '@react-native-menu/menu';
import React from 'react';
import {ActivityIndicator} from 'react-native';
import {MoreHorizontal} from 'react-native-feather';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {shallowEqual, useSelector} from 'react-redux';
import getDrawEventStatus, {
  DrawEventStatus,
  EventApplicationStatus,
} from 'src/hooks/getDrawEventStatus';
import {useGotoDrawEvent} from 'src/hooks/useGoto';
import useUpdateDrawEvent from 'src/hooks/useUpdateDrawEvent';
import {RootState} from 'src/redux/rootReducer';
import {getNftName} from 'src/utils/nftUtils';
import {Col} from './Col';
import CountdownText from './CountdownText';
import {Div} from './Div';
import {Img} from './Img';
import {Row} from './Row';
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
  const {currentNft} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const {drawEvent, loading, deleted, deleteDrawEvent, updateDrawEventStatus} =
    useUpdateDrawEvent({
      initialDrawEvent,
    });
  const gotoDrawEvent = useGotoDrawEvent({
    drawEventId: drawEvent.id,
  });
  const drawEventStatus = getDrawEventStatus({drawEvent});

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

      {currentNft.privilege &&
        currentNft.contract_address ==
          drawEvent.nft_collection.contract_address && (
          <Div absolute right0 m8 zIndex={1} rounded100 bgBlack z100>
            <MenuView
              onPressAction={handlePressMenu}
              actions={drawEventOptions}>
              <Div p4>
                {loading ? (
                  <ActivityIndicator />
                ) : (
                  <MoreHorizontal color={Colors.white} width={18} height={18} />
                )}
              </Div>
            </MenuView>
          </Div>
        )}

      <Div>
        <Img
          uri={drawEvent.image_uri}
          w={width}
          h={width}
          rounded10
          opacity={
            drawEvent.status == DrawEventStatus.FINISHED ? 0.6 : 1
          }></Img>
        {drawEvent.expires_at ? (
          <Div absolute bottom8 right8 bgDanger py6 px8 rounded10>
            <CountdownText dueDate={drawEvent.expires_at} />
          </Div>
        ) : null}
      </Div>
      <Row mt8 itemsCenter>
        <Col auto pr8>
          <Img uri={drawEvent.nft_collection.image_uri} h25 w25 rounded50 />
        </Col>
        <Col>
          <Div>
            <Span gray700 bold numberOfLines={1}>
              {drawEvent.name}
            </Span>
          </Div>
          <Div mt4>
            <Span bold fontSize={16} numberOfLines={1}>
              {drawEvent.giveaway_merchandise}
            </Span>
          </Div>
        </Col>
      </Row>
    </Div>
  );
}
