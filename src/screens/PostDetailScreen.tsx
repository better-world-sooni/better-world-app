import {useNavigation} from '@react-navigation/core';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {X} from 'react-native-feather';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {Img} from 'src/components/common/Img';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import APIS from 'src/modules/apis';
import {
  GO_COLOR,
  GRAY_COLOR,
  HAS_NOTCH,
  PLACE,
  REPORT,
  SUNGAN,
} from 'src/modules/constants';
import {IMAGES} from 'src/modules/images';
import {
  deletePromiseFn,
  getPromiseFn,
  postPromiseFn,
} from 'src/redux/asyncReducer';
import {RootState} from 'src/redux/rootReducer';
import {Input, KeyboardAvoidingView, NativeBaseProvider} from 'native-base';
import {Platform, RefreshControl, SafeAreaView, ScrollView} from 'react-native';
import {isOkay} from 'src/modules/utils';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import PostDetailHeader from 'src/components/PostDetailHeader';
import Comment from 'src/components/Comment';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {View} from 'src/modules/viewComponents';
import NestedComment from 'src/components/NestedComment';
import {Header} from 'src/components/Header';

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
    app: {
      session: {token, currentUser},
    },
  } = useSelector((root: RootState) => root, shallowEqual);
  const [text, setText] = useState('');
  const [textType, setTextType] = useState<any>(TextType.COMMENT);
  const currentPost = props.route.params.currentPost;
  const [liked, setLiked] = useState(currentPost.liked);
  const [likeCount, setLikeCount] = useState(currentPost.likeCount);
  const [comments, setComments] = useState([]);
  const [postLoading, setPostLoading] = useState(true);
  const [sendLoading, setSendLoading] = useState(false);
  const refreshComments = async () => {
    let res;
    if (currentPost.type === REPORT) {
      res = await getPromiseFn({
        url: APIS.post.report.comments(currentPost.postId).url,
        token,
      });
    } else if (currentPost.type === SUNGAN) {
      res = await getPromiseFn({
        url: APIS.post.sungan.comments(currentPost.postId).url,
        token,
      });
    } else if (currentPost.type === PLACE) {
      res = await getPromiseFn({
        url: APIS.post.place.comments(currentPost.postId).url,
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
          [idName]: currentPost.postId,
          content: text,
          userName: currentUser.username,
          userProfileImgUrl: currentUser.avatar,
        },
        token,
      });
    },
    [currentPost.postId, text],
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
      text: currentPost.text,
      likeCnt: likeCount,
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
        await replyOn(APIS.post.report.comment.reply.main().url, commentId);
      },
    },
    [SUNGAN]: {
      emoji: currentPost.emoji,
      text: currentPost.text,
      likeCnt: likeCount,
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
          APIS.post.sungan.comment.reply.main(commentId).url,
        );
      },
    },
    [PLACE]: {
      emoji: currentPost.emoji,
      text: currentPost.text,
      place: currentPost.place,
      likeCnt: likeCount,
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
        await replyOn(APIS.post.place.comment.reply.main().url, commentId);
      },
    },
  };

  const handleLike = useCallback(() => {
    if (liked) {
      ReactNativeHapticFeedback.trigger('impactLight', options);
      setLiked(false);
      currentPost.setLiked(false);
      setLikeCount(likeCount - 1);
      currentPost.setLikeCount(likeCount - 1);
      deletePromiseFn({
        url: post[currentPost.type].likeUrl(currentPost.postId),
        body: {},
        token: token,
      });
    } else {
      ReactNativeHapticFeedback.trigger('impactLight', options);
      setLiked(true);
      currentPost.setLiked(true);
      setLikeCount(likeCount + 1);
      currentPost.setLikeCount(likeCount + 1);
      postPromiseFn({
        url: post[currentPost.type].likeUrl(currentPost.postId),
        body: {},
        token: token,
      });
    }
  }, [token, liked, likeCount, currentPost.postId]);
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
  }, [text, textType, currentPost.postId]);
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
    [currentPost.postId],
  );

  if (postLoading) {
    return <PostPlaceholder />;
  }

  return (
    <NativeBaseProvider>
      <Div flex bg={'white'}>
        <Header bg={'white'} headerTitle={'게시물'} noButtons hasGoBack />
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
                didLike={liked}
                handleLike={handleLike}
              />
              <Div>
                {comments.map((comment, index) => {
                  return (
                    <Comment
                      postType={currentPost.type}
                      commentId={comment.id}
                      createdAt={comment.createdAt}
                      userName={comment.userInfo.userName}
                      content={comment.content}
                      userProfileImgUrl={comment.userInfo.userProfileImgUrl}
                      likeCnt={comment.likeCnt}
                      isLiked={comment.isLiked}
                      handleLikeOnComment={handleLikeOnComment}
                      handleReplyOnComment={handlePressReplyOnComment}
                      mine={comment.userInfo.userId === currentUser.id}
                      key={index}>
                      {comment.nestedComments.length > 0 &&
                        [...comment.nestedComments]
                          .reverse()
                          .map((nestedComment, index) => {
                            return (
                              <NestedComment
                                key={index}
                                userProfileImgUrl={
                                  nestedComment.userInfo?.userProfileImgUrl
                                }
                                userName={nestedComment.userInfo?.userName}
                                content={nestedComment.content}
                                createdAt={nestedComment.createdAt}
                              />
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
                      variant="unstyled"
                      textContentType={'none'}
                      numberOfLines={1}
                      returnKeyType={'send'}
                      onChangeText={setText}
                      value={text}
                      onSubmitEditing={handleSend}
                      // keyboardType="visible-password"
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
