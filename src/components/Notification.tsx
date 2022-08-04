import React, {memo} from 'react';
import {shallowEqual, useSelector} from 'react-redux';
import useFollow from 'src/hooks/useFollow';
import {
  useGotoNftCollectionProfile,
  useGotoNftProfile,
  useGotoPost,
} from 'src/hooks/useGoto';
import apis from 'src/modules/apis';
import {IMAGES} from 'src/modules/images';
import {
  getNftName,
  getNftProfileImage,
  useIsCurrentNft,
} from 'src/utils/nftUtils';
import {createdAtText} from 'src/utils/timeUtils';
import {RootState} from 'src/redux/rootReducer';
import {Col} from './common/Col';
import {Img} from './common/Img';
import {Row} from './common/Row';
import {Span} from './common/Span';

enum NotificationEventType {
  Follow = 'follow',
  Comment = 'comment',
  VotePost = 'vote_post',
  LikePost = 'like_post',
  LikeComment = 'like_comment',
  Hug = 'hug',
}

export default function Notification({notification}) {
  const {currentNft} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const isCurrentNft = useIsCurrentNft(notification.nft);
  return (
    <NotificationMemo
      postId={notification.metadata.post_id}
      isFollowing={notification.is_following}
      hasNft={!!notification.nft}
      profileImgUri={getNftProfileImage(notification.nft, 100, 100)}
      contractAddress={notification.nft.contract_address}
      tokenId={notification.nft.token_id}
      event={notification.metadata?.event}
      createdAt={notification.created_at}
      isCurrentNft={isCurrentNft}
      currentNftName={getNftName(currentNft)}
      nftName={getNftName(notification.nft)}
      nftMetadatumName={notification.nft.nft_metadatum.name}
    />
  );
}

const NotificationContent = ({
  postId,
  isFollowing,
  hasNft,
  profileImgUri,
  contractAddress,
  tokenId,
  event,
  createdAt,
  isCurrentNft,
  currentNftName,
  nftName,
  nftMetadatumName,
}) => {
  const gotoPost = useGotoPost({
    postId,
  });
  const gotoNftCollectionProfile = useGotoNftCollectionProfile({
    nftCollection: {
      contract_address: contractAddress,
      token_id: tokenId,
      name: nftName,
      image_uri: profileImgUri,
      nft_metadatum: {
        name: nftMetadatumName,
        image_uri: profileImgUri,
      },
    },
  });
  const gotoNftProfile = useGotoNftProfile({
    nft: {
      contract_address: contractAddress,
      token_id: tokenId,
      name: nftName,
      image_uri: profileImgUri,
      nft_metadatum: {
        name: nftMetadatumName,
      },
    },
  });
  const handlePressProfile = () => {
    if (!hasNft) return;
    if (!tokenId) {
      gotoNftCollectionProfile();
      return;
    }
    if (contractAddress) {
      gotoNftProfile();
      return;
    }
  };
  const {
    handlePressFollowing,
    isFollowing: following,
    isBlocked,
    handlePressBlock,
  } = useFollow(isFollowing, 0, contractAddress, tokenId);
  const handlePressNotification = () => {
    if (event == NotificationEventType.Comment) {
      gotoPost();
      return;
    }
    if (event == NotificationEventType.LikePost) {
      gotoPost();
      return;
    }
    if (event == NotificationEventType.VotePost) {
      gotoPost();
      return;
    }
    if (event == NotificationEventType.LikeComment) {
      gotoPost();
      return;
    }
    if (event == NotificationEventType.Follow) {
      gotoNftProfile();
      return;
    }
    if (event == NotificationEventType.Hug) {
      gotoNftProfile();
      return;
    }
  };
  const getNotificationContent = () => {
    const name = nftName;
    if (event == NotificationEventType.Comment) {
      return (
        <Span fontSize={14}>
          <Span bold fontSize={14}>
            {name}
          </Span>
          님이{' '}
          <Span bold fontSize={14}>
            {currentNftName}
          </Span>
          의 게시물에 댓글을 남겼습니다
        </Span>
      );
    }
    if (event == NotificationEventType.LikePost) {
      return (
        <Span fontSize={14}>
          <Span bold fontSize={14}>
            {name}
          </Span>
          님이{' '}
          <Span bold fontSize={14}>
            {currentNftName}
          </Span>
          의 게시물을 좋아요 했습니다.
        </Span>
      );
    }
    if (event == NotificationEventType.VotePost) {
      return (
        <Span fontSize={14}>
          <Span bold fontSize={14}>
            {name}
          </Span>
          님이{' '}
          <Span bold fontSize={14}>
            {currentNftName}
          </Span>
          의 제안에 동의 했습니다.
        </Span>
      );
    }
    if (event == NotificationEventType.LikeComment) {
      return (
        <Span fontSize={14}>
          <Span bold fontSize={14}>
            {name}
          </Span>
          님이{' '}
          <Span bold fontSize={14}>
            {currentNftName}
          </Span>
          의 댓글을 좋아요 했습니다.
        </Span>
      );
    }
    if (event == NotificationEventType.Follow) {
      return (
        <Span fontSize={14}>
          <Span bold fontSize={14}>
            {name}
          </Span>
          님이{' '}
          <Span bold fontSize={14}>
            {currentNftName}
          </Span>
          을 팔로우 하기 시작했습니다.
        </Span>
      );
    }
    if (event == NotificationEventType.Hug) {
      return (
        <Span fontSize={14}>
          <Span bold fontSize={14}>
            {name}
          </Span>
          님이{' '}
          <Span bold fontSize={14}>
            {currentNftName}
          </Span>
          을 허그 했습니다.
        </Span>
      );
    }
  };

  return (
    <Row itemsCenter py8 px15 onPress={handlePressNotification}>
      <Col auto onPress={handlePressProfile}>
        <Img
          rounded100
          h50
          w50
          {...(hasNft
            ? {uri: profileImgUri}
            : {source: IMAGES.betterWorldPlanet})}></Img>
      </Col>
      <Col px15>
        <Span>
          {getNotificationContent()}{' '}
          <Span gray700>{createdAtText(createdAt)}</Span>
        </Span>
      </Col>
      {!isCurrentNft &&
        (isBlocked ? (
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
            bgBlack={!following}
            p8
            rounded100
            border1={following}
            borderGray200={following}
            onPress={handlePressFollowing}>
            <Span white={!following} bold px5>
              {following ? '팔로잉' : '팔로우'}
            </Span>
          </Col>
        ))}
    </Row>
  );
};

const NotificationMemo = memo(NotificationContent);
