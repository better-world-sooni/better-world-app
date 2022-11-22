import {MenuView} from '@react-native-menu/menu';
import React from 'react';
import {ActivityIndicator} from 'react-native';
import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Repeat,
  Zap,
} from 'react-native-feather';
import {Colors} from 'src/modules/styles';
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
import {createdAtText, getNowDifference} from 'src/utils/timeUtils';
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
  summary = false,
  showCollection = true,
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
  const actionIconDefaultProps = {
    width: 20,
    height: 20,
    color: Colors.gray[600],
    strokeWidth: 1.6,
  };

  const expireDay = getNowDifference(new Date(drawEvent?.expires_at));

  if (deleted) return null;
  return (
    <Row w={summary ? width / 2 : width} itemsCenter>
      <Div
        w={(summary ? width / 2 : width) - 2 * mx}
        mx={mx}
        my={my}
        relative
        bgWhite={!summary}>
        {currentNft.privilege &&
          currentNft.contract_address ==
            drawEvent.nft_collection.contract_address && (
            <Div
              absolute
              right0
              mt8
              mr10
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
        {summary ? (
          <Col
            relative
            onPress={
              selectableFn ? () => selectableFn(drawEvent) : gotoDrawEvent
            }>
            {drawEvent.image_uri && (
              <Div rounded>
                <Img
                  uri={drawEvent.image_uri}
                  w={width / 2 - 2 * mx}
                  h={width / 2 - 2 * mx}
                  rounded5></Img>
                {drawEvent.has_application == true && (
                  <>
                    {drawEvent.status == DrawEventStatus.FINISHED && (
                      <Div
                        w={width / 2 - 2 * mx}
                        h={width / 2 - 2 * mx}
                        bg={'rgba(0,0,0,0.5)'}
                        rounded5
                        absolute
                        top0
                        left0></Div>
                    )}
                    {drawEvent.status == DrawEventStatus.FINISHED && (
                      <Div
                        absolute
                        mt5
                        ml5
                        zIndex={1}
                        rounded5
                        px10
                        py5
                        bgGray500
                        z100>
                        <MenuView
                          onPressAction={handlePressMenu}
                          actions={drawEventOptions}>
                          <Span bold fontSize={14} white>
                            마감
                          </Span>
                        </MenuView>
                      </Div>
                    )}
                    {drawEvent.status == DrawEventStatus.IN_PROGRESS && (
                      <Div
                        absolute
                        mt5
                        ml5
                        zIndex={1}
                        rounded5
                        px10
                        py5
                        bg={Colors.primary.DEFAULT}
                        z100>
                        <MenuView
                          onPressAction={handlePressMenu}
                          actions={drawEventOptions}>
                          <Span bold fontSize={14} white>
                            {drawEvent?.expires_at
                              ? 'D-' + (expireDay > 100 ? '99+' : expireDay)
                              : '진행 중'}
                          </Span>
                        </MenuView>
                      </Div>
                    )}
                    {drawEvent.status == DrawEventStatus.ANNOUNCED && (
                      <Div
                        absolute
                        mt5
                        ml5
                        zIndex={1}
                        rounded5
                        px10
                        py5
                        bg={Colors.secondary.DEFAULT}
                        z100>
                        <MenuView
                          onPressAction={handlePressMenu}
                          actions={drawEventOptions}>
                          <Span bold fontSize={14} white>
                            당첨 발표
                          </Span>
                        </MenuView>
                      </Div>
                    )}
                  </>
                )}
              </Div>
            )}
            <Div itemsCenter py5>
              <Span bold fontSize={12} numberOfLines={1} gray500 textCenter>
                {drawEvent.nft_collection?.name}
              </Span>
            </Div>
            <Div itemsCenter>
              <Span bold fontSize={16} numberOfLines={1} textCenter>
                {drawEvent.name}
              </Span>
            </Div>
          </Col>
        ) : (
          <Col relative px25>
            <Row pt12 pb5 itemsCenter px5={showCollection}>
              {showCollection && (
                <>
                  <Col auto pr10 onPress={gotoNftCollection}>
                    <Img
                      uri={getNftCollectionProfileImage(
                        drawEvent.nft_collection,
                        100,
                        100,
                      )}
                      h28
                      w28
                      rounded14
                    />
                  </Col>
                  <Div>
                    <Span bold fontSize={13} numberOfLines={1} mr10>
                      {drawEvent.nft_collection?.name}
                    </Span>
                  </Div>
                </>
              )}
              <Div>
                <Span fontSize={13} numberOfLines={1} gray500>
                  {createdAtText(drawEvent?.created_at)}
                </Span>
              </Div>
            </Row>
            <Row
              pb15
              itemsCenter
              borderBottom={1.2}
              borderGray200
              onPress={
                selectableFn ? () => selectableFn(drawEvent) : gotoDrawEvent
              }>
              <Col selfStart>
                <Div mb14>
                  <Span bold fontSize={18} numberOfLines={2}>
                    {drawEvent.name}
                  </Span>
                </Div>
                <Div>
                  <Span bold fontSize={14} numberOfLines={3} gray500>
                    {drawEvent.description}
                  </Span>
                </Div>
                <Col />
              </Col>
              {drawEvent.image_uri && (
                <Div rounded ml15>
                  <Img
                    uri={drawEvent.image_uri}
                    w={(width * 110) / 380}
                    h={(width * 110) / 380}
                    rounded5></Img>
                  {drawEvent.has_application == true && (
                    <>
                      {drawEvent.status == DrawEventStatus.FINISHED && (
                        <Div
                          w={(width * 110) / 380}
                          h={(width * 110) / 380}
                          bg={'rgba(0,0,0,0.5)'}
                          rounded5
                          absolute
                          top0
                          left0></Div>
                      )}
                      {drawEvent.status == DrawEventStatus.FINISHED && (
                        <Div
                          absolute
                          mt5
                          ml5
                          zIndex={1}
                          rounded5
                          px10
                          py5
                          bgGray500
                          z100>
                          <MenuView
                            onPressAction={handlePressMenu}
                            actions={drawEventOptions}>
                            <Span bold fontSize={14} white>
                              마감
                            </Span>
                          </MenuView>
                        </Div>
                      )}
                      {drawEvent.status == DrawEventStatus.IN_PROGRESS && (
                        <Div
                          absolute
                          mt5
                          ml5
                          zIndex={1}
                          rounded5
                          px10
                          py5
                          bg={Colors.primary.DEFAULT}
                          z100>
                          <MenuView
                            onPressAction={handlePressMenu}
                            actions={drawEventOptions}>
                            <Span bold fontSize={14} white>
                              {drawEvent?.expires_at
                                ? 'D-' + (expireDay > 100 ? '99+' : expireDay)
                                : '진행 중'}
                            </Span>
                          </MenuView>
                        </Div>
                      )}
                      {drawEvent.status == DrawEventStatus.ANNOUNCED && (
                        <Div
                          absolute
                          mt5
                          ml5
                          zIndex={1}
                          rounded5
                          px10
                          py5
                          bg={Colors.secondary.DEFAULT}
                          z100>
                          <MenuView
                            onPressAction={handlePressMenu}
                            actions={drawEventOptions}>
                            <Span bold fontSize={14} white>
                              당첨 발표
                            </Span>
                          </MenuView>
                        </Div>
                      )}
                    </>
                  )}
                </Div>
              )}
            </Row>
            <Row py15 px15>
              <Col itemsCenter onPress={null}>
                <Row auto itemsCenter>
                  <Col pr10>
                    <Repeat {...actionIconDefaultProps} />
                  </Col>
                  <Col>
                    <Span
                      fontSize={15}
                      color={Colors.gray[600]}
                      style={{fontWeight: '600'}}>
                      {0}
                    </Span>
                  </Col>
                </Row>
              </Col>
              <Col />
              <Col itemsCenter onPress={null}>
                <Row auto itemsCenter>
                  <Col pr10>
                    <MessageCircle {...actionIconDefaultProps} />
                  </Col>
                  <Col>
                    <Span
                      fontSize={15}
                      color={Colors.gray[600]}
                      style={{fontWeight: '600'}}>
                      {0}
                    </Span>
                  </Col>
                </Row>
              </Col>
              <Col />
              <Col itemsCenter onPress={null}>
                <Row auto itemsCenter>
                  <Col pr10>
                    <Heart {...actionIconDefaultProps} />
                  </Col>
                  <Col>
                    <Span
                      fontSize={15}
                      color={Colors.gray[600]}
                      style={{fontWeight: '600'}}>
                      {0}
                    </Span>
                  </Col>
                </Row>
              </Col>
              <Col />
              <Col auto onPress={null}>
                {<Bookmark {...actionIconDefaultProps}></Bookmark>}
              </Col>
            </Row>
          </Col>
        )}
      </Div>
    </Row>
  );
}
