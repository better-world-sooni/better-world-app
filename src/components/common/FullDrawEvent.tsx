import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Div} from 'src/components/common/Div';
import {Row} from 'src/components/common/Row';
import {Col} from 'src/components/common/Col';
import {
  Bookmark,
  ChevronLeft,
  Heart,
  MessageCircle,
  Repeat,
  User,
  X,
} from 'react-native-feather';
import {useNavigation} from '@react-navigation/native';
import {Span} from 'src/components/common/Span';
import {Colors, DEVICE_WIDTH} from 'src/modules/styles';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import DefaultMarkdown from 'src/components/common/DefaultMarkdown';
import {Img} from 'src/components/common/Img';
import getDrawEventStatus, {
  EventApplicationStatus,
} from 'src/hooks/getDrawEventStatus';
import NewEventApplication from 'src/components/common/NewEventApplication';
import {Linking} from 'react-native';
import CountdownText from 'src/components/common/CountdownText';
import ImageSlideShow from 'src/components/common/ImageSlideShow';
import Animated from 'react-native-reanimated';
import NewComment, {ReplyToType} from './NewComment';
import Comment from './Comment';
import useScrollToEndRef from 'src/hooks/useScrollToEndRef';
import useLike, {LikableType} from 'src/hooks/useLike';
import useBookmark, {BookmarkableType} from 'src/hooks/useBookmark';
import {
  useGotoLikeList,
  useGotoNewPost,
  useGotoNftCollectionProfile,
  useGotoRepostDrawEventList,
} from 'src/hooks/useGoto';
import {PostOwnerType} from 'src/screens/NewPostScreen';
import {LikeListType} from 'src/screens/LikeListScreen';
import {createdAtText} from 'src/utils/timeUtils';
import {getNftCollectionProfileImage} from 'src/utils/nftUtils';

export default function FullDrawEvent({
  onlyComments = false,
  drawEvent,
  autoFocus = false,
}) {
  const shadowProps = {
    style: {
      shadowOffset: {
        width: 3,
        height: 3,
      },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 2,
    },
  };

  const {goBack} = useNavigation();
  const notchHeight = useSafeAreaInsets().top;
  const headerHeight = notchHeight + 50;
  const scrollToEndRef = useScrollToEndRef();

  const [congratsOn, setCongratsOn] = useState(false);
  useEffect(() => {
    setCongratsOn(
      drawEvent?.event_application?.status == EventApplicationStatus.SELECTED,
    );
  }, [drawEvent]);

  const [cachedComments, setCachedComments] = useState(
    drawEvent.comments || [],
  );
  useEffect(() => {
    setCachedComments(drawEvent.comments || []);
  }, [drawEvent.comments?.length]);
  useEffect(() => {
    return scrollToEndRef?.current?.scrollToEnd();
  }, []);
  const defaultReplyTo = {
    object: drawEvent,
    type: ReplyToType.DrawEvent,
  };
  const [replyTo, setReplyTo] = useState(defaultReplyTo);
  const handleNewCommentSuccess = useCallback(
    (newComment, replyToObject, replyToType) => {
      if (replyToType == ReplyToType.Comment) {
        const updatedCommentIndex = cachedComments.findIndex(comment => {
          return comment.id == replyToObject.id;
        });
        const repliedComment = cachedComments[updatedCommentIndex];
        const commentsOfRepliedComment = repliedComment.comments || [];
        const newcommentsOfRepliedComment =
          commentsOfRepliedComment.concat(newComment);
        const newRepliedComment = {
          ...repliedComment,
          comments: newcommentsOfRepliedComment,
        };
        const newCachedComments = cachedComments
          .slice(0, updatedCommentIndex)
          .concat(
            newRepliedComment,
            cachedComments.slice(updatedCommentIndex + 1),
          );
        setCachedComments(newCachedComments);
        resetReplyTo();
        return;
      }
      setCachedComments([newComment, ...cachedComments]);
    },
    [cachedComments],
  );
  const resetReplyTo = () => {
    setReplyTo(defaultReplyTo);
  };
  const handlePressReplyTo = useCallback(comment => {
    setReplyTo({
      object: comment,
      type: ReplyToType.Comment,
    });
  }, []);
  return (
    <>
      <Div h={headerHeight}>
        <Div
          absolute
          w={DEVICE_WIDTH}
          top={notchHeight + 5}
          borderBottom={onlyComments ? 0.5 : 0.5}
          borderGray200>
          <Row itemsCenter h40 px8>
            <Col auto onPress={goBack}>
              <ChevronLeft
                width={30}
                height={30}
                color={Colors.black}
                strokeWidth={1.4}
              />
            </Col>
            <Col itemsCenter>
              <Span bold fontSize={17} numberOfLines={1}>
                {onlyComments ? '댓글' : drawEvent?.name}
              </Span>
            </Col>
            <Col auto>
              <ChevronLeft height={30} color={Colors.white} strokeWidth={2} />
            </Col>
          </Row>
        </Div>
      </Div>
      <Div bgWhite flex={1}>
        <Animated.FlatList
          contentContainerStyle={{paddingBottom: 100}}
          ref={scrollToEndRef}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            !onlyComments && <DrawEvent drawEvent={drawEvent}></DrawEvent>
          }
          data={cachedComments}
          renderItem={({item}) => {
            return (
              <Comment
                key={(item as any).id}
                comment={item}
                onPressReplyTo={handlePressReplyTo}></Comment>
            );
          }}></Animated.FlatList>
        <NewComment
          autoFocus={autoFocus}
          replyToObject={replyTo.object}
          replyToType={replyTo.type}
          onSuccess={handleNewCommentSuccess}
          onPressExitReplyToComment={resetReplyTo}
        />
      </Div>
    </>
  );
}

