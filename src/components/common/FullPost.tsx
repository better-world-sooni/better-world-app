import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, Platform, RefreshControl} from 'react-native';
import {
  ChevronLeft,
  Heart,
  MoreHorizontal,
  Repeat,
  ThumbsDown,
  ThumbsUp,
} from 'react-native-feather';
import Colors from 'src/constants/Colors';
import {
  useGotoForumFeed,
  useGotoLikeList,
  useGotoNewPost,
  useGotoNftCollectionProfile,
  useGotoNftProfile,
  useGotoPost,
  useGotoReport,
  useGotoRepostList,
  useGotoVoteList,
} from 'src/hooks/useGoto';
import useLike from 'src/hooks/useLike';
import apis from 'src/modules/apis';
import {
  getNftName,
  getNftProfileImage,
  useIsAdmin,
  useIsCurrentCollection,
  useIsCurrentNft,
} from 'src/modules/nftUtils';
import {createdAtText} from 'src/modules/timeUtils';
import {Col} from './Col';
import Comment from './Comment';
import {Div} from './Div';
import ImageSlideShow from './ImageSlideShow';
import {Img} from './Img';
import NewComment, {ReplyToType} from './NewComment';
import {Row} from './Row';
import {Span} from './Span';
import {MenuView} from '@react-native-menu/menu';
import {useDeletePromiseFnWithToken} from 'src/redux/asyncReducer';
import {ReportTypes} from 'src/screens/ReportScreen';
import useVote, {VoteCategory} from 'src/hooks/useVote';
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
import {PostOwnerType} from 'src/screens/NewPostScreen';
import TruncatedText from './TruncatedText';
import RepostedPost from './RepostedPost';
import CollectionEvent from './CollectionEvent';
import {getAdjustedHeightFromDimensions} from 'src/modules/imageUtils';

enum PostEventTypes {
  Delete = 'DELETE',
  Report = 'REPORT',
}

export default function FullPost({post, autoFocus = false}) {
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
  const isCurrentCollection = useIsCurrentCollection(post.nft);
  const isAdmin = !post.nft.token_id && useIsAdmin(post.nft);
  const deletePromiseFnWithToken = useDeletePromiseFnWithToken();
  const menuOptions =
    isCurrentNft || isAdmin
      ? [
          {
            id: 'REPORT',
            title: '게시물 신고',
            titleColor: '#46F289',
            subtitle: 'Share action on SNS',
            image: Platform.select({
              ios: 'flag',
              android: 'stat_sys_warning',
            }),
          },
          {
            id: PostEventTypes.Delete,
            title: '게시물 삭제',
            image: Platform.select({
              ios: 'trash',
              android: 'ic_menu_delete',
            }),
          },
        ]
      : [
          {
            id: PostEventTypes.Report,
            title: '게시물 신고',
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
  const gotoPost = useGotoPost({postId: post.id});

  const gotoNftProfile = useGotoNftProfile({
    nft: post.nft,
  });
  const gotoNftCollectionProfile = useGotoNftCollectionProfile({
    nftCollection: post.nft,
  });
  const goToProfile = () => {
    if (post.nft.token_id) {
      gotoNftProfile();
    } else {
      gotoNftCollectionProfile();
    }
  };
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

  const gotoNewPost = useGotoNewPost({
    postOwnerType: PostOwnerType.Nft,
  });

  const gotoForumFeed = useGotoForumFeed({
    postId: post.id,
  });

  const gotoRepostList = useGotoRepostList({
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

      <Div py5 borderGray200 bgWhite flex={1}>
        <Animated.ScrollView ref={scrollToEndRef} onScroll={scrollHandler}>
          <Div h={headerHeight}></Div>
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
                    <Span>{post.content}</Span>
                  </Div>
                ) : null}
              </Row>
              {post.image_uris.length > 0 ? (
                <Div mt5>
                  <ImageSlideShow
                    imageUris={post.image_uris}
                    sliderHeight={
                      post.image_width && post.image_height
                        ? getAdjustedHeightFromDimensions({
                            width: post.image_width,
                            height: post.image_height,
                            frameWidth: itemWidth,
                          })
                        : itemWidth * 0.7
                    }
                    sliderWidth={itemWidth}
                  />
                </Div>
              ) : null}
              {post.reposted_post && (
                <RepostedPost repostedPost={post.reposted_post} enablePress />
              )}
              {post.collection_event && (
                <Div mt5>
                  <CollectionEvent
                    collectionEvent={post.collection_event}
                    reposted
                    itemWidth={itemWidth}
                  />
                </Div>
              )}
              <Row itemsCenter mb8 mt8 mb10>
                {!post.type ? (
                  <>
                    {likesCount > 0 && (
                      <Col auto mr12>
                        <Span
                          fontSize={12}
                          style={{fontWeight: '600'}}
                          onPress={gotoLikeList}>
                          좋아요 <Span realBlack>{likesCount}</Span>개
                        </Span>
                      </Col>
                    )}
                    {post.repost_count > 0 && (
                      <Col auto mr12>
                        <Span
                          fontSize={12}
                          style={{fontWeight: '600'}}
                          onPress={gotoRepostList}>
                          리포스트 <Span realBlack>{post.repost_count}</Span>번
                        </Span>
                      </Col>
                    )}
                    <Col />
                    <Col auto mr16 onPress={handlePressLike}>
                      {<Heart {...heartProps}></Heart>}
                    </Col>
                  </>
                ) : post.type == 'Proposal' ? (
                  <>
                    <Col auto mr12 gray800>
                      <Span
                        fontSize={12}
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
                        fontSize={12}
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
                    {isCurrentCollection && (
                      <>
                        <Col auto mr16 onPress={handlePressVoteAgainst}>
                          {<ThumbsDown {...againstVoteProps}></ThumbsDown>}
                        </Col>
                        <Col auto onPress={handlePressVoteFor}>
                          {<ThumbsUp {...forVoteProps}></ThumbsUp>}
                        </Col>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <Col auto mr12>
                      <Span
                        fontSize={12}
                        style={{fontWeight: '600'}}
                        onPress={() =>
                          gotoForumFeed(`${getNftName(post.nft)} 포럼`)
                        }>
                        제안 <Span realBlack>{post.repost_count}</Span>개
                      </Span>
                    </Col>
                    <Col />
                  </>
                )}
                {post.type == 'Forum'
                  ? isCurrentCollection && (
                      <Col auto onPress={() => gotoNewPost(post)}>
                        <Span info bold fontSize={12}>
                          제안하기
                        </Span>
                      </Col>
                    )
                  : !post.type && (
                      <Col auto onPress={() => gotoNewPost(post)}>
                        <Repeat {...actionIconDefaultProps} />
                      </Col>
                    )}
              </Row>
            </Col>
          </Row>
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
          <Div h100></Div>
        </Animated.ScrollView>
        {post.type !== 'Forum' && (
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
