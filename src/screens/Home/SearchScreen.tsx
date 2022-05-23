import React, {useRef} from 'react';
import {Div} from 'src/components/common/Div';
import {HAS_NOTCH} from 'src/modules/constants';
import {ActivityIndicator, RefreshControl} from 'react-native';
import {Row} from 'src/components/common/Row';
import {Col} from 'src/components/common/Col';
import {
  AtSign,
  Award,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Search,
  Star,
} from 'react-native-feather';
import {Span} from 'src/components/common/Span';
import apis from 'src/modules/apis';
import {useApiSelector, useReloadGETWithToken} from 'src/redux/asyncReducer';
import {TextInput} from 'src/modules/viewComponents';
import {Img} from 'src/components/common/Img';
import {useIsCurrentNft} from 'src/modules/nftUtils';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {useGotoNftProfile, useGotoRankSeason} from 'src/hooks/useGoto';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {BlurView} from '@react-native-community/blur';
import useEdittableText from 'src/hooks/useEdittableText';
import {resizeImageUri} from 'src/modules/uriUtils';
import Colors from 'src/constants/Colors';

const SearchScreen = () => {
  const searchRef = useRef(null);
  const {data: rankRes, isLoading: rankLoad} = useApiSelector(apis.rank.all);
  const reloadGetWithToken = useReloadGETWithToken();
  const onRefresh = () => {
    if (rankLoad) return;
    reloadGetWithToken(
      apis.rank.all(rankRes?.rank_season?.cwyear, rankRes?.rank_season?.cweek),
    );
  };
  const [text, textHasChanged, handleChangeText] = useEdittableText('');
  const previousSeason = rankRes?.previous_season;
  const nextSeason = rankRes?.next_season;
  const onPressLeft = () => {
    if (!rankRes || rankLoad || !previousSeason) return;
    reloadGetWithToken(
      apis.rank.all(previousSeason.cwyear, previousSeason.cweek, text),
    );
  };
  const onPressRight = () => {
    if (!rankRes || rankLoad || !nextSeason) return;
    reloadGetWithToken(
      apis.rank.all(nextSeason.cwyear, nextSeason.cweek, text),
    );
  };
  const onPressSearch = () => {
    searchRef?.current?.focus();
  };
  const gotoRankSeason = useGotoRankSeason({
    cwyear: rankRes?.rank_season?.cwyear,
    cweek: rankRes?.rank_season?.cweek,
  });

  const translationY = useSharedValue(0);

  const handleChangeQuery = text => {
    handleChangeText(text);
    if (rankRes) {
      reloadGetWithToken(
        apis.rank.all(
          rankRes.rank_season.cwyear,
          rankRes.rank_season.cweek,
          text,
        ),
      );
    }
  };
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
    <Div flex={1} bgWhite>
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
        <Div zIndex={100} absolute w={DEVICE_WIDTH} top={HAS_NOTCH ? 49 : 25}>
          <Row itemsCenter py5 h40 px15>
            <Col mr10>
              <TextInput
                innerRef={searchRef}
                value={text}
                placeholder={'NFT를 찾아보세요'}
                fontSize={16}
                bgGray200
                rounded100
                px8
                h32
                bold
                onChangeText={handleChangeQuery}
              />
            </Col>
            <Col auto bgRealBlack p8 rounded100 onPress={onPressSearch}>
              <Div>
                <Search
                  strokeWidth={2}
                  color={'white'}
                  height={16}
                  width={16}
                />
              </Div>
            </Col>
          </Row>
        </Div>
      </Div>
      <Animated.FlatList
        style={{marginTop: -headerHeight}}
        automaticallyAdjustContentInsets
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        ListHeaderComponent={
          <>
            <Div h={headerHeight}></Div>
            <Row px15 py5 itemsCenter>
              <Col itemsStart>
                <Div auto p4 rounded100 onPress={onPressLeft}>
                  <ChevronLeft
                    strokeWidth={2}
                    color={!previousSeason ? Colors.gray[200] : 'black'}
                    height={20}
                    width={20}></ChevronLeft>
                </Div>
              </Col>
              <Col auto onPress={gotoRankSeason}>
                {!rankLoad && rankRes ? (
                  <Span fontSize={16} bold>
                    {!nextSeason
                      ? '현재 주'
                      : `${rankRes.rank_season.cwyear}년 ${rankRes.rank_season.cweek}주`}
                  </Span>
                ) : (
                  <ActivityIndicator />
                )}
              </Col>
              <Col itemsEnd>
                <Div auto p4 rounded100 onPress={onPressRight}>
                  <ChevronRight
                    strokeWidth={2}
                    color={!nextSeason ? Colors.gray[200] : 'black'}
                    height={20}
                    width={20}></ChevronRight>
                </Div>
              </Col>
            </Row>
          </>
        }
        refreshControl={
          <RefreshControl
            refreshing={rankLoad && !textHasChanged}
            onRefresh={onRefresh}
          />
        }
        data={rankRes ? rankRes.ranks : []}
        renderItem={({item, index}) => {
          return <RankedNft rankItem={item} />;
        }}></Animated.FlatList>
    </Div>
  );
};

function RankedNft({rankItem}) {
  const isCurrentNft = useIsCurrentNft({
    contract_address: rankItem.contract_address,
    token_id: rankItem.token_id,
  });
  const gotoNftProfile = useGotoNftProfile({
    contractAddress: rankItem.contract_address,
    tokenId: rankItem.token_id,
  });
  return (
    <Row
      itemsCenter
      h70
      onPress={gotoNftProfile}
      px15
      relative
      bgGray200={isCurrentNft}>
      <Img
        w50
        h50
        rounded100
        uri={
          rankItem.nft_image_uri
            ? resizeImageUri(rankItem.nft_image_uri, 200, 200)
            : rankItem.nft_metadatum_image_uri
        }
      />
      <Col mx15>
        <Div>
          <Span medium fontSize={15}>
            {rankItem.nft_name || rankItem.nft_metadatum_name}
          </Span>
        </Div>
        {rankItem.nft_name && (
          <Div mt3>
            <Span gray600 fontSize={12}>
              {rankItem.nft_metadatum_name}
            </Span>
          </Div>
        )}
      </Col>
      <Col />
      <Col auto mr10 itemsCenter justifyCenter>
        <Span>{rankItem.rank}위</Span>
      </Col>
      <Col auto mr10 itemsCenter justifyCenter>
        <Span>{rankItem.rank_score} RP</Span>
      </Col>
    </Row>
  );
}

export default SearchScreen;
