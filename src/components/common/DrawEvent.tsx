import {MenuView} from '@react-native-menu/menu';
import React from 'react';
import {ActivityIndicator} from 'react-native';
import {Eye, MoreHorizontal, User} from 'react-native-feather';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {shallowEqual, useSelector} from 'react-redux';
import getDrawEventStatus, {
  DrawEventStatus,
  EventApplicationStatus,
} from 'src/hooks/getDrawEventStatus';
import {useGotoDrawEvent, useGotoNftCollectionProfile} from 'src/hooks/useGoto';
import useUpdateDrawEvent from 'src/hooks/useUpdateDrawEvent';
import {IMAGES} from 'src/modules/images';
import {RootState} from 'src/redux/rootReducer';
import {getNftCollectionProfileImage, getNftName} from 'src/utils/nftUtils';
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
  const gotoNftCollection = useGotoNftCollectionProfile({
    nftCollection: drawEvent.nft_collection,
  });

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
    <Div>
      <Div
        w={width}
        mx={mx}
        my={my}
        relative
        rounded5
        bgWhite={drawEvent.status !== DrawEventStatus.FINISHED}
        bgGray200={drawEvent.status == DrawEventStatus.FINISHED}
        onPress={selectableFn ? () => selectableFn(drawEvent) : gotoDrawEvent}>
        {currentNft.privilege &&
          currentNft.contract_address ==
            drawEvent.nft_collection.contract_address && (
            <Div
              absolute
              right0
              m8
              zIndex={1}
              rounded100
              bg={'rgba(0,0,0,0.5)'}
              z100>
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
        <Div rounded5 relative>
          <Img
            uri={drawEvent.image_uri}
            w={width}
            h={(width * 163) / 350}
            rounded5></Img>
          {drawEvent.status == DrawEventStatus.FINISHED && (
            <Div
              w={width}
              h={(width * 163) / 350}
              bg={'rgba(0,0,0,0.5)'}
              rounded5
              absolute
              top0
              left0></Div>
          )}
        </Div>
        <Row py20 itemsCenter px10>
          <Col
            auto
            pr10
            mr10
            onPress={gotoNftCollection}
            borderRight={1.2}
            borderGray200>
            <Img
              uri={getNftCollectionProfileImage(
                drawEvent.nft_collection,
                100,
                100,
              )}
              h40
              w40
              rounded50
            />
          </Col>
          <Col>
            <Div>
              <Span bold fontSize={16} numberOfLines={2}>
                {drawEvent.name}
              </Span>
            </Div>
            <Div mt5>
              <Span bold fontSize={12} numberOfLines={1} gray500>
                {drawEvent.description}
              </Span>
            </Div>
          </Col>
        </Row>
      </Div>
    </Div>
  );
}
