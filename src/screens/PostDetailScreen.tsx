import {useNavigation} from '@react-navigation/core';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Heart, X} from 'react-native-feather';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {Img} from 'src/components/common/Img';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import TopHeader from 'src/components/TopHeader';
import APIS from 'src/modules/apis';
import {
  GO_COLOR,
  GRAY_COLOR,
  HAS_NOTCH,
  iconSettings,
  PLACE,
  REPORT,
  SUNGAN,
} from 'src/modules/constants';
import {IMAGES} from 'src/modules/images';
import {
  deletePromiseFn,
  getPromiseFn,
  postPromiseFn,
  useApiSelector,
  useReloadGET,
} from 'src/redux/asyncReducer';
import {RootState} from 'src/redux/rootReducer';
import {Input, KeyboardAvoidingView, NativeBaseProvider} from 'native-base';
import {Platform, RefreshControl, SafeAreaView, ScrollView} from 'react-native';
import {setMainPost} from 'src/redux/feedReducer';
import {isOkay, postKey} from 'src/modules/utils';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import PostDetailHeader from 'src/components/PostDetailHeader';
import Comment from 'src/components/Comment';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {View} from 'src/modules/viewComponents';

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};
enum TextType {
  COMMENT = 0,
}
const PostPlaceholder = () => {
  return (
    <Div bg={'white'} flex px20 py20>
      <Div h={HAS_NOTCH ? 44 : 20} bg={'rgba(255,255,255,.9)'} />
      <Div flex={1}>
        <SkeletonPlaceholder>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              paddingTop: 10,
              paddingBottom: 50,
            }}>
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 10,
                marginTop: 10,
                marginBottom: 10,
              }}
            />
            <View
              style={{
                width: 400,
                height: 20,
                borderRadius: 5,
                marginTop: 10,
                marginBottom: 10,
              }}
            />
            <View
              style={{
                width: 300,
                height: 20,
                borderRadius: 5,
                marginTop: 10,
                marginBottom: 10,
              }}
            />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 50,
                marginTop: 10,
                marginBottom: 10,
              }}
            />
            <View style={{marginLeft: 20}}>
              <View
                style={{
                  width: 120,
                  height: 11,
                  borderRadius: 4,
                  marginTop: 2,
                  marginBottom: 2,
                }}
              />
              <View
                style={{
                  width: 80,
                  height: 11,
                  borderRadius: 4,
                  marginTop: 2,
                  marginBottom: 2,
                }}
              />
            </View>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 50,
                marginTop: 10,
                marginBottom: 10,
              }}
            />
            <View style={{marginLeft: 20}}>
              <View
                style={{
                  width: 120,
                  height: 11,
                  borderRadius: 4,
                  marginTop: 2,
                  marginBottom: 2,
                }}
              />
              <View
                style={{
                  width: 80,
                  height: 11,
                  borderRadius: 4,
                  marginTop: 2,
                  marginBottom: 2,
                }}
              />
            </View>
          </View>
        </SkeletonPlaceholder>
      </Div>
    </Div>
  );
};
const PostDetailScreen = props => {
  const {
    feed: {mainPosts, myPosts},
    app: {
      session: {token, currentUser},
    },
  } = useSelector((root: RootState) => root, shallowEqual);
  const [text, setText] = useState('');
  const [textType, setTextType] = useState<any>(TextType.COMMENT);
  const [comments, setComments] = useState([]);
  const currentPostId = props.route.params.currentPostId;
  const currentPost = mainPosts[currentPostId] || myPosts[currentPostId];
  const innerPost = currentPost.post;
  const dispatch = useDispatch();
  const [postLoading, setPostLoading] = useState(true);
  const [sendLoading, setSendLoading] = useState(false);

  const refreshComments = async () => {
    let res;
    if (currentPost.type === REPORT) {
      res = await getPromiseFn({
        url: APIS.post.report.comments(currentPost.post.id).url,
        token,
      });
    } else if (currentPost.type === SUNGAN) {
      res = await getPromiseFn({
        url: APIS.post.sungan.comments(currentPost.post.id).url,
        token,
      });
    } else if (currentPost.type === PLACE) {
      res = await getPromiseFn({
        url: APIS.post.place.comments(currentPost.post.id).url,
        token,
      });
    }
    if (isOkay(res)) {
      setComments(res.data.data);
    }
  };
  const pullToRefresh = async () => {
    setPostLoading(true);
    refreshComments();
    setPostLoading(false);
  };

  useEffect(() => {
    refreshComments();
    setPostLoading(false);
  }, []);

  const commentOn = useCallback(
    async (url, idName) => {
      await postPromiseFn({
        url,
        body: {
          [idName]: currentPost.post.id,
          content: text,
          userName: currentUser.username,
          userProfileImgUrl: currentUser.avatar,
        },
        token,
      });
    },
    [currentPostId, text],
  );
  const likeOn = useCallback(
    async (api, commentId) => {
      ReactNativeHapticFeedback.trigger('impactLight', options);
      await postPromiseFn({
        url: api(commentId).url,
        body: {},
        token,
      });
    },
    [token],
  );
  const unlikeOn = useCallback(
    async (api, commentId) => {
      ReactNativeHapticFeedback.trigger('impactLight', options);
      await deletePromiseFn({
        url: api(commentId).url,
        body: {},
        token,
      });
    },
    [token],
  );
  const likeOnSunganComment = useCallback(
    async (api, commentId) => {
      ReactNativeHapticFeedback.trigger('impactLight', options);
      await postPromiseFn({
        url: api().url,
        body: {
          commentId,
        },
        token,
      });
      refreshComments();
    },
    [token],
  );
  const replyOnSunganComment = useCallback(
    async url => {
      await postPromiseFn({
        url: url,
        body: {
          content: text,
          userName: currentUser.username,
          userProfileImgUrl: currentUser.avatar,
        },
        token,
      });
      refreshComments();
    },
    [token, text, currentUser],
  );
  const replyOn = useCallback(
    async (url, commentId) => {
      await postPromiseFn({
        url: url,
        body: {
          commentId: commentId,
          content: text,
          userName: currentUser.username,
          userProfileImgUrl: currentUser.avatar,
        },
        token,
      });
      refreshComments();
    },
    [token, text, currentUser],
  );
  const handlePressReplyOnComment = useCallback(comment => {
    setTextType(comment);
  }, []);
  const post = {
    [REPORT]: {
      emoji: '🚨',
      text: currentPost.post.text,
      likeCnt: currentPost.post.likeCnt,
      likeUrl: id => {
        return APIS.post.report.like(id).url;
      },
      postComment: async () => {
        await commentOn(APIS.post.report.comment.main().url, 'reportId');
      },
      likeOnComment: async commentId => {
        await likeOn(APIS.post.report.comment.like, commentId);
      },
      unlikeOnComment: async commentId => {
        await unlikeOn(APIS.post.report.comment.like, commentId);
      },
      replyOnComment: async commentId => {
        await replyOn(APIS.post.report.comment.reply().url, commentId);
      },
    },
    [SUNGAN]: {
      emoji: currentPost.post.emoji,
      text: currentPost.post.text,
      likeCnt: currentPost.post.likeCnt,
      likeUrl: id => {
        return APIS.post.sungan.like(id).url;
      },
      postComment: async () => {
        await commentOn(APIS.post.sungan.comment.main().url, 'sunganId');
      },
      likeOnComment: async commentId => {
        await likeOnSunganComment(APIS.post.sungan.comment.like, commentId);
      },
      unlikeOnComment: async commentId => {
        await unlikeOn(APIS.post.sungan.comment.unlike, commentId);
      },
      replyOnComment: async commentId => {
        await replyOnSunganComment(
          APIS.post.sungan.comment.reply(commentId).url,
        );
      },
    },
    [PLACE]: {
      emoji: currentPost.post.emoji,
      text: currentPost.post.text,
      place: currentPost.post.place,
      likeCnt: currentPost.post.likeCnt,
      likeUrl: id => {
        return APIS.post.place.like(id).url;
      },
      postComment: async () => {
        await commentOn(APIS.post.place.comment.main().url, 'hotplaceId');
      },
      likeOnComment: async commentId => {
        await likeOn(APIS.post.place.comment.like, commentId);
      },
      unlikeOnComment: async commentId => {
        await unlikeOn(APIS.post.place.comment.like, commentId);
      },
      replyOnComment: async commentId => {
        await replyOn(APIS.post.place.comment.reply().url, commentId);
      },
    },
  };

  const handleLike = useCallback(() => {
    if (currentPost.didLike) {
      const {
        didLike,
        post: {likeCnt, ...otherProps},
        ...other
      } = currentPost;
      ReactNativeHapticFeedback.trigger('impactLight', options);
      dispatch(
        setMainPost({
          didLike: false,
          post: {likeCnt: likeCnt - 1, ...otherProps},
          ...other,
        }),
      );
      deletePromiseFn({
        url: post[currentPost.type].likeUrl(innerPost.id),
        body: {},
        token: token,
      });
    } else {
      const {
        didLike,
        post: {likeCnt, ...otherProps},
        ...other
      } = currentPost;
      ReactNativeHapticFeedback.trigger('impactLight', options);
      dispatch(
        setMainPost({
          didLike: true,
          post: {likeCnt: likeCnt + 1, ...otherProps},
          ...other,
        }),
      );
      postPromiseFn({
        url: post[currentPost.type].likeUrl(innerPost.id),
        body: {},
        token: token,
      });
    }
  }, [token, currentPost.didLike, currentPost.post.likeCnt, currentPostId]);
  const handleSend = useCallback(async () => {
    if (!sendLoading) {
      ReactNativeHapticFeedback.trigger('impactMedium', options);
      setSendLoading(true);
      if (text.length > 0) {
        if (textType === TextType.COMMENT) {
          await post[currentPost.type].postComment();
          setText('');
        } else {
          await post[currentPost.type].replyOnComment(textType.id);
          setText('');
        }
        refreshComments();
      }
      setSendLoading(false);
    }
  }, [text, textType, currentPostId]);
  const handleLikeOnComment = useCallback(
    async (commentId, prevLiked) => {
      ReactNativeHapticFeedback.trigger('impactLight', options);
      if (prevLiked) {
        await post[currentPost.type].unlikeOnComment(commentId);
      } else {
        await post[currentPost.type].likeOnComment(commentId);
      }
      refreshComments();
    },
    [currentPostId],
  );

  if (postLoading) {
    return <PostPlaceholder />;
  }

  return (
    <NativeBaseProvider>
      <Div flex bg={'white'}>
        <TopHeader
          route={useNavigation}
          title={'게시물'}
          headerColor={'white'}
        />
        <KeyboardAvoidingView
          style={{flex: 1, display: 'flex'}}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Div flex={1}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={postLoading}
                  onRefresh={pullToRefresh}
                />
              }>
              <PostDetailHeader
                emoji={post[currentPost.type].emoji}
                place={post[currentPost.type].place}
                text={post[currentPost.type].text}
                likeCnt={post[currentPost.type].likeCnt}
                didLike={currentPost.didLike}
                handleLike={handleLike}
              />
              <Div>
                {comments.map((comment, index) => {
                  return (
                    <Comment
                      commentId={comment.id}
                      userName={comment.userInfo.userName}
                      content={comment.content}
                      userProfileImgUrl={comment.userInfo.userProfileImgUrl}
                      likeCnt={comment.likeCnt}
                      isLiked={comment.isLiked}
                      handleLikeOnComment={handleLikeOnComment}
                      handleReplyOnComment={handlePressReplyOnComment}
                      key={index}>
                      {comment.nestedComments.length > 0 &&
                        [...comment.nestedComments]
                          .reverse()
                          .map((nestedComment, index) => {
                            return (
                              <Row
                                itemsCenter
                                justifyCenter
                                flex
                                ml30
                                pt10
                                key={index}
                                pl10>
                                <Col
                                  auto
                                  itemsCenter
                                  justifyCenter
                                  rounded20
                                  overflowHidden>
                                  <Img
                                    source={
                                      IMAGES.characters[
                                        nestedComment.userInfo.userProfileImgUrl
                                      ] || IMAGES.imageProfileNull
                                    }
                                    w20
                                    h20></Img>
                                </Col>
                                <Col>
                                  <Row mb5 pl10>
                                    <Col mr10 justifyCenter>
                                      <Row>
                                        <Span medium color={'black'}>
                                          {nestedComment.userInfo.userName}
                                        </Span>
                                        <Span ml5>{nestedComment.content}</Span>
                                      </Row>
                                    </Col>
                                  </Row>
                                  <Row pl10>
                                    {nestedComment.likeCnt &&
                                      nestedComment.likeCnt > 0 && (
                                        <Col mr10 auto>
                                          <Span
                                            color={
                                              GRAY_COLOR
                                            }>{`좋아요 ${nestedComment.likeCnt}개`}</Span>
                                        </Col>
                                      )}
                                    <Col
                                      auto
                                      onPress={() =>
                                        handlePressReplyOnComment(
                                          nestedComment.id,
                                        )
                                      }>
                                      <Span color={GRAY_COLOR}>답글 달기</Span>
                                    </Col>
                                    <Col></Col>
                                  </Row>
                                </Col>
                                {/* <Col
                                  auto
                                  itemsCenter
                                  justifyCenter
                                  onPress={() =>
                                    handleLikeOnComment(
                                      nestedComment.id,
                                      nestedComment.didLike,
                                    )
                                  }>
                                  <Heart
                                    fill={
                                      nestedComment.isLiked ? 'red' : 'white'
                                    }
                                    color={'black'}
                                    height={14}></Heart>
                                </Col> */}
                              </Row>
                            );
                          })}
                    </Comment>
                  );
                })}
              </Div>
              <AllCommentsRead />
            </ScrollView>
            <SafeAreaView>
              <Div borderTopColor={GRAY_COLOR} borderTopWidth={0.3}>
                {textType !== TextType.COMMENT && (
                  <Row px20 py10 bg={GRAY_COLOR}>
                    <Col mr10>
                      <Span>{`${textType.userName}에게 댓글 다는중`}</Span>
                    </Col>
                    <Col auto onPress={() => setTextType(TextType.COMMENT)}>
                      <X height={15} width={15} color={'black'}></X>
                    </Col>
                  </Row>
                )}
                <Row itemsCenter px20 py10>
                  <Col auto itemsCenter justifyCenter rounded20 overflowHidden>
                    <Img
                      source={
                        IMAGES.characters[currentUser.avatar] ||
                        IMAGES.imageProfileNull
                      }
                      w30
                      h30></Img>
                  </Col>
                  <Col
                    ml10
                    justifyCenter
                    borderColor={GRAY_COLOR}
                    borderWidth={0.3}
                    rounded5>
                    <Input
                      w={'100%'}
                      fontSize={13}
                      value={text}
                      variant="unstyled"
                      textContentType={'none'}
                      numberOfLines={1}
                      returnKeyType={'send'}
                      onChangeText={setText}
                      onSubmitEditing={handleSend}
                      InputRightElement={
                        <Span color={GO_COLOR} px15 onPress={handleSend}>
                          {sendLoading ? '게시중..' : '게시'}
                        </Span>
                      }
                      placeholder={'댓글 달기'}></Input>
                  </Col>
                </Row>
              </Div>
            </SafeAreaView>
          </Div>
        </KeyboardAvoidingView>
      </Div>
    </NativeBaseProvider>
  );
};

const AllCommentsRead = () => {
  return (
    <Row py10>
      <Col></Col>
      <Col auto>
        <Span color={GRAY_COLOR}>댓글을 모두 확인했습니다.</Span>
      </Col>
      <Col></Col>
    </Row>
  );
};

export default PostDetailScreen;
