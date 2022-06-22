import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import React, {useState} from 'react';
import {ActivityIndicator} from 'react-native';
import {
  getNftName,
  getNftProfileImage,
  useIsCurrentNft,
} from 'src/modules/nftUtils';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {Col} from './Col';
import {Div} from './Div';
import {Img} from './Img';
import {Row} from './Row';
import {Span} from './Span';
import {Heart, MessageCircle} from 'react-native-feather';
import apis from 'src/modules/apis';
import {useApiPOSTWithToken, useApiSelector} from 'src/redux/asyncReducer';
import {
  useGotoChatRoomFromProfile,
  useGotoFollowList,
  useGotoNftCollectionProfile,
  useGotoNftProfile,
} from 'src/hooks/useGoto';
import useFollow from 'src/hooks/useFollow';
import {FollowOwnerType, FollowType} from 'src/screens/FollowListScreen';
import Colors from 'src/constants/Colors';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {handlePressContribution} from 'src/modules/bottomPopupUtils';

export default function NftProfileSummaryBottomSheetScrollView({
  contractAddress,
  tokenId,
}) {
  const {data: profileData, isLoading: profileLoading} = useApiSelector(
    apis.nft.contractAddressAndTokenId(contractAddress, tokenId),
  );
  if (profileData?.nft && !profileLoading)
    return <NftProfileSummary nft={profileData.nft} />;
  return (
    <Row>
      <Col></Col>
      <Col auto>
        <ActivityIndicator />
      </Col>
      <Col />
    </Row>
  );
}

enum HugState {
  UnHuggable,
  Huggable,
  Hugged,
}
export function NftProfileSummary({nft, token = null}) {
  const {currentNft} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const isCurrentNft = useIsCurrentNft(nft);
  const apiPOSTWithToken = useApiPOSTWithToken();
  const [isFollowing, followerCount, handlePressFollowing] = useFollow(
    nft.is_following,
    nft.follower_count,
    apis.follow.contractAddressAndTokenId(nft.contract_address, nft.token_id)
      .url,
  );
  const [huggable, setHuggable] = useState(
    nft.huggable ? HugState.Huggable : HugState.UnHuggable,
  );
  const hug = () => {
    if (huggable == HugState.Huggable) {
      apiPOSTWithToken(
        apis.hug.qr(),
        {
          token,
        },
        data => {
          setHuggable(HugState.Hugged);
        },
        error => {
          setHuggable(HugState.UnHuggable);
        },
      );
    }
  };
  const hugButtonProps =
    huggable == HugState.UnHuggable
      ? {borderGray200: true}
      : huggable == HugState.Huggable
      ? {borderDanger: true}
      : {borderDanger: true, bgDanger: true};
  const hugText =
    huggable == HugState.UnHuggable
      ? '내일 다시 허그를 해주세요.'
      : huggable == HugState.Huggable
      ? '허그로 상대의 존재감을 높여줘요.'
      : `${getNftName(currentNft)}가 ${getNftName(nft)}를 허그했습니다!`;
  const gotoNftProfile = useGotoNftProfile({
    nft,
  });
  const gotoNftCollectionProfile = useGotoNftCollectionProfile({
    nftCollection: nft,
  });
  const gotoChatRoom = useGotoChatRoomFromProfile();
  const gotoFollowList = useGotoFollowList({
    followOwnerType: FollowOwnerType.Nft,
    contractAddress: nft.contract_address,
    tokenId: nft.token_id,
  });
  const notchHeight = useSafeAreaInsets().top;
  const headerHeight = notchHeight + 80;
  return (
    <BottomSheetScrollView>
      {nft.background_image_uri ? (
        <Img
          zIndex={-10}
          uri={nft.background_image_uri}
          absolute
          top0
          w={DEVICE_WIDTH}
          h={headerHeight}></Img>
      ) : (
        <Div absolute top0 h={headerHeight} bgGray400 w={DEVICE_WIDTH}></Div>
      )}
      <Row zIndex={100} px15 relative mt40>
        <Div absolute bottom0 w={DEVICE_WIDTH} bgWhite h={50}></Div>
        <Col auto mr10 relative onPress={() => gotoNftProfile()}>
          <Img
            rounded100
            border4
            borderWhite
            bgGray200
            h85
            w85
            uri={getNftProfileImage(nft, 100, 100)}></Img>
        </Col>
        <Col justifyEnd>
          {!isCurrentNft && (
            <Div>
              <Row py8>
                <Col />
                <Col
                  auto
                  bgRealBlack
                  p8
                  mr8
                  rounded100
                  onPress={() =>
                    gotoChatRoom(
                      getNftName(nft),
                      getNftProfileImage(nft),
                      nft.contract_address,
                      nft.token_id,
                    )
                  }>
                  <MessageCircle
                    strokeWidth={2}
                    color={'white'}
                    height={15}
                    width={15}
                  />
                </Col>
                {token && (
                  <Col
                    auto
                    border1
                    p8
                    mr8
                    rounded100
                    {...hugButtonProps}
                    onPress={hug}>
                    <Div>
                      <Heart
                        strokeWidth={2}
                        color={
                          HugState.UnHuggable == huggable
                            ? Colors.gray[200]
                            : Colors.danger.DEFAULT
                        }
                        fill={'white'}
                        height={15}
                        width={15}
                      />
                    </Div>
                  </Col>
                )}
                <Col
                  auto
                  bgRealBlack={!isFollowing}
                  p8
                  rounded100
                  border1={isFollowing}
                  borderGray200={isFollowing}
                  onPress={handlePressFollowing}>
                  <Span white={!isFollowing} bold px5>
                    {isFollowing ? '팔로잉' : '팔로우'}
                  </Span>
                </Col>
              </Row>
            </Div>
          )}
        </Col>
      </Row>
      <Div px15 py10 bgWhite>
        <Div>
          <Span fontSize={20} bold>
            {getNftName(nft)}
          </Span>
        </Div>
        <Div pt3 onPress={gotoNftCollectionProfile}>
          <Span gray700>{nft.nft_metadatum.name}</Span>
        </Div>
        <Row mt8>
          <Col auto mr20 onPress={() => gotoFollowList(FollowType.Followers)}>
            <Span bold>
              <Span gray700 regular>
                팔로워
              </Span>{' '}
              {followerCount}
            </Span>
          </Col>
          <Col auto mr20 onPress={() => gotoFollowList(FollowType.Followings)}>
            <Span bold>
              <Span gray700 regular>
                팔로잉
              </Span>{' '}
              {nft.following_count}
            </Span>
          </Col>
          <Col auto mr20 onPress={handlePressContribution}>
            <Span bold>
              {nft.contribution}{' '}
              <Span gray700 regular>
                인분 기여
              </Span>
            </Span>
          </Col>
          <Col />
        </Row>
        {token && !isCurrentNft && (
          <Div mt10>
            <Span danger>{hugText}</Span>
          </Div>
        )}
      </Div>
    </BottomSheetScrollView>
  );
}
