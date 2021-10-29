import {useNavigation} from '@react-navigation/core';
import React, {useEffect, useState} from 'react';
import {Heart} from 'react-native-feather';
import {shallowEqual, useSelector} from 'react-redux';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {Img} from 'src/components/common/Img';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import TopHeader from 'src/components/TopHeader';
import APIS from 'src/modules/apis';
import {
  GO_COLOR,
  HAS_NOTCH,
  iconSettings,
  PLACE,
  REPORT,
  SUNGAN,
} from 'src/modules/constants';
import {IMAGES} from 'src/modules/images';
import {
  postPromiseFn,
  useApiSelector,
  useReloadGET,
  useReloadPOST,
} from 'src/redux/asyncReducer';
import {RootState} from 'src/redux/rootReducer';
import {Input, KeyboardAvoidingView, NativeBaseProvider} from 'native-base';
import {Platform, RefreshControl, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

const PostDetailScreen = () => {
  const {
    feed: {currentPost},
    app: {
      session: {token, currentUser},
    },
  } = useSelector((root: RootState) => root, shallowEqual);

  const {data: reportComments, isLoading: reportCommentsLoading} =
    useApiSelector(APIS.post.reportComments);

  const {data: sunganComments, isLoading: sunganCommentsLoading} =
    useApiSelector(APIS.post.sunganComments);

  const {data: placeComments, isLoading: placeCommentsLoading} = useApiSelector(
    APIS.post.placeComments,
  );

  const apiGET = useReloadGET();
  const apiPOST = useReloadPOST();

  const [comment, setComment] = useState('');
  const [isLiked, setIsLiked] = useState(currentPost.didLike);

  const pullToRefresh = () => {
    if (currentPost.type === REPORT) {
      apiGET(APIS.post.reportComments(currentPost.post.id));
    } else if (currentPost.type === SUNGAN) {
      apiGET(APIS.post.sunganComments(currentPost.post.id));
    } else if (currentPost.type === PLACE) {
      apiGET(APIS.post.placeComments(currentPost.post.id));
    }
  };
  useEffect(() => {
    pullToRefresh();
  }, [currentPost]);

  const commentOnPlace = async () => {
    return await postPromiseFn({
      url: APIS.post.placeComment().url,
      body: {
        hotplaceId: currentPost.post.id,
        content: comment,
        userName: currentUser.username,
      },
      token,
    });
  };
  const commentOnReport = async () => {
    return await postPromiseFn({
      url: APIS.post.reportComment().url,
      body: {
        reportId: currentPost.post.id,
        content: comment,
        userName: currentUser.username,
      },
      token,
    });
  };
  const commentOnSungan = async () => {
    return await postPromiseFn({
      url: APIS.post.sunganComment().url,
      body: {
        sunganId: currentPost.post.id,
        content: comment,
        userName: currentUser.username,
      },
      token,
    });
  };

  const post = {
    [REPORT]: {
      comments: reportComments?.data.comments,
      emoji: '🚨',
      text: currentPost.post.text,
      likeCnt: currentPost.post.likeCnt,
      isLoading: reportCommentsLoading,
      postComment: commentOnReport,
    },
    [SUNGAN]: {
      comments: sunganComments?.data,
      emoji: currentPost.post.emoji,
      text: currentPost.post.detail,
      likeCnt: currentPost.post.likeCnt,
      isLoading: sunganCommentsLoading,
      postComment: commentOnSungan,
    },
    [PLACE]: {
      comments: placeComments?.data,
      emoji: currentPost.post.emoji,
      text: currentPost.post.text,
      place: currentPost.post.place,
      likeCnt: currentPost.post.likeCnt,
      isLoading: placeCommentsLoading,
      postComment: commentOnPlace,
    },
  };

  const like = () => {
    if (isLiked) {
      setIsLiked(false);
    } else {
      setIsLiked(true);
    }
  };

  const handleSend = () => {
    if (comment.length > 0) {
      console.log('console.log(comment);', comment);
      post[currentPost.type].postComment();
      setComment('');
      pullToRefresh();
    }
  };
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
          keyboardVerticalOffset={HAS_NOTCH ? -30 : 0}
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
                <Row itemsCenter pt10 pb20 px20>
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
                      <Col auto px5 onPress={like}>
                        <Heart
                          {...iconSettings}
                          fill={isLiked ? 'red' : 'white'}></Heart>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                {(post[currentPost.type].comments &&
                  post[currentPost.type].comments.map((comment, index) => {
                    return (
                      <Row
                        itemsCenter
                        justifyCenter
                        pb10
                        pt5
                        flex
                        px20
                        key={index}>
                        <Col
                          auto
                          itemsCenter
                          justifyCenter
                          rounded20
                          overflowHidden>
                          <Img source={IMAGES.example2} w15 h15></Img>
                        </Col>
                        <Col mx10 justifyCenter>
                          <Row>
                            <Span medium color={'black'}>
                              irlyglo
                            </Span>
                            <Span ml5>{comment.content}</Span>
                          </Row>
                        </Col>
                        <Col auto itemsCenter justifyCenter>
                          <Heart color={'black'} height={14}></Heart>
                        </Col>
                      </Row>
                    );
                  })) || (
                  <Div px20>
                    <Span color={'rgb(199,199,204)'}>댓글 없음</Span>
                  </Div>
                )}
              </Div>
            </ScrollView>
            <SafeAreaView>
              <Row
                itemsCenter
                px20
                py10
                borderTopColor={'rgb(199,199,204)'}
                borderTopWidth={0.3}>
                <Col auto itemsCenter justifyCenter rounded20 overflowHidden>
                  <Img source={IMAGES.example2} w30 h30></Img>
                </Col>
                <Col
                  ml10
                  justifyCenter
                  borderColor={'rgb(199,199,204)'}
                  borderWidth={0.3}
                  rounded5>
                  <Input
                    w={'100%'}
                    fontSize={13}
                    value={comment}
                    variant="unstyled"
                    textContentType={'none'}
                    numberOfLines={1}
                    returnKeyType={'send'}
                    onChangeText={setComment}
                    onSubmitEditing={handleSend}
                    InputRightElement={
                      <Span color={GO_COLOR} px15 onPress={handleSend}>
                        게시
                      </Span>
                    }
                    placeholder={'댓글 달기'}></Input>
                </Col>
              </Row>
            </SafeAreaView>
          </Div>
        </KeyboardAvoidingView>
      </Div>
    </NativeBaseProvider>
  );
};

export default PostDetailScreen;
