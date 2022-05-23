import React from 'react';
import {Div} from 'src/components/common/Div';
import {HAS_NOTCH} from 'src/modules/constants';
import {RefreshControl} from 'react-native';
import {Row} from 'src/components/common/Row';
import {Col} from 'src/components/common/Col';
import {Span} from 'src/components/common/Span';
import apis from 'src/modules/apis';
import {useApiSelector, useReloadGETWithToken} from 'src/redux/asyncReducer';
import {Img} from 'src/components/common/Img';
import {
  getNftName,
  getNftProfileImage,
  useIsCurrentNft,
} from 'src/modules/nftUtils';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {
  useGotoNftCollectionProfile,
  useGotoNftProfile,
} from 'src/hooks/useGoto';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {BlurView} from '@react-native-community/blur';
import {useNavigation} from '@react-navigation/native';
import {ChevronLeft} from 'react-native-feather';
import useFollow from 'src/hooks/useFollow';

export enum FollowOwnerType {
  Nft,
  NftCollection,
}

export enum FollowType {
  Followings,
  Followers,
}

const FollowListScreen = ({
  route: {
    params: {followOwnerType, followType, contractAddress, tokenId},
  },
}) => {
  const {data: followListRes, isLoading: followListLoad} = useApiSelector(
    apis.follow.list,
  );
  const {goBack} = useNavigation();
  const reloadGetWithToken = useReloadGETWithToken();
  const onRefresh = () => {
    if (followListLoad) return;
    reloadGetWithToken(
      followOwnerType == FollowOwnerType.Nft
        ? apis.follow.list(
            followType == FollowType.Followers ? true : false,
            contractAddress,
            tokenId,
          )
        : apis.follow.list(
            followType == FollowType.Followers ? true : false,
            contractAddress,
          ),
    );
  };

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
    <Div flex={1} bgWhite>
      <Animated.FlatList
        automaticallyAdjustContentInsets
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
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
                      {FollowType.Followers == followType ? '팔로워' : '팔로잉'}
                    </Span>
                  </Col>
                  <Col></Col>
                </Row>
              </Div>
            </Div>
          </>
        }
        refreshControl={
          <RefreshControl refreshing={followListLoad} onRefresh={onRefresh} />
        }
        data={followListRes ? followListRes.follows : []}
        renderItem={({item, index}) => {
          return (
            <FollowOwner
              nft={(item as any).nft}
              isFollowing={(item as any).is_following}
            />
          );
        }}></Animated.FlatList>
    </Div>
  );
};

function FollowOwner({nft, isFollowing}) {
  const [following, _followerCount, handlePressFollowing] = useFollow(
    isFollowing,
    0,
    apis.follow.contractAddressAndTokenId(nft.contract_address, nft.token_id)
      .url,
  );
  const isCurrentNft = useIsCurrentNft(nft);
  const gotoNftProfile = useGotoNftProfile({
    contractAddress: nft.contract_address,
    tokenId: nft.token_id,
  });
  const gotoNftCollectionProfile = useGotoNftCollectionProfile({
    contractAddress: nft.contract_address,
  });
  return (
    <Row
      itemsCenter
      h70
      onPress={nft.token_id ? gotoNftProfile : gotoNftCollectionProfile}
      px15
      relative>
      <Img w50 h50 rounded100 uri={getNftProfileImage(nft, 100, 100)} />
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
      {!isCurrentNft && (
        <Col
          auto
          bgRealBlack={!following}
          p8
          rounded100
          border1={following}
          borderGray400={following}
          onPress={handlePressFollowing}>
          <Span white={!following} bold px5>
            {following ? '언팔로우' : '팔로우'}
          </Span>
        </Col>
      )}
    </Row>
  );
}

export default FollowListScreen;
