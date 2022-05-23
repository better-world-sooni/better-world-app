import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Platform, RefreshControl} from 'react-native';
import {
  ChevronLeft,
  Coffee,
  Heart,
  MessageCircle,
  MoreHorizontal,
  ThumbsDown,
  ThumbsUp,
} from 'react-native-feather';
import {State, TapGestureHandler} from 'react-native-gesture-handler';
import Colors from 'src/constants/Colors';
import {
  useGotoLikeList,
  useGotoNftCollectionProfile,
  useGotoNftProfile,
  useGotoPost,
  useGotoReport,
  useGotoVoteList,
} from 'src/hooks/useGoto';
import useLike from 'src/hooks/useLike';
import apis from 'src/modules/apis';
import {
  getNftName,
  getNftProfileImage,
  useIsAdmin,
  useIsCurrentNft,
} from 'src/modules/nftUtils';
import {createdAtText} from 'src/modules/timeUtils';
import {ScrollView} from 'src/modules/viewComponents';
import {Col} from './Col';
import Comment from './Comment';
import DefaultMarkdown from './DefaultMarkdown';
import {Div} from './Div';
import ImageSlideShow from './ImageSlideShow';
import {Img} from './Img';
import NewComment, {ReplyToType} from './NewComment';
import {Row} from './Row';
import {Span} from './Span';
import TruncatedMarkdown from './TruncatedMarkdown';
import {MenuView} from '@react-native-menu/menu';
import {
  deletePromiseFn,
  useDeletePromiseFnWithToken,
} from 'src/redux/asyncReducer';
import {ReportTypes} from 'src/screens/ReportScreen';
import useVote, {VoteCategory} from 'src/hooks/useVote';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';
import {LikeListType} from 'src/screens/LikeListScreen';
import {HAS_NOTCH} from 'src/modules/constants';
import {DEVICE_WIDTH} from 'src/modules/styles';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {BlurView} from '@react-native-community/blur';
import useScrollToEndRef from 'src/hooks/useScrollToEndRef';

enum PostEventTypes {
  Delete = 'DELETE',
  Report = 'REPORT',
}

