import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import React from 'react';
import {ActivityIndicator} from 'react-native';
import {
  getNftName,
  getNftProfileImage,
  useIsCurrentNft,
} from 'src/modules/nftUtils';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {KeyboardAvoidingView, TextInput} from 'src/modules/viewComponents';
import {Col} from './Col';
import {Div} from './Div';
import {Img} from './Img';
import {Row} from './Row';
import {Span} from './Span';
import {MessageCircle} from 'react-native-feather';
import useUploadImage from 'src/hooks/useUploadImage';
import apis from 'src/modules/apis';
import {useApiSelector} from 'src/redux/asyncReducer';
import {
  useGotoCapsule,
  useGotoChatRoom,
  useGotoNftCollectionProfile,
  useGotoNftProfile,
} from 'src/hooks/useGoto';
import {ICONS} from 'src/modules/icons';
import useFollow from 'src/hooks/useFollow';
import TruncatedMarkdown from './TruncatedMarkdown';
import {ChatRoomType} from 'src/screens/ChatRoomScreen';
import {HAS_NOTCH} from 'src/modules/constants';

export default function NftProfileSummaryBottomSheetScrollView({
  contractAddress,
  tokenId,
}) {
  const {data: profileData, isLoading: profileLoading} = useApiSelector(
    apis.nft.contractAddressAndTokenId(contractAddress, tokenId),
  );
  if (profileData && !profileLoading)
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

export function NftProfileSummary({nft}) {
  const isCurrentNft = useIsCurrentNft(nft);
  const goToCapsule = useGotoCapsule({nft});
  const [isFollowing, followerCount, handlePressFollowing] = useFollow(
    nft.is_following,
    nft.follower_count,
    apis.follow.contractAddressAndTokenId(nft.contract_address, nft.token_id)
      .url,
  );
  const gotoNftProfile = useGotoNftProfile({
    contractAddress: nft.contract_address,
    tokenId: nft.token_id,
  });
  const gotoNftCollectionProfile = useGotoNftCollectionProfile({
    contractAddress: nft.contract_address,
  });
  const gotoChatRoom = useGotoChatRoom({
    chatRoomType: ChatRoomType.DirectMessage,
  });
  const headerHeight = HAS_NOTCH ? 124 : 100;
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
        <Col auto mr10 relative onPress={gotoNftProfile}>
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
          {!isCurrentNft ? (
            <Div>
              <Row py8>
                <Col />
                <Col
                  auto
                  bgRealBlack
                  p8
                  rounded100
                  onPress={() =>
                    gotoChatRoom({
                      roomName: getNftName(nft),
                      roomImage: [getNftProfileImage(nft)],
                      contractAddress: nft.contract_address,
                      tokenId: nft.token_id,
                    })
                  }>
                  <Div>
                    <MessageCircle
                      strokeWidth={2}
                      color={'white'}
                      height={16}
                      width={16}
                    />
                  </Div>
                </Col>
                <Col auto bgRealBlack p9 rounded100 onPress={goToCapsule} mx8>
                  <Div>
                    <Img w16 h16 source={ICONS.capsuleIconWhite}></Img>
                  </Div>
                </Col>
                <Col
                  auto
                  bgRealBlack={!isFollowing}
                  p8
                  rounded100
                  border1={isFollowing}
                  borderGray400={isFollowing}
                  onPress={handlePressFollowing}>
                  <Span white={!isFollowing} bold mt3 px5>
                    {isFollowing ? '언팔로우' : '팔로우'}
                  </Span>
                </Col>
              </Row>
            </Div>
          ) : (
            <Div>
              <Row py10>
                <Col />
                <Col auto bgRealBlack p8 rounded100 onPress={goToCapsule}>
                  <Div>
                    <Img w16 h16 source={ICONS.capsuleIconWhite}></Img>
                  </Div>
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
        {nft.story ? (
          <Div mt8 bgWhite>
            <TruncatedMarkdown text={nft.story} maxLength={500} />
          </Div>
        ) : null}
        <Row mt3>
          <Col auto mr20>
            <Span>
              {followerCount} <Span gray700>팔로워</Span>
            </Span>
          </Col>
          <Col auto>
            <Span>
              {nft.following_count} <Span gray700>팔로잉</Span>
            </Span>
          </Col>
          <Col />
        </Row>
      </Div>
    </BottomSheetScrollView>
  );
}
