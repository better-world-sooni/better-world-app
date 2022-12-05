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
import {
  useGotoDrawEvent,
  useGotoNewPost,
  useGotoNftCollectionProfile,
} from 'src/hooks/useGoto';
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
import useLike, {LikableType} from 'src/hooks/useLike';
import useBookmark, {BookmarkableType} from 'src/hooks/useBookmark';
import _ from 'lodash';
import {PostOwnerType} from 'src/screens/NewPostScreen';
import {cps} from 'redux-saga/effects';

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

const compareCondition = (props, nextProps) =>
  props?.drawEvent?.updated_at == nextProps?.drawEvent?.updated_at &&
  props?.drawEvent?.is_liked == nextProps?.drawEvent?.is_liked &&
  props?.drawEvent?.likes_count == nextProps?.drawEvent?.likes_count &&
  props?.drawEvent?.repost_count == nextProps?.drawEvent?.repost_count &&
  props?.drawEvent?.comments_count == nextProps?.drawEvent?.comments_count &&
  getNowDifference(props?.drawEvent?.expires_at) ==
    getNowDifference(nextProps?.drawEvent?.expires_at) &&
  props?.drawEvent?.is_bookmarked == nextProps?.drawEvent?.is_bookmarked;

export const DrawEventMemo = React.memo(DrawEvent, (props, nextProps) =>
  compareCondition(props, nextProps),
);

