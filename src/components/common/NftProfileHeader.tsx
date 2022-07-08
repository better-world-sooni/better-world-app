import React from 'react';
import {
  ChevronDown,
  Grid,
  Maximize,
  Send,
  Settings,
} from 'react-native-feather';
import {Colors} from 'src/modules/styles';
import useFollow from 'src/hooks/useFollow';
import {
  useGotoFollowList,
  useGotoChatRoomFromProfile,
  useGotoNftCollectionProfile,
  useGotoQR,
  useGotoScan,
  useGotoNftProfileEdit,
} from 'src/hooks/useGoto';
import apis from 'src/modules/apis';
import {handlePressContribution, openNftList} from 'src/utils/bottomPopupUtils';
import {
  getNftName,
  getNftProfileImage,
  useIsCurrentNft,
} from 'src/utils/nftUtils';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {FollowOwnerType, FollowType} from 'src/screens/FollowListScreen';
import {ScanType} from 'src/screens/ScanScreen';
import {Col} from './Col';
import {Div} from './Div';
import {Img} from './Img';
import {Row} from './Row';
import {Span} from './Span';
import TruncatedMarkdown from './TruncatedMarkdown';

export default function NftProfileHeader({nftCore, nft, isCurrentNft, qrScan}) {
  const gotoNftCollectionProfile = useGotoNftCollectionProfile({
    nftCollection: nft?.nft_collection,
  });
  const [isFollowing, followerCount, handlePressFollowing] = useFollow(
    nft?.is_following,
    nft?.follower_count,
    nft?.contract_address,
    nft?.token_id,
  );
  const gotoFollowList = useGotoFollowList({
    followOwnerType: FollowOwnerType.Nft,
    contractAddress: nftCore.contract_address,
    tokenId: nftCore.token_id,
  });
  const gotoQr = useGotoQR();
  const gotoScan = useGotoScan({scanType: ScanType.Nft});
  const gotoChatRoom = useGotoChatRoomFromProfile();
  const gotoNftProfileEdit = useGotoNftProfileEdit();
  return (
    <>
      <Row zIndex={100} px15 relative>
        <Div absolute bottom0 w={DEVICE_WIDTH} bgWhite h={48}></Div>
        <Col auto mr10 relative>
          <Img
            rounded100
            border4
            borderWhite
            bgGray200
            h70
            w70
            uri={getNftProfileImage(nft || nftCore, 200, 200)}></Img>
        </Col>
        <Col justifyEnd>
          {!isCurrentNft ? (
            <Div>
              <Row py6 itemsCenter>
                <Col />
                <Col
                  auto
                  px12
                  onPress={() =>
                    gotoChatRoom(
                      getNftName(nftCore),
                      getNftProfileImage(nftCore),
                      nftCore.contract_address,
                      nftCore.token_id,
                    )
                  }>
                  <Send
                    strokeWidth={2}
                    color={Colors.black}
                    height={22}
                    width={22}
                  />
                </Col>
                <Col
                  auto
                  bgBlack={!isFollowing}
                  p8
                  rounded100
                  border1={isFollowing}
                  borderGray200
                  onPress={handlePressFollowing}>
                  <Span white={!isFollowing} bold px5 fontSize={14}>
                    {!nft ? '불러오는 중' : isFollowing ? '팔로잉' : '팔로우'}
                  </Span>
                </Col>
              </Row>
            </Div>
          ) : (
            <Div>
              <Row py12>
                <Col />
                {qrScan && (
                  <Col auto onPress={gotoScan} px8>
                    <Maximize
                      strokeWidth={2}
                      color={Colors.black}
                      height={22}
                      width={22}
                    />
                  </Col>
                )}
                {isCurrentNft && qrScan && (
                  <Col auto onPress={gotoQr} px8>
                    <Grid
                      strokeWidth={2}
                      color={Colors.black}
                      height={22}
                      width={22}
                    />
                  </Col>
                )}
                <Col auto onPress={gotoNftProfileEdit} px8>
                  <Settings
                    strokeWidth={2}
                    color={Colors.black}
                    height={22}
                    width={22}
                  />
                </Col>
              </Row>
            </Div>
          )}
        </Col>
      </Row>
      <Div px15 py10 bgWhite borderBottom={0.5} borderGray200>
        <Row itemsCenter {...(isCurrentNft && {onPress: openNftList})}>
          <Col auto>
            <Span fontSize={20} bold numberOfLines={1}>
              {getNftName(nft || nftCore)}
            </Span>
          </Col>
          {isCurrentNft && (
            <Col auto>
              <ChevronDown
                strokeWidth={2}
                color={Colors.black}
                height={22}
                width={22}
              />
            </Col>
          )}
        </Row>
        {nft && (
          <Div pt3 onPress={gotoNftCollectionProfile}>
            <Span gray700 bold>
              {nftCore.nft_metadatum.name}
            </Span>
          </Div>
        )}
        {nftCore.story ? (
          <Div mt8 bgWhite>
            <TruncatedMarkdown text={(nft || nftCore).story} maxLength={500} />
          </Div>
        ) : null}
        {nft && (
          <Row mt12>
            <Col auto mr12 onPress={() => gotoFollowList(FollowType.Followers)}>
              <Span bold fontSize={13}>
                <Span gray700 regular fontSize={13}>
                  팔로워
                </Span>{' '}
                {followerCount}
              </Span>
            </Col>
            <Col
              auto
              mr12
              onPress={() => gotoFollowList(FollowType.Followings)}>
              <Span bold fontSize={13}>
                <Span gray700 regular fontSize={13}>
                  팔로잉
                </Span>{' '}
                {nft.following_count}
              </Span>
            </Col>
            <Col auto mr12 onPress={handlePressContribution}>
              <Span bold fontSize={13}>
                {nft.contribution}{' '}
                <Span gray700 regular fontSize={13}>
                  인분 기여
                </Span>
              </Span>
            </Col>
            <Col />
          </Row>
        )}
      </Div>
    </>
  );
}
