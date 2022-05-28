import React from 'react';
import {Div} from 'src/components/common/Div';
import apis from 'src/modules/apis';
import {HAS_NOTCH} from 'src/modules/constants';
import {KeyboardAvoidingView} from 'src/modules/viewComponents';
import {Row} from 'src/components/common/Row';
import {useNavigation} from '@react-navigation/native';
import {Col} from 'src/components/common/Col';
import {ChevronLeft} from 'react-native-feather';
import {Span} from 'src/components/common/Span';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {BlurView} from '@react-native-community/blur';
import {useApiSelector, useReloadGETWithToken} from 'src/redux/asyncReducer';
import {RefreshControl} from 'react-native';
import {createdAtText} from 'src/modules/timeUtils';

export default function RankDeltumScreen({
  route: {
    params: {contractAddress, tokenId},
  },
}) {
  const {data: rankDeltumRes, isLoading: rankDeltumLoad} = useApiSelector(
    apis.rankDeltum.list,
  );
  const reloadGetWithToken = useReloadGETWithToken();
  const onRefresh = () => {
    if (rankDeltumLoad) return;
    reloadGetWithToken(apis.rankDeltum.list(contractAddress, tokenId));
  };
  const {goBack} = useNavigation();
  const translationY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => {
    translationY.value = event.contentOffset.y;
  });
  const headerHeight = HAS_NOTCH ? 94 : 70;
  const headerStyles = useAnimatedStyle(() => {
    return {
      width: DEVICE_WIDTH,
      height: headerHeight,
      opacity: Math.min(translationY.value / 50, 1),
    };
  });
  return (
    <KeyboardAvoidingView behavior="padding" flex={1} bgWhite relative>
      <Animated.FlatList
        automaticallyAdjustContentInsets
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Div h={headerHeight} zIndex={100}>
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
            <Div
              zIndex={100}
              absolute
              w={DEVICE_WIDTH}
              top={HAS_NOTCH ? 49 : 25}>
              <Row itemsCenter py5 h40 pr15 pl7>
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
                    랭크 포인트 로그
                  </Span>
                </Col>
                <Col itemsEnd></Col>
              </Row>
            </Div>
          </Div>
        }
        refreshControl={
          <RefreshControl refreshing={rankDeltumLoad} onRefresh={onRefresh} />
        }
        renderItem={({item, index}) => {
          return <RankDeltum rankDeltum={item} />;
        }}
        data={rankDeltumRes?.rank_delta || []}
        onScroll={scrollHandler}></Animated.FlatList>
    </KeyboardAvoidingView>
  );
}

enum RankDeltumEventType {
  Follow = 'follow',
  Post = 'post',
  Comment = 'comment',
  LikePost = 'like_post',
  LikeComment = 'like_comment',
  Hug = 'hug',
}

const RankDeltum = ({rankDeltum}) => {
  const event = rankDeltum.event;
  const point = rankDeltum.point;
  const getNotificationContent = () => {
    if (event == RankDeltumEventType.Comment) {
      return (
        <Span fontSize={14}>게시물에 댓글 {point < 0 ? '삭제' : '받음'}</Span>
      );
    }
    if (event == RankDeltumEventType.Post) {
      return <Span fontSize={14}>게시물 {point < 0 ? '삭제' : '올림'}</Span>;
    }
    if (event == RankDeltumEventType.LikePost) {
      return (
        <Span fontSize={14}>게시물에 좋아요 {point < 0 ? '취소' : '받음'}</Span>
      );
    }
    if (event == RankDeltumEventType.LikeComment) {
      return (
        <Span fontSize={14}>댓글에 좋아요 {point < 0 ? ' 취소' : '받음'}</Span>
      );
    }
    if (event == RankDeltumEventType.Follow) {
      return <Span fontSize={14}>팔로우 {point < 0 ? '취소' : '시작'}</Span>;
    }
    if (event == RankDeltumEventType.Hug) {
      return <Span fontSize={14}>허그 받음</Span>;
    }
  };
  return (
    <Row itemsCenter py15 px15>
      <Col auto>
        <Span bold fontSize={16}>
          {getNotificationContent()}
        </Span>
        <Span gray700 fontSize={12} mt5>
          {createdAtText(rankDeltum.created_at)}
        </Span>
      </Col>
      <Col />
      <Col auto>
        <Span>{point} RP</Span>
      </Col>
    </Row>
  );
};
