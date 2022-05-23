import React, {useEffect, useState} from 'react';
import {Div} from 'src/components/common/Div';
import Post from 'src/components/common/Post';
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
import {ActivityIndicator, RefreshControl} from 'react-native';
import {Img} from 'src/components/common/Img';
import {ICONS} from 'src/modules/icons';

export default function RankSeasonScreen() {
  const {data: rankSeasonRes, isLoading: rankSeasonLoad} = useApiSelector(
    apis.rankSeason._,
  );
  const reloadGetWithToken = useReloadGETWithToken();
  const onRefresh = () => {
    if (rankSeasonLoad) return;
    reloadGetWithToken(
      apis.rankSeason._(
        rankSeasonRes?.rank_season?.cwyear,
        rankSeasonRes?.rank_season?.cweek,
      ),
    );
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
                    {rankSeasonRes?.rank_season ? (
                      `${rankSeasonRes.rank_season.cwyear}년 ${rankSeasonRes.rank_season.cweek}번째 주`
                    ) : (
                      <ActivityIndicator />
                    )}
                  </Span>
                </Col>
                <Col itemsEnd></Col>
              </Row>
            </Div>
          </Div>
        }
        refreshControl={
          <RefreshControl refreshing={rankSeasonLoad} onRefresh={onRefresh} />
        }
        renderItem={({item, index}) => <RankAward rankStrategy={item} />}
        data={rankSeasonRes?.rank_season?.rank_strategies || []}
        onScroll={scrollHandler}></Animated.FlatList>
    </KeyboardAvoidingView>
  );
}

const RankAward = ({rankStrategy}) => {
  return (
    <Row itemsCenter py15 px15>
      <Col auto>
        <Span bold fontSize={16}>
          {rankStrategy.start_index}위 ~
        </Span>
      </Col>
      <Col auto mr10>
        <Span bold fontSize={16}>
          {rankStrategy.end_index}위
        </Span>
      </Col>
      <Col />
      <Col auto>
        <Span bold>{rankStrategy.award_amount}</Span>
      </Col>
      <Col auto mx10>
        <Img h20 w20 source={ICONS.klayIcon}></Img>
      </Col>
    </Row>
  );
};
