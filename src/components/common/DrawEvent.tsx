import {MenuView} from '@react-native-menu/menu';
import React from 'react';
import {ActivityIndicator} from 'react-native';
import {Eye, MoreHorizontal} from 'react-native-feather';
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
import TruncatedText from './TruncatedText';

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
  const shadowProps = {
    style: {
      shadowOffset: {
        width: 4,
        height: 4,
      },
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 2,
    },
  };

  if (deleted) return null;

  return (
    <Div borderBottom={0.5} borderGray200>
      <Div
        w={width}
        mx={mx}
        my={my}
        relative
        onPress={selectableFn ? () => selectableFn(drawEvent) : gotoDrawEvent}>
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
                    <MoreHorizontal
                      color={Colors.white}
                      width={18}
                      height={18}
                    />
                  )}
                </Div>
              </MenuView>
            </Div>
          )}
        <Div rounded10 {...shadowProps}>
          <Img
            uri={drawEvent.image_uri}
            w={width}
            h={width / 2}
            rounded10
            opacity={
              drawEvent.status == DrawEventStatus.FINISHED ? 0.6 : 1
            }></Img>
          <Row
            absolute
            bottom8
            right8
            bg={'rgba(0,0,0,0.5)'}
            px10
            py7
            rounded7
            itemsCenter>
            <Col auto mr4>
              <Eye color={Colors.white} width={12} height={12} />
            </Col>
            <Col auto>
              <Span white bold fontSize={10}>{`${drawEvent.read_count}`}</Span>
            </Col>
          </Row>
          <Div absolute top8 left8>
            <Img uri={drawEvent.nft_collection.image_uri} h30 w30 rounded50 />
          </Div>
        </Div>
        <Row mt4 itemsCenter>
          <Div mt4>
            <Span bold fontSize={20}>
              <Div
                px10
                py4
                rounded10
                bgPrimary={drawEvent?.has_application}
                bgInfo={!drawEvent?.has_application}>
                <Span white bold>
                  {drawEvent?.has_application ? '공지' : '이벤트'}
                </Span>
              </Div>{' '}
              {drawEvent.name}
            </Span>
          </Div>
        </Row>
        <Div mt8>
          {drawEvent.has_application ? (
            <Span gray600 medium fontSize={14} numberOfLines={1}>
              {drawEvent.giveaway_merchandise}
            </Span>
          ) : (
            <TruncatedText
              maxLength={30}
              text={drawEvent.description}
              spanProps={{
                gray600: true,
                medium: true,
                fontSize: 14,
                numberOfLines: 2,
              }}
            />
          )}
        </Div>
      </Div>
    </Div>
  );
}
