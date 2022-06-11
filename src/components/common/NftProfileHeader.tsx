import React from 'react';
import {Edit3, Grid, Maximize, MessageCircle} from 'react-native-feather';
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
import {ICONS} from 'src/modules/icons';
import {getNftName, getNftProfileImage} from 'src/modules/nftUtils';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {ChatRoomEnterType} from 'src/screens/ChatRoomScreen';
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
  const goToCapsule = useGotoCapsule({nft});
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
        <Div absolute bottom0 w={DEVICE_WIDTH} bgWhite h={55}></Div>
        <Col auto mr10 relative>
          <Img
            rounded100
            border3
            borderWhite
            bgGray200
            h85
            w85
            uri={getNftProfileImage(nftCore, 200, 200)}></Img>
          {isCurrentNft && (
            <Div
              absolute
              bottom0
              right0
              bgRealBlack
              rounded100
              p8
              onPress={gotoQr}>
              <Grid strokeWidth={2} color={'white'} height={16} width={16} />
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
                  bgPrimary 
                  p8 
                  rounded100 
                  mx8 
                  onPress={() => gotoChatRoom(
                    getNftName(nftCore), 
                    [getNftProfileImage(nftCore)], 
                    nftCore.contract_address, 
                    nftCore.token_id
                  )}>
                  <Div>
                    <MessageCircle
                      strokeWidth={2}
                      color={'white'}
                      height={18}
                      width={18}
                    />
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
                  <Span white={!isFollowing} bold mt2 px5>
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
                        height={16}
                        width={16}
                      />
                    </Div>
                  </Col>
                )}
                <Col auto bgRealBlack p8 rounded100 onPress={editProfile} mx8>
                  <Div>
                    <Edit3
                      strokeWidth={2}
                      color={'white'}
                      height={16}
                      width={16}
                    />
                  </Div>
                </Col>
                <Col
                  auto
                  bgRealBlack
                  p8
                  rounded100
                  onPress={() => gotoNewPost()}>
                  <Span white bold mt1 px5>
                    게시물 업로드
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
            {getNftName(nftCore)}
          </Span>
        </Div>
        {nft && (
          <Div pt3 onPress={gotoNftCollectionProfile}>
            <Span gray700>{nftCore.nft_metadatum.name}</Span>
          </Div>
        )}
        {nftCore.story ? (
          <Div mt8 bgWhite>
            <TruncatedMarkdown text={nftCore.story} maxLength={500} />
          </Div>
        ) : null}
        {nft && (
          <Row mt8>
            <Col auto mr20 onPress={() => gotoFollowList(FollowType.Followers)}>
              <Span bold>
                <Span gray700 regular>
                  팔로워
                </Span>{' '}
                {followerCount}
              </Span>
            </Col>
            <Col
              auto
              mr20
              onPress={() => gotoFollowList(FollowType.Followings)}>
              <Span bold>
                <Span gray700 regular>
                  팔로잉
                </Span>{' '}
                {nft.following_count}
              </Span>
            </Col>
            <Col auto mr20 onPress={gotoRankSeason}>
              <Span bold>
                <Span gray700 regular>
                  랭크
                </Span>{' '}
                {nft.current_rank}
              </Span>
            </Col>
            <Col auto mr20 onPress={gotoRankDeltum}>
              <Span bold>
                <Span gray700 regular>
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