export default function Post({
  post,
  full = false,
  refreshing = false,
  autoFocus = false,
  onRefresh = null,
}) {
  const scrollToEndRef = useScrollToEndRef();
  const {goBack} = useNavigation();
  const [deleted, setDeleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [liked, likesCount, handlePressLike] = useLike(
    post.is_liked,
    post.likes_count,
    apis.like.post(post.id).url,
  );
  const [cachedComments, setCachedComments] = useState(post.comments || []);
  useEffect(() => {
    setCachedComments(post.comments || []);
  }, [post.comments?.length]);
  const {
    forVotesCount,
    againstVotesCount,
    abstainVotesCount,
    hasVotedFor,
    hasVotedAgainst,
    hasVotedAbstain,
    handlePressVoteAbstain,
    handlePressVoteFor,
    handlePressVoteAgainst,
  } = useVote({
    initialVote: post.vote_category,
    initialAbstainVotesCount: post.abstain_votes_count,
    initialForVotesCount: post.for_votes_count,
    initialAgainstVotesCount: post.against_votes_count,
    postId: post.id,
  });
  const isCurrentNft = useIsCurrentNft(post.nft);
  const isAdmin = !post.nft.token_id && useIsAdmin(post.nft);
  const deletePromiseFnWithToken = useDeletePromiseFnWithToken();
  const {currentNft} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const menuOptions =
    isCurrentNft || isAdmin
      ? [
          {
            id: 'REPORT',
            title: 'Report Post',
            titleColor: '#46F289',
            subtitle: 'Share action on SNS',
            image: Platform.select({
              ios: 'flag',
              android: 'stat_sys_warning',
            }),
          },
          {
            id: PostEventTypes.Delete,
            title: 'Delete Post',
            image: Platform.select({
              ios: 'trash',
              android: 'ic_menu_delete',
            }),
          },
        ]
      : [
          {
            id: PostEventTypes.Report,
            title: 'Report Post',
            titleColor: '#46F289',
            subtitle: 'Share action on SNS',
            image: Platform.select({
              ios: 'flag',
              android: 'stat_sys_warning',
            }),
          },
        ];

  const actionIconDefaultProps = {
    width: 18,
    height: 18,
    color: Colors.gray[700],
    strokeWidth: 1.7,
  };
  const heartProps = liked
    ? {
        fill: Colors.danger.DEFAULT,
        width: 18,
        height: 18,
        color: Colors.danger.DEFAULT,
        strokeWidth: 1.7,
      }
    : actionIconDefaultProps;

  const forVoteProps = hasVotedFor
    ? {
        fill: Colors.primary.DEFAULT,
        width: 18,
        height: 18,
        color: Colors.primary.DEFAULT,
        strokeWidth: 1.7,
      }
    : actionIconDefaultProps;
  const abstainVoteProps = hasVotedAbstain
    ? {
        fill: Colors.primary.DEFAULT,
        width: 18,
        height: 18,
        color: Colors.primary.DEFAULT,
        strokeWidth: 1.7,
      }
    : actionIconDefaultProps;
  const againstVoteProps = hasVotedAgainst
    ? {
        fill: Colors.danger.DEFAULT,
        width: 18,
        height: 18,
        color: Colors.danger.DEFAULT,
        strokeWidth: 1.7,
      }
    : actionIconDefaultProps;
  const goToPost = useGotoPost({postId: post.id});
  const gotoNftProfile = useGotoNftProfile({
    contractAddress: post.nft.contract_address,
    tokenId: post.nft.token_id,
  });
  const gotoNftCollectionProfile = useGotoNftCollectionProfile({
    contractAddress: post.nft.contract_address,
  });
  const goToProfile = useCallback(() => {
    if (post.nft.token_id) {
      gotoNftProfile();
    } else {
      gotoNftCollectionProfile();
    }
  }, []);
  const defaultReplyTo = {
    object: post,
    type: ReplyToType.Post,
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
  const scrollviewProps = full
    ? {
        scrollEnabled: true,
        ref: scrollToEndRef,
      }
    : {};
  const deletePost = async () => {
    setLoading(true);
    const {data} = await deletePromiseFnWithToken({
      url: apis.post.postId._(post.id).url,
    });
    setLoading(false);
    if (data.success) {
      setDeleted(true);
    }
  };
  const gotoReport = useGotoReport({
    id: post.id,
    reportType: ReportTypes.Post,
  });
  const handlePressMenu = ({nativeEvent: {event}}) => {
    if (event == PostEventTypes.Delete) deletePost();
    if (event == PostEventTypes.Report) gotoReport();
  };

  const gotoLikeList = useGotoLikeList({
    likableId: post.id,
    likableType: LikeListType.Post,
  });

  const gotoVoteList = useGotoVoteList({
    postId: post.id,
  });
  const translationY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => {
    translationY.value = event.contentOffset.y * 20;
  });
  const headerHeight = HAS_NOTCH ? 94 : 70;
  const headerStyles = useAnimatedStyle(() => {
    return {
      width: DEVICE_WIDTH,
      height: headerHeight,
      opacity: Math.min(translationY.value / 100, 1),
    };
  });

  const itemWidth = DEVICE_WIDTH - 30 - 50;

  if (deleted) return null;

  return (
    <>
      {full && (
        <Div h={headerHeight} zIndex={100} absolute top0>
          <Animated.View style={headerStyles}>
            <BlurView
              blurType="xlight"
              blurAmount={30}
              blurRadius={20}
              style={{
                width: DEVICE_WIDTH,
                height: '100%',
                position: 'absolute',
              }}
              reducedTransparencyFallbackColor="white"></BlurView>
          </Animated.View>
          <Div zIndex={100} absolute w={DEVICE_WIDTH} top={HAS_NOTCH ? 49 : 25}>
            <Row itemsCenter py5 h40 px8>
              <Col itemsStart>
                <Div auto rounded100 onPress={goBack}>
                  <ChevronLeft
                    width={30}
                    height={30}
                    color="black"
                    strokeWidth={2}
                  />
                </Div>
              </Col>
              <Col auto onPress={goBack}>
                <Span bold fontSize={19}>
                  게시물
                </Span>
              </Col>
              <Col itemsEnd></Col>
            </Row>
          </Div>
        </Div>
      )}
      <Div
        py5
        borderBottom={full ? 0 : 0.5}
        borderGray200
        bgWhite
        {...(full && {flex: 1})}>
        <Animated.ScrollView
          {...scrollviewProps}
          onScroll={scrollHandler}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {full && <Div h={headerHeight}></Div>}
          <Row px15 pt5>
            <Col auto mr10>
              <Div onPress={goToProfile}>
                <Img
                  w47
                  h47
                  rounded100
                  uri={getNftProfileImage(post.nft, 100, 100)}
                />
              </Div>
            </Col>
            <Col>
              <Row>
                <Col auto>
                  <Span>
                    <Span fontSize={15} bold onPress={goToProfile}>
                      {getNftName(post.nft)}{' '}
                    </Span>{' '}
                    {post.nft.token_id &&
                      post.nft.nft_metadatum.name != getNftName(post.nft) && (
                        <Span fontSize={12} gray700 onPress={goToProfile}>
                          {post.nft.nft_metadatum.name}
                          {' · '}
                        </Span>
                      )}
                    <Span fontSize={12} gray700>
                      {createdAtText(post.updated_at)}
                    </Span>
                  </Span>
                </Col>
                <Col />
                <Col auto>
                  <MenuView
                    onPressAction={handlePressMenu}
                    actions={menuOptions}>
                    {loading ? (
                      <ActivityIndicator />
                    ) : (
                      <MoreHorizontal
                        color={Colors.gray[400]}
                        width={20}
                        height={20}
                      />
                    )}
                  </MenuView>
                </Col>
              </Row>
              <Row>
                {post.content ? (
                  <Div>
                    {full ? (
                      <DefaultMarkdown
                        children={post.content}></DefaultMarkdown>
                    ) : (
                      <TruncatedMarkdown
                        text={post.content}
                        maxLength={500}
                        onPressTruncated={goToPost}
                      />
                    )}
                  </Div>
                ) : null}
              </Row>
              {post.type == 'Proposal' &&
                post.nft.contract_address == currentNft.contract_address && (
                  <Row>
                    <Col auto mr12 gray800>
                      <Span
                        fontSize={14}
                        style={{fontWeight: '600'}}
                        onPress={() => gotoVoteList(VoteCategory.Against)}>
                        반대 <Span realBlack>{againstVotesCount}</Span>표 (
                        {(againstVotesCount + forVotesCount > 0
                          ? againstVotesCount /
                            (againstVotesCount + forVotesCount)
                          : 0) * 100}
                        %)
                      </Span>
                    </Col>
                    <Col auto mr12 gray800>
                      <Span
                        fontSize={14}
                        style={{fontWeight: '600'}}
                        onPress={() => gotoVoteList(VoteCategory.For)}>
                        찬성 <Span realBlack>{forVotesCount}</Span>표 (
                        {(againstVotesCount + forVotesCount > 0
                          ? forVotesCount / (againstVotesCount + forVotesCount)
                          : 0) * 100}
                        %)
                      </Span>
                    </Col>
                    <Col />
                  </Row>
                )}
              {post.image_uris.length > 0 ? (
                <Div mt5>
                  <ImageSlideShow
                    imageUris={post.image_uris}
                    sliderHeight={
                      post.image_width && post.image_height
                        ? (post.image_height / post.image_width) * itemWidth
                        : itemWidth
                    }
                    sliderWidth={itemWidth}
                  />
                </Div>
              ) : null}
              <Row itemsCenter mb8 mt8 mb10={full}>
                {!post.type ? (
                  <>
                    {
                      <Col auto mr12>
                        <Span
                          fontSize={12}
                          style={{fontWeight: '600'}}
                          onPress={gotoLikeList}>
                          좋아요 <Span realBlack>{likesCount}</Span>개
                        </Span>
                      </Col>
                    }
                    <Col />
                    {!full && (
                      <Col auto mr16 onPress={handlePressLike}>
                        {<Heart {...heartProps}></Heart>}
                      </Col>
                    )}
                  </>
                ) : (
                  <>
                    <Col />
                    {!full && (
                      <>
                        <Col auto mr16 onPress={handlePressVoteAgainst}>
                          {<ThumbsDown {...againstVoteProps}></ThumbsDown>}
                        </Col>
                        <Col auto mr16 onPress={handlePressVoteFor}>
                          {<ThumbsUp {...forVoteProps}></ThumbsUp>}
                        </Col>
                      </>
                    )}
                  </>
                )}
                {!full && (
                  <Col auto onPress={!full && (() => goToPost(true))}>
                    <MessageCircle {...actionIconDefaultProps} />
                  </Col>
                )}
              </Row>
            </Col>
          </Row>
          {full ? (
            <Div borderTop={0.5} borderGray200 pt5>
              {cachedComments.map(comment => {
                return (
                  <Comment
                    key={comment.id}
                    comment={comment}
                    onPressReplyTo={handlePressReplyTo}></Comment>
                );
              })}
            </Div>
          ) : (
            cachedComments.length > 0 && (
              <Div onPress={goToPost}>
                <Comment
                  hot
                  key={cachedComments[0].id}
                  comment={cachedComments[0]}
                  onPressReplyTo={handlePressReplyTo}></Comment>
              </Div>
            )
          )}
          {full && <Div h100></Div>}
        </Animated.ScrollView>
        {full && (
          <NewComment
            autoFocus={autoFocus}
            replyToObject={replyTo.object}
            replyToType={replyTo.type}
            onSuccess={handleNewCommentSuccess}
            onPressExitReplyToComment={resetReplyTo}
          />
        )}
      </Div>
    </>
  );
}