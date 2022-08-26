import React, {useState} from 'react';
import {
  ChevronDown,
  Edit2,
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
  useGotoNftSetting,
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
import {expandImageViewer} from 'src/utils/imageViewerUtils';
import TruncatedText from './TruncatedText';
import useDiscordId from 'src/hooks/useDiscordId';
import useTwitterId from 'src/hooks/useTwitterId';
import {ICONS} from 'src/modules/icons';

export default function NftProfileHeader({nftCore, nft, isCurrentNft, qrScan}) {
  const gotoNftCollectionProfile = useGotoNftCollectionProfile({
    nftCollection: nft?.nft_collection,
  });
  const {
    isFollowing,
    followerCount,
    handlePressFollowing,
    isBlocked,
    handlePressBlock,
  } = useFollow(
    nft?.is_following,
    nft?.follower_count,
    nft?.contract_address,
    nft?.token_id,
  );
  const {
    discordId,
    discordProfileLink,
    discordIdHasChanged,
    discordIdError,
    isDiscordIdEditting,
    isDiscordIdSavable,
    handlePressDiscordLink,
    toggleDiscordIdEdit,
    handleChangeDiscordId,
  } = useDiscordId(nft);
  const {
    twitterId,
    twitterProfileLink,
    twitterIdHasChanged,
    twitterIdError,
    isTwitterIdEditting,
    isTwitterIdSavable,
    toggleTwitterIdEdit,
    handlePressTwitterLink,
    handleChangeTwitterId,
  } = useTwitterId(nft);
  const gotoFollowList = useGotoFollowList({
    followOwnerType: FollowOwnerType.Nft,
    contractAddress: nftCore.contract_address,
    tokenId: nftCore.token_id,
  });
  const gotoQr = useGotoQR();
  const gotoScan = useGotoScan({scanType: ScanType.Nft});
  const gotoChatRoom = useGotoChatRoomFromProfile();
  const gotoNftProfileEdit = useGotoNftProfileEdit();
  const [enlargeStory, setEnlargeStory] = useState(false);

  return (
    <>
      <Row zIndex={100} px15 relative>
        <Div absolute bottom0 w={DEVICE_WIDTH} bgWhite h={48}></Div>
        <Col
          auto
          mr10
          relative
          onPress={() =>
            expandImageViewer([{uri: getNftProfileImage(nft)}], 0)
          }>
          <Img
            rounded100
            border4
            borderWhite
            bgGray200
            h78
            w78
            uri={getNftProfileImage(nft, 200, 200)}></Img>
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
                {isBlocked ? (
                  <Col
                    auto
                    bgWhite
                    p8
                    rounded100
                    border1
                    borderDanger
                    onPress={handlePressBlock}>
                    <Span danger bold px5>
                      차단 해제
                    </Span>
                  </Col>
                ) : (
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
                )}
              </Row>
            </Div>
          ) : (
            <Div>
              <Row py10 itemsCenter>
                <Col />
                {qrScan && (
                  <Col auto onPress={gotoScan} px8>
                    <Maximize
                      strokeWidth={2}
                      color={Colors.black}
                      height={20}
                      width={20}
                    />
                  </Col>
                )}
                {isCurrentNft && qrScan && (
                  <Col auto onPress={gotoQr} px8 mr4>
                    <Grid
                      strokeWidth={2}
                      color={Colors.black}
                      height={20}
                      width={20}
                    />
                  </Col>
                )}
                <Col
                  auto
                  p6
                  rounded100
                  border={0.5}
                  borderGray200
                  onPress={gotoNftProfileEdit}>
                  <Span bold px5 fontSize={13}>
                    프로필 편집
                  </Span>
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
        <Row itemsCenter mt4={nft?.discord_id && nft?.twitter_id}>
          {nft?.discord_id && (
            <>
              <Col auto mr5>
                <Img h={232 / 16} w={300 / 16} source={ICONS.discord} />
              </Col>
              <Col auto onPress={handlePressDiscordLink} mr12>
                <Span gray700 bold>
                  {nft.discord_id}
                </Span>
              </Col>
            </>
          )}
          {nft?.twitter_id && (
            <>
              <Col auto mr4>
                <Img h={20} w={20} source={ICONS.twitter} />
              </Col>
              <Col auto onPress={handleChangeTwitterId}>
                <Span gray700 bold>
                  @{nft.twitter_id}
                </Span>
              </Col>
            </>
          )}
        </Row>

        {(nft || nftCore).story ? (
          <Div mt8 bgWhite>
            {!enlargeStory ? (
              <TruncatedText
                text={(nft || nftCore).story}
                maxLength={100}
                onPressTruncated={() => setEnlargeStory(true)}
              />
            ) : (
              <Span>{(nft || nftCore).story}</Span>
            )}
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
