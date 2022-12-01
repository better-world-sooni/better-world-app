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

export const DrawEventMemo = React.memo(
  DrawEvent,
  (props, nextProps) =>
    // _.isEqual(props?.drawEvent?.name, nextProps?.drawEvent?.name),
    false,
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
                <>
                  {drawEvent.status == DrawEventStatus.FINISHED && (
                    <Div
                      w={imageWidth}
                      h={imageWidth}
                      bg={'rgba(0,0,0,0.5)'}
                      rounded5
                      absolute
                      top0
                      left0></Div>
                  )}
                  {drawEvent.status == DrawEventStatus.FINISHED && (
                    <Div
                      absolute
                      mt={repost ? imageWidth / 1.5 / 20 : imageWidth / 20}
                      ml={repost ? imageWidth / 1.5 / 20 : imageWidth / 20}
                      px={repost ? imageWidth / 1.5 / 20 : imageWidth / 20}
                      py={repost ? imageWidth / 1.5 / 40 : imageWidth / 40}
                      bgGray500
                      zIndex={1}
                      rounded5
                      z100>
                      <Span bold fontSize={imageWidth / 10} white>
                        마감
                      </Span>
                    </Div>
                  )}
                  {drawEvent.status == DrawEventStatus.IN_PROGRESS && (
                    <Div
                      absolute
                      mt={repost ? imageWidth / 1.5 / 20 : imageWidth / 20}
                      ml={repost ? imageWidth / 1.5 / 20 : imageWidth / 20}
                      px={repost ? imageWidth / 1.5 / 20 : imageWidth / 20}
                      py={repost ? imageWidth / 1.5 / 40 : imageWidth / 40}
                      bg={Colors.primary.DEFAULT}
                      zIndex={1}
                      rounded5
                      z100>
                      <Span bold fontSize={imageWidth / 10} white>
                        {drawEvent?.expires_at
                          ? 'D-' +
                            (expireDay > 100
                              ? '99+'
                              : expireDay == 0
                              ? 'DAY'
                              : expireDay)
                          : '진행 중'}
                      </Span>
                    </Div>
                  )}
                  {drawEvent.status == DrawEventStatus.ANNOUNCED && (
                    <Div
                      absolute
                      mt={repost ? imageWidth / 1.5 / 20 : imageWidth / 20}
                      ml={repost ? imageWidth / 1.5 / 20 : imageWidth / 20}
                      px={repost ? imageWidth / 1.5 / 20 : imageWidth / 20}
                      py={repost ? imageWidth / 1.5 / 40 : imageWidth / 40}
                      zIndex={1}
                      rounded5
                      bg={Colors.secondary.DEFAULT}
                      z100>
                      <Span bold fontSize={imageWidth / 10} white>
                        당첨 발표
                      </Span>
                    </Div>
                  )}
                </>
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
            <Row pt12 pb5 itemsCenter px5={showCollection}>
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
                  <>
                    {drawEvent.status == DrawEventStatus.FINISHED && (
                      <Div
                        w={imageWidth}
                        h={imageWidth}
                        bg={'rgba(0,0,0,0.5)'}
                        rounded5
                        absolute
                        top0
                        left0></Div>
                    )}
                    {drawEvent.status == DrawEventStatus.FINISHED && (
                      <Div
                        absolute
                        mt={repost ? imageWidth / 30 : imageWidth / 20}
                        ml={repost ? imageWidth / 30 : imageWidth / 20}
                        zIndex={1}
                        rounded5
                        px={repost ? imageWidth / 20 : imageWidth / 20}
                        py={repost ? imageWidth / 20 : imageWidth / 40}
                        bgGray500
                        z100>
                        <Span bold fontSize={imageWidth / 8} white>
                          마감
                        </Span>
                      </Div>
                    )}
                    {drawEvent.status == DrawEventStatus.IN_PROGRESS && (
                      <Div
                        absolute
                        mt={repost ? imageWidth / 30 : imageWidth / 20}
                        ml={repost ? imageWidth / 30 : imageWidth / 20}
                        zIndex={1}
                        rounded5
                        px={repost ? imageWidth / 20 : imageWidth / 20}
                        py={repost ? imageWidth / 20 : imageWidth / 40}
                        bg={Colors.primary.DEFAULT}
                        z100>
                        <Span bold fontSize={imageWidth / 8} white>
                          {drawEvent?.expires_at
                            ? 'D-' +
                              (expireDay > 100
                                ? '99+'
                                : expireDay == 0
                                ? 'DAY'
                                : expireDay)
                            : '진행 중'}
                        </Span>
                      </Div>
                    )}
                    {drawEvent.status == DrawEventStatus.ANNOUNCED && (
                      <Div
                        absolute
                        mt={repost ? imageWidth / 30 : imageWidth / 20}
                        ml={repost ? imageWidth / 30 : imageWidth / 20}
                        zIndex={1}
                        rounded5
                        px={repost ? imageWidth / 20 : imageWidth / 20}
                        py={repost ? imageWidth / 20 : imageWidth / 40}
                        bg={Colors.secondary.DEFAULT}
                        z100>
                        <Span bold fontSize={imageWidth / 8} white>
                          당첨 발표
                        </Span>
                      </Div>
                    )}
                  </>
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