function DrawEvent({
  drawEvent: initialDrawEvent,
  width,
  mx,
  my,
  selectableFn = null,
  summary = false,
  showCollection = true,
  repost = false,
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
    image_uri: drawEvent?.image_uri
      ? drawEvent.image_uri
      : drawEvent?.image_uris && drawEvent.image_uris.length != 0
      ? drawEvent.image_uris[0]
      : null,
    hasApplication: drawEvent.has_application == true ? true : false,
  });
  const drawEventStatus = getDrawEventStatus({drawEvent});
  const gotoNftCollection = useGotoNftCollectionProfile({
    nftCollection: drawEvent.nft_collection,
  });
  const gotoNewPost = useGotoNewPost({
    postOwnerType: PostOwnerType.Nft,
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
  const [liked, likesCount, handlePressLike] = useLike(
    drawEvent.is_liked,
    drawEvent.likes_count,
    LikableType.DrawEvent,
    drawEvent.id,
  );
  const [bookmarked, handlePressBookmark] = useBookmark(
    drawEvent.is_bookmarked,
    BookmarkableType.DrawEvent,
    drawEvent.id,
  );

  const actionIconDefaultProps = {
    width: 17,
    height: 17,
    color: Colors.gray[600],
    strokeWidth: 1.6,
  };
  const actionTextDefaultProps = {
    fontSize: 14,
    color: Colors.gray[500],
    style: {fontWeight: '600'},
  };
  const heartProps = liked
    ? {
        ...actionIconDefaultProps,
        fill: Colors.danger.DEFAULT,
        color: Colors.danger.DEFAULT,
      }
    : actionIconDefaultProps;

  const bookmarkProps = bookmarked
    ? {
        ...actionIconDefaultProps,
        fill: Colors.blue.DEFAULT,
        color: Colors.blue.DEFAULT,
      }
    : actionIconDefaultProps;
  const expireDay = getNowDifference(drawEvent?.expires_at);
  const imageWidth = summary
    ? width
    : repost
    ? (width * 120) / 380
    : (width * 110) / 380;

  if (deleted) return null;
  return (
    <Div w={width} mx={mx} my={my} relative bgWhite={!summary}>
      {currentNft.privilege &&
        currentNft.contract_address ==
          drawEvent.nft_collection.contract_address &&
        !repost && (
          <Div absolute right0 mt6 mr10 zIndex={1} z100>
            <MenuView
              onPressAction={!repost && handlePressMenu}
              actions={drawEventOptions}>
              <Div p4>
                {loading ? (
                  <ActivityIndicator />
                ) : (
                  <MoreHorizontal color={Colors.black} width={18} height={18} />
                )}
              </Div>
            </MenuView>
          </Div>
        )}
      {summary ? (
        <Col
          relative
          onPress={
            selectableFn
              ? !repost && (() => selectableFn(drawEvent))
              : !repost && gotoDrawEvent
          }>
          {(drawEvent.image_uri ||
            (drawEvent.image_uris && drawEvent.image_uris.length != 0)) && (
            <Div rounded>
              {drawEvent.image_uri && (
                <Img
                  uri={drawEvent.image_uri}
                  w={imageWidth}
                  h={imageWidth}
                  rounded5></Img>
              )}
              {drawEvent.image_uris && drawEvent.image_uris[0] && (
                <Img
                  uri={drawEvent.image_uris[0]}
                  w={imageWidth}
                  h={imageWidth}
                  rounded5></Img>
              )}
              {drawEvent.has_application == true && (
                <DrawEventStatusBanner
                  mt={repost ? imageWidth / 1.5 / 20 : imageWidth / 20}
                  ml={repost ? imageWidth / 1.5 / 20 : imageWidth / 20}
                  px={repost ? imageWidth / 1.5 / 20 : imageWidth / 20}
                  py={repost ? imageWidth / 1.5 / 40 : imageWidth / 40}
                  imageWidth={imageWidth}
                  Status={drawEvent.status}
                  expires_at={drawEvent?.expires_at}
                  fontSize={imageWidth / 12}
                />
              )}
            </Div>
          )}
          <Div itemsCenter py5>
            <Span fontSize={12} numberOfLines={1} gray500 textCenter>
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
        <Col relative px25={!repost}>
          {!repost && (
            <Row py12 itemsCenter>
              {showCollection && (
                <Row itemsCenter onPress={!repost && gotoNftCollection}>
                  <Col auto pr10>
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
                </Row>
              )}
              <Div>
                <Span fontSize={13} numberOfLines={1} gray500>
                  {createdAtText(drawEvent?.created_at)}
                </Span>
              </Div>
            </Row>
          )}
          <Row
            pb15={!repost}
            itemsCenter
            borderBottom={repost ? 0 : 1.2}
            borderGray200={!repost}
            onPress={
              selectableFn
                ? !repost && (() => selectableFn(drawEvent))
                : !repost && gotoDrawEvent
            }>
            {!repost && (
              <Col selfStart>
                <Div mb14>
                  <Span
                    bold
                    fontSize={(imageWidth - 14) / 2 / 3}
                    numberOfLines={2}>
                    {drawEvent.name}
                  </Span>
                </Div>
                <Div>
                  <Span
                    fontSize={(imageWidth - 14) / 2 / 3.5}
                    numberOfLines={3}
                    gray500>
                    {drawEvent.description}
                  </Span>
                </Div>
                <Col />
              </Col>
            )}
            {(drawEvent.image_uri ||
              (drawEvent.image_uris && drawEvent.image_uris.length != 0)) && (
              <Div rounded ml15={!repost} mr15={repost}>
                {drawEvent.image_uri && (
                  <Img
                    uri={drawEvent.image_uri}
                    w={imageWidth}
                    h={imageWidth}
                    rounded5></Img>
                )}
                {drawEvent.image_uris && drawEvent.image_uris[0] && (
                  <Img
                    uri={drawEvent.image_uris[0]}
                    w={imageWidth}
                    h={imageWidth}
                    rounded5></Img>
                )}
                {drawEvent.has_application == true && (
                  <DrawEventStatusBanner
                    mt={repost ? imageWidth / 30 : imageWidth / 20}
                    ml={repost ? imageWidth / 30 : imageWidth / 20}
                    px={repost ? imageWidth / 20 : imageWidth / 20}
                    py={repost ? imageWidth / 20 : imageWidth / 40}
                    imageWidth={imageWidth}
                    Status={drawEvent.status}
                    expires_at={drawEvent?.expires_at}
                    fontSize={imageWidth / 8}
                  />
                )}
              </Div>
            )}
            {repost && (
              <Col selfStart>
                <Div mb7>
                  <Span
                    bold
                    fontSize={(imageWidth - 7) / 2 / 3}
                    numberOfLines={2}>
                    {drawEvent.name}
                  </Span>
                </Div>
                <Div>
                  <Span
                    fontSize={(imageWidth - 7) / 2 / 3.2}
                    numberOfLines={3}
                    gray500>
                    {drawEvent.description}
                  </Span>
                </Div>
                <Col />
              </Col>
            )}
          </Row>
          {!repost && (
            <Row py15 px15>
              <Col
                itemsCenter
                onPress={() => gotoNewPost({repostDrawEvent: drawEvent})}>
                <Row auto itemsCenter>
                  <Col pr10>
                    <Repeat {...actionIconDefaultProps} />
                  </Col>
                  <Col>
                    <Span {...actionTextDefaultProps}>
                      {drawEvent?.repost_count}
                    </Span>
                  </Col>
                </Row>
              </Col>
              <Col />
              <Col
                itemsCenter
                onPress={
                  selectableFn
                    ? () => selectableFn(drawEvent)
                    : () => gotoDrawEvent(true)
                }>
                <Row auto itemsCenter>
                  <Col pr10>
                    <MessageCircle {...actionIconDefaultProps} />
                  </Col>
                  <Col>
                    <Span {...actionTextDefaultProps}>
                      {drawEvent?.comments_count}
                    </Span>
                  </Col>
                </Row>
              </Col>
              <Col />
              <Col itemsCenter onPress={handlePressLike}>
                <Row auto itemsCenter>
                  <Col pr10>
                    <Heart {...heartProps} />
                  </Col>
                  <Col>
                    <Span {...actionTextDefaultProps}>{likesCount}</Span>
                  </Col>
                </Row>
              </Col>
              <Col />
              <Col auto onPress={handlePressBookmark}>
                {<Bookmark {...bookmarkProps}></Bookmark>}
              </Col>
            </Row>
          )}
        </Col>
      )}
    </Div>
  );
}

const DrawEventStatusBanner = ({
  imageWidth,
  Status,
  expires_at,
  mt,
  ml,
  px,
  py,
  fontSize,
}) => {
  const colors = {
    [DrawEventStatus.FINISHED]: {bgGray500: true},
    [DrawEventStatus.IN_PROGRESS]: {bg: Colors.primary.DEFAULT},
    [DrawEventStatus.ANNOUNCED]: {bg: Colors.secondary.DEFAULT},
  };
  const expireDay = getNowDifference(expires_at);
  const text = {
    [DrawEventStatus.FINISHED]: '마감',
    [DrawEventStatus.IN_PROGRESS]: expires_at
      ? 'D-' + (expireDay > 100 ? '99+' : expireDay == 0 ? 'DAY' : expireDay)
      : '진행 중',
    [DrawEventStatus.ANNOUNCED]: '당첨 발표',
  };
  const status =
    Status == DrawEventStatus.IN_PROGRESS && expires_at && expireDay < 0
      ? DrawEventStatus.FINISHED
      : Status;
  return (
    <>
      {status == DrawEventStatus.FINISHED && (
        <Div
          w={imageWidth}
          h={imageWidth}
          bg={'rgba(0,0,0,0.5)'}
          rounded5
          absolute
          top0
          left0></Div>
      )}
      <Div
        absolute
        mt={mt}
        ml={ml}
        px={px}
        py={py}
        {...colors[status]}
        zIndex={1}
        rounded5
        z100>
        <Span bold fontSize={fontSize} white>
          {text[status]}
        </Span>
      </Div>
    </>
  );
};
