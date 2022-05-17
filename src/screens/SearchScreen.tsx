import React from 'react';
import {Div} from 'src/components/common/Div';
import {HAS_NOTCH} from 'src/modules/constants';
import {RefreshControl} from 'react-native';
import {Row} from 'src/components/common/Row';
import {Col} from 'src/components/common/Col';
import {
  AtSign,
  Award,
  Bell,
  ChevronLeft,
  ChevronRight,
  Search,
  Send,
  Star,
} from 'react-native-feather';
import {Span} from 'src/components/common/Span';
import apis from 'src/modules/apis';
import {useApiSelector, useReloadGETWithToken} from 'src/redux/asyncReducer';
import Post from 'src/components/common/Post';
import {ScrollView, TextInput} from 'src/modules/viewComponents';
import {Img} from 'src/components/common/Img';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';
import {
  getNftName,
  getNftProfileImage,
  useIsCurrentNft,
} from 'src/modules/nftUtils';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {useGotoCapsule, useGotoNftProfile} from 'src/hooks/useGoto';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {BlurView} from '@react-native-community/blur';
import useEdittableText from 'src/hooks/useEdittableText';
import {QuestionIcon} from 'native-base';

const SearchScreen = () => {
  const {data: rankRes, isLoading: rankLoad} = useApiSelector(apis.rank.all);
  const reloadGetWithToken = useReloadGETWithToken();
  const onRefresh = () => {
    reloadGetWithToken(apis.rank.all());
  };
  const translationY = useSharedValue(0);
  const [text, textHasChanged, handleChangeText] = useEdittableText('');
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
  const iconSettingsXs = {
    strokeWidth: 1.3,
    color: 'black',
    height: 12,
    width: 20,
  };
  return (
    <Div flex bgWhite>
      <Animated.FlatList
        automaticallyAdjustContentInsets
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        ListHeaderComponent={
          <>
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
              <Row
                itemsCenter
                py5
                h40
                px15
                zIndex={100}
                absolute
                w={DEVICE_WIDTH}
                top={HAS_NOTCH ? 49 : 25}>
                <Col mr10>
                  <TextInput
                    value={text}
                    placeholder={'NFT나 컬렉션을 찾아보세요'}
                    fontSize={16}
                    bgGray200
                    rounded100
                    p8
                    bold
                    onChangeText={handleChangeText}
                  />
                </Col>
                <Col auto bgRealBlack p8 rounded100>
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
            <Row px15 py5>
              <Col itemsStart>
                <ChevronLeft
                  strokeWidth={2}
                  color={'black'}
                  height={20}
                  width={20}></ChevronLeft>
              </Col>
              <Col auto justifyCenter>
                <Span fontSize={16}>현제 주</Span>
              </Col>
              <Col itemsEnd>
                <ChevronRight
                  strokeWidth={2}
                  color={'black'}
                  height={20}
                  width={20}></ChevronRight>
              </Col>
            </Row>
          </>
        }
        stickyHeaderIndices={[0]}
        refreshControl={
          <RefreshControl refreshing={rankLoad} onRefresh={onRefresh} />
        }
        data={rankRes ? rankRes.ranks : []}
        renderItem={({item, index}) => {
          console.log(JSON.stringify(item));
          return <RankedNft rankItem={item} index={index} />;
        }}></Animated.FlatList>
    </Div>
  );
};

function RankedNft({rankItem, index}) {
  const nft = rankItem.nft;
  const isCurrentNft = useIsCurrentNft(nft);
  const gotoNftProfile = useGotoNftProfile({
    contractAddress: nft.contract_address,
    tokenId: nft.token_id,
  });
  return (
    <Row
      itemsCenter
      py10
      onPress={gotoNftProfile}
      px15
      bgGray100={isCurrentNft}>
      <Img w50 h50 rounded100 uri={getNftProfileImage(nft, 200, 200)} />
      <Col mx15>
        <Div>
          <Span medium fontSize={15}>
            {getNftName(nft)}
          </Span>
        </Div>
        {getNftName(nft) !== nft.nft_metadatum.name && (
          <Div mt3>
            <Span gray600 fontSize={12}>
              {nft.nft_metadatum.name}
            </Span>
          </Div>
        )}
      </Col>
      <Col />
      {isCurrentNft && (
        <Col auto mr10 itemsCenter justifyCenter>
          <Star strokeWidth={2} color={'black'} height={16} width={16} />
        </Col>
      )}
      <Col auto mr3 itemsCenter justifyCenter>
        <Award strokeWidth={2} color={'black'} height={16} width={16} />
      </Col>
      <Col auto mr10 itemsCenter justifyCenter>
        <Span>{index == 0 ? rankItem.position : index}</Span>
      </Col>
      <Col auto mr3 itemsCenter justifyCenter>
        <AtSign strokeWidth={2} color={'black'} height={16} width={16} />
      </Col>
      <Col auto mr10 itemsCenter justifyCenter>
        <Span>{rankItem.rank}</Span>
      </Col>
    </Row>
  );
}

export default SearchScreen;