function DrawEvent({drawEvent}) {
  const drawEventStatus = getDrawEventStatus({drawEvent});
  const gotoNewPost = useGotoNewPost({
    postOwnerType: PostOwnerType.Nft,
  });
  const gotorepostDrawEventList = useGotoRepostDrawEventList({
    eventId: drawEvent.id,
  });

  const gotoLikeList = useGotoLikeList({
    likableId: drawEvent.id,
    likableType: LikeListType.DrawEvent,
  });

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
  const gotoNftCollection = useGotoNftCollectionProfile({
    nftCollection: drawEvent.nft_collection,
  });
  return (
    <Div py5 bgWhite>
      <Row pt5 pb10 itemsCenter px20>
        <Row itemsCenter onPress={gotoNftCollection}>
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
        <Col>
          <Span fontSize={13} numberOfLines={1} gray500>
            {createdAtText(drawEvent?.created_at)}
          </Span>
        </Col>
        <Col />
        {drawEvent?.discord_link ? (
          <Col auto>
            <Col auto onPress={() => Linking.openURL(drawEvent?.discord_link)}>
              <Span bold gray600>
                본문 바로가기
              </Span>
            </Col>
          </Col>
        ) : null}
      </Row>
      <Div relative>
        {drawEvent.has_application == true &&
          drawEvent.image_uris &&
          drawEvent.image_uris.length != 0 && (
            <ImageSlideShow
              borderRadius={0}
              imageUris={drawEvent.image_uris}
              sliderWidth={DEVICE_WIDTH}
              sliderHeight={DEVICE_WIDTH}
            />
          )}
        <Div
          px25
          pb15
          pt15={
            drawEvent.has_application == true &&
            drawEvent.image_uris &&
            drawEvent.image_uris.length != 0
          }>
          <DefaultMarkdown children={drawEvent.description} />
        </Div>
        {drawEvent.has_application == false &&
          drawEvent.image_uris &&
          drawEvent.image_uris.length != 0 && (
            <ImageSlideShow
              borderRadius={0}
              imageUris={drawEvent.image_uris}
              sliderWidth={DEVICE_WIDTH}
              sliderHeight={DEVICE_WIDTH}
            />
          )}
      </Div>
      {drawEvent.has_application == true && (
        <NewEventApplication drawEvent={drawEvent} />
      )}
      <Row py15 px30 borderGray200 borderBottom={1.2} borderTop={1.2}>
        <Col itemsCenter>
          <Row auto itemsCenter>
            <Col pr10 onPress={() => gotoNewPost({repostDrawEvent: drawEvent})}>
              <Repeat {...actionIconDefaultProps} />
            </Col>
            <Col onPress={gotorepostDrawEventList}>
              <Span {...actionTextDefaultProps}>{drawEvent?.repost_count}</Span>
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
              <Span {...actionTextDefaultProps}>
                {drawEvent?.comments_count}
              </Span>
            </Col>
          </Row>
        </Col>
        <Col />
        <Col itemsCenter>
          <Row auto itemsCenter>
            <Col pr10 onPress={handlePressLike}>
              <Heart {...heartProps} />
            </Col>
            <Col onPress={gotoLikeList}>
              <Span {...actionTextDefaultProps}>{likesCount}</Span>
            </Col>
          </Row>
        </Col>
        <Col />
        <Col auto onPress={handlePressBookmark}>
          {<Bookmark {...bookmarkProps} />}
        </Col>
      </Row>
    </Div>
  );
}
