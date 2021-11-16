import {useNavigation} from '@react-navigation/core';
import React, {useEffect, useState} from 'react';
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
  iconSettings,
  PLACE,
  REPORT,
  SUNGAN,
} from 'src/modules/constants';
import {IMAGES} from 'src/modules/images';
import {
  deletePromiseFn,
  postPromiseFn,
  useApiSelector,
  useReloadGET,
} from 'src/redux/asyncReducer';
import {RootState} from 'src/redux/rootReducer';
import {Input, KeyboardAvoidingView, NativeBaseProvider} from 'native-base';
import {Platform, RefreshControl, SafeAreaView, ScrollView} from 'react-native';
import {setMainPost} from 'src/redux/feedReducer';
import {isOkay} from 'src/modules/utils';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

enum TextType {
  COMMENT = 0,
}
const PostDetailScreen = () => {
  const {
    feed: {currentPostId, mainPosts, myPosts},
    app: {
      session: {token, currentUser},
    },
  } = useSelector((root: RootState) => root, shallowEqual);
  const currentPost = mainPosts[currentPostId] || myPosts[currentPostId];
  const innerPost = currentPost.post;

  const {data: reportComments, isLoading: reportCommentsLoading} =
    useApiSelector(APIS.post.report.comments);

  const {data: sunganComments, isLoading: sunganCommentsLoading} =
    useApiSelector(APIS.post.sungan.comments);

  const {data: placeComments, isLoading: placeCommentsLoading} = useApiSelector(
    APIS.post.place.comments,
  );

  const apiGET = useReloadGET();
  const dispatch = useDispatch();

  const [text, setText] = useState('');
  const [textType, setTextType] = useState<any>(TextType.COMMENT);

  const pullToRefresh = () => {
    if (currentPost.type === REPORT) {
      apiGET(APIS.post.report.comments(currentPost.post.id));
    } else if (currentPost.type === SUNGAN) {
      apiGET(APIS.post.sungan.comments(currentPost.post.id));
    } else if (currentPost.type === PLACE) {
      apiGET(APIS.post.place.comments(currentPost.post.id));
    }
  };
  const commentOn = async (url, idName) => {
    return await postPromiseFn({
      url,
      body: {
        [idName]: currentPost.post.id,
        content: text,
        userName: currentUser.username,
        userProfileImgUrl: currentUser.avatar,
      },
      token,
    });
  };
  const likeOn = async (api, commentId) => {
    ReactNativeHapticFeedback.trigger('impactLight', options);
    return await postPromiseFn({
      url: api(commentId).url,
      body: {},
      token,
    });
  };
  const unlikeOn = async (api, commentId) => {
    ReactNativeHapticFeedback.trigger('impactLight', options);
    return await deletePromiseFn({
      url: api(commentId).url,
      body: {},
      token,
    });
  };
  const likeOnSunganComment = async (api, commentId) => {
    ReactNativeHapticFeedback.trigger('impactLight', options);
    return await postPromiseFn({
      url: api().url,
      body: {
        commentId,
      },
      token,
    });
  };
  const replyOn = async (url, commentId) => {
    return await postPromiseFn({
      url: url,
      body: {
        commentId: commentId,
        content: text,
        userName: currentUser.username,
      },
      token,
    });
  };
  const post = {
    [REPORT]: {
      comments: reportComments?.data,
      emoji: '🚨',
      text: currentPost.post.text,
      likeCnt: currentPost.post.likeCnt,
      isLoading: reportCommentsLoading,
      likeUrl: id => {
        return APIS.post.report.like(id).url;
      },
      postComment: async () => {
        return await commentOn(APIS.post.report.comment.main().url, 'reportId');
      },
      likeOnComment: async commentId => {
        return await likeOn(APIS.post.report.comment.like, commentId);
      },
      unlikeOnComment: async commentId => {
        return await unlikeOn(APIS.post.report.comment.like, commentId);
      },
      replyOnComment: async commentId => {
        return await replyOn(APIS.post.report.comment.reply().url, commentId);
      },
    },
    [SUNGAN]: {
      comments: sunganComments?.data,
      emoji: currentPost.post.emoji,
      text: currentPost.post.text,
      likeCnt: currentPost.post.likeCnt,
      isLoading: sunganCommentsLoading,
      likeUrl: id => {
        return APIS.post.sungan.like(id).url;
      },
      postComment: async () => {
        return await commentOn(APIS.post.sungan.comment.main().url, 'sunganId');
      },
      likeOnComment: async commentId => {
        return likeOnSunganComment(APIS.post.sungan.comment.like, commentId);
      },
      unlikeOnComment: async commentId => {
        return await unlikeOn(APIS.post.sungan.comment.unlike, commentId);
      },
      replyOnComment: async commentId => {
        return await replyOn(APIS.post.sungan.comment.reply().url, commentId);
      },
    },
    [PLACE]: {
      comments: placeComments?.data,
      emoji: currentPost.post.emoji,
      text: currentPost.post.text,
      place: currentPost.post.place,
      likeCnt: currentPost.post.likeCnt,
      isLoading: placeCommentsLoading,
      likeUrl: id => {
        return APIS.post.place.like(id).url;
      },
      postComment: async () => {
        return await commentOn(
          APIS.post.place.comment.main().url,
          'hotplaceId',
        );
      },
      likeOnComment: async commentId => {
        return await likeOn(APIS.post.place.comment.like, commentId);
      },
      unlikeOnComment: async commentId => {
        return await unlikeOn(APIS.post.place.comment.like, commentId);
      },
      replyOnComment: async commentId => {
        return await replyOn(APIS.post.place.comment.reply().url, commentId);
      },
    },
  };
  const handleLike = () => {
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
  };
  const handleSend = async () => {
    if (text.length > 0) {
      if (textType === TextType.COMMENT) {
        const res = await post[currentPost.type].postComment();
        if (isOkay(res)) {
          setText('');
          pullToRefresh();
        }
      } else {
        const res = await post[currentPost.type].replyOnComment(textType.id);
        if (isOkay(res)) {
          setText('');
          pullToRefresh();
        }
      }
      ReactNativeHapticFeedback.trigger('impactMedium', options);
    }
  };
  const handleLikeOnComment = async (commentId, prevLiked) => {
    if (prevLiked) {
      const res = await post[currentPost.type].unlikeOnComment(commentId);
      if (isOkay(res)) {
        pullToRefresh();
      }
    } else {
      const res = await post[currentPost.type].likeOnComment(commentId);
      if (isOkay(res)) {
        pullToRefresh();
      }
    }
    ReactNativeHapticFeedback.trigger('impactLight', options);
  };
  const handleReplyOnComment = comment => {
    setTextType(comment);
  };
  const borderBottomProp = {
    borderBottomColor: GRAY_COLOR,
    borderBottomWidth: 0.3,
  };

  useEffect(() => {
    pullToRefresh();
  }, []);

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
                  refreshing={post[currentPost.type].isLoading}
                  onRefresh={pullToRefresh}
                />
              }>
              <Div itemsCenter justifyCenter>
                <Span fontSize={100}>{post[currentPost.type].emoji}</Span>
              </Div>
              {post[currentPost.type].place && (
                <Div itemsCenter justifyCenter px20 py10>
                  <Span bold>{post[currentPost.type].place}</Span>
                </Div>
              )}
              <Div itemsCenter justifyCenter px20>
                <Span>{post[currentPost.type].text}</Span>
              </Div>
              <Div>
                <Row itemsCenter pt10 pb10 px20 {...borderBottomProp}>
                  <Col auto>
                    <Row>
                      <Span medium>{`좋아요 ${
                        post[currentPost.type].likeCnt
                      }개`}</Span>
                    </Row>
                  </Col>
                  <Col></Col>
                  <Col auto>
                    <Row>
                      <Col auto px5 onPress={handleLike}>
                        <Heart
                          {...iconSettings}
                          fill={currentPost.didLike ? 'red' : 'white'}></Heart>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                {post[currentPost.type].comments &&
                  post[currentPost.type].comments.map((comment, index) => {
                    return (
                      <Comment
                        comment={comment}
                        handleLikeOnComment={handleLikeOnComment}
                        handleReplyOnComment={handleReplyOnComment}
                        key={index}
                      />
                    );
                  })}
                <Row py10>
                  <Col></Col>
                  <Col auto>
                    <Span color={GRAY_COLOR}>댓글을 모두 확인했습니다.</Span>
                  </Col>
                  <Col></Col>
                </Row>
              </Div>
            </ScrollView>
            <SafeAreaView>
              <Div borderTopColor={GRAY_COLOR} borderTopWidth={0.3}>
                {textType !== TextType.COMMENT && (
                  <Row px20 py10 bg={GRAY_COLOR}>
                    <Col mr10>
                      <Span>{`${textType.userInfo.userName}에게 댓글 다는중`}</Span>
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
                          게시
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

const Comment = ({comment, handleLikeOnComment, handleReplyOnComment}) => {
  const [expand, setExpand] = useState(false);
  return (
    <Div pt20 px20>
      <Row itemsCenter justifyCenter flex>
        <Col auto itemsCenter justifyCenter rounded20 overflowHidden>
          <Img
            source={
              IMAGES.characters[comment.userInfo.userProfileImgUrl] ||
              IMAGES.imageProfileNull
            }
            w30
            h30></Img>
        </Col>
        <Col>
          <Row mb5 pl10>
            <Col mr10 justifyCenter>
              <Row>
                <Span medium color={'black'}>
                  {comment.userInfo.userName}
                </Span>
                <Span ml5>{comment.content}</Span>
              </Row>
            </Col>
          </Row>
          <Row pl10>
            {comment.likeCnt > 0 && (
              <Col mr10 auto>
                <Span color={GRAY_COLOR}>{`좋아요 ${comment.likeCnt}개`}</Span>
              </Col>
            )}
            <Col auto onPress={() => handleReplyOnComment(comment)}>
              <Span color={GRAY_COLOR}>답글 달기</Span>
            </Col>
            <Col></Col>
          </Row>
        </Col>
        <Col
          auto
          itemsCenter
          justifyCenter
          onPress={() => handleLikeOnComment(comment.id, comment.isLiked)}>
          <Heart
            fill={comment.isLiked ? 'red' : 'white'}
            color={'black'}
            height={14}></Heart>
        </Col>
      </Row>
      {[...comment.nestedComments].reverse().map((nestedComment, index) => {
        return (
          <Row itemsCenter justifyCenter flex ml30 pt10 key={index} pl10>
            <Col auto itemsCenter justifyCenter rounded20 overflowHidden>
              <Img
                source={
                  IMAGES.characters[nestedComment.userInfo.userProfileImgUrl] ||
                  IMAGES.imageProfileNull
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
                {nestedComment.likeCnt && nestedComment.likeCnt > 0 && (
                  <Col mr10 auto>
                    <Span
                      color={
                        GRAY_COLOR
                      }>{`좋아요 ${nestedComment.likeCnt}개`}</Span>
                  </Col>
                )}
                <Col auto onPress={() => handleReplyOnComment(comment)}>
                  <Span color={GRAY_COLOR}>답글 달기</Span>
                </Col>
                <Col></Col>
              </Row>
            </Col>
            <Col
              auto
              itemsCenter
              justifyCenter
              onPress={() =>
                handleLikeOnComment(nestedComment.id, nestedComment.didLike)
              }>
              <Heart
                fill={nestedComment.isLiked ? 'red' : 'white'}
                color={'black'}
                height={14}></Heart>
            </Col>
          </Row>
        );
      })}
    </Div>
  );
};

export default PostDetailScreen;
