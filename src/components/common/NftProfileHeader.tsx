import React from 'react';
import {
  Edit3,
  Grid,
  Maximize,
  MessageCircle,
  Settings,
} from 'react-native-feather';
import useFollow from 'src/hooks/useFollow';
import {
  useGotoCapsule,
  useGotoFollowList,
  useGotoChatRoomFromProfile,
  useGotoNewPost,
  useGotoNftCollectionProfile,
  useGotoQR,
  useGotoRankDeltum,
  useGotoRankSeason,
  useGotoScan,
} from 'src/hooks/useGoto';
import apis from 'src/modules/apis';
import {getNftName, getNftProfileImage} from 'src/modules/nftUtils';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {FollowOwnerType, FollowType} from 'src/screens/FollowListScreen';
import {PostOwnerType} from 'src/screens/NewPostScreen';
import {ScanType} from 'src/screens/ScanScreen';
import {Col} from './Col';
import {Div} from './Div';
import {Img} from './Img';
import {Row} from './Row';
import {Span} from './Span';
import TruncatedMarkdown from './TruncatedMarkdown';

export default function NftProfileHeader({
  nftCore,
  nft,
  bottomPopupRef,
  isCurrentNft,
  qrScan,
}) {
  const gotoNftCollectionProfile = useGotoNftCollectionProfile({
    nftCollection: nft?.nft_collection,
  });
  const editProfile = () => {
    bottomPopupRef?.current?.expand();
  };
  const [isFollowing, followerCount, handlePressFollowing] = useFollow(
    nft?.is_following,
    nft?.follower_count,
    apis.follow.contractAddressAndTokenId(nft?.contract_address, nft?.token_id)
      .url,
  );
  const gotoRankDeltum = useGotoRankDeltum({
    contractAddress: nftCore.contract_address,
    tokenId: nftCore.token_id,
  });
  const gotoFollowList = useGotoFollowList({
    followOwnerType: FollowOwnerType.Nft,
    contractAddress: nftCore.contract_address,
    tokenId: nftCore.token_id,
  });
  const gotoQr = useGotoQR();
  const gotoScan = useGotoScan({scanType: ScanType.Nft});
  const gotoNewPost = useGotoNewPost({postOwnerType: PostOwnerType.Nft});
  const gotoChatRoom = useGotoChatRoomFromProfile();
  const gotoRankSeason = useGotoRankSeason({
    cwyear: null,
    cweek: null,
  });

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
            h75
            w75
            uri={getNftProfileImage(nft || nftCore, 200, 200)}></Img>
          {isCurrentNft && qrScan && (
            <Div
              absolute
              bottom0
              right0
              bgRealBlack
              rounded100
              p8
              onPress={gotoQr}>
              <Grid strokeWidth={2} color={'white'} height={15} width={15} />
            </Div>
          )}
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
                  mx8
                  onPress={() =>
                    gotoChatRoom(
                      getNftName(nftCore),
                      [getNftProfileImage(nftCore)],
                      nftCore.contract_address,
                      nftCore.token_id,
                    )
                  }>
                  <MessageCircle
                    strokeWidth={2}
                    color={'white'}
                    height={15}
                    width={15}
                  />
                </Col>
                <Col
                  auto
                  bgRealBlack={!isFollowing}
                  p8
                  rounded100
                  border1={isFollowing}
                  borderGray400={isFollowing}
                  onPress={handlePressFollowing}>
                  <Span white={!isFollowing} bold mt2 px5 fontSize={12}>
                    {!nft ? '불러오는 중' : isFollowing ? '언팔로우' : '팔로우'}
                  </Span>
                </Col>
              </Row>
            </Div>
          ) : (
            <Div>
              <Row py10>
                <Col />
                {qrScan && (
                  <Col auto bgRealBlack p8 rounded100 onPress={gotoScan}>
                    <Div>
                      <Maximize
                        strokeWidth={2}
                        color={'white'}
                        height={15}
                        width={15}
                      />
                    </Div>
                  </Col>
                )}
                <Col auto bgRealBlack p8 rounded100 onPress={editProfile} mx8>
                  <Div>
                    <Settings
                      strokeWidth={2}
                      color={'white'}
                      height={15}
                      width={15}
                    />
                  </Div>
                </Col>
                <Col
                  auto
                  bgRealBlack
                  p8
                  rounded100
                  onPress={() => gotoNewPost()}>
                  <Span white bold fontSize={12} px5>
                    게시물 작성
                  </Span>
                </Col>
              </Row>
            </Div>
          )}
        </Col>
      </Row>
      <Div px15 py10 bgWhite borderBottom={0.5} borderGray200>
        <Div>
          <Span fontSize={20} bold>
            {getNftName(nft || nftCore)}
          </Span>
        </Div>
        {nft && (
          <Div pt3 onPress={gotoNftCollectionProfile}>
            <Span gray700>{nftCore.nft_metadatum.name}</Span>
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
            <Col auto mr12 onPress={gotoRankSeason}>
              <Span bold fontSize={13}>
                <Span gray700 regular fontSize={13}>
                  랭크
                </Span>{' '}
                {nft.current_rank}
              </Span>
            </Col>
            <Col auto mr12 onPress={gotoRankDeltum}>
              <Span bold fontSize={13}>
                <Span gray700 regular fontSize={13}>
                  랭크 스코어
                </Span>{' '}
                {nft.current_rank_score}
              </Span>
            </Col>
            <Col />
          </Row>
        )}
      </Div>
    </>
  );
}
