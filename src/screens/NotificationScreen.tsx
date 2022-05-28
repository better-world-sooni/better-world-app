import React, {useEffect, useState} from 'react';
import {Div} from 'src/components/common/Div';
import Post from 'src/components/common/Post';
import apis from 'src/modules/apis';
import {HAS_NOTCH} from 'src/modules/constants';
import {KeyboardAvoidingView} from 'src/modules/viewComponents';
import {Row} from 'src/components/common/Row';
import {useNavigation} from '@react-navigation/native';
import {Col} from 'src/components/common/Col';
import {ChevronLeft} from 'react-native-feather';
import {Span} from 'src/components/common/Span';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {BlurView} from '@react-native-community/blur';
import {useApiSelector, useReloadGETWithToken} from 'src/redux/asyncReducer';
import {RefreshControl} from 'react-native';
import {Img} from 'src/components/common/Img';
import {ICONS} from 'src/modules/icons';
import {
  getNftName,
  getNftProfileImage,
  useIsCurrentNft,
} from 'src/modules/nftUtils';
import {createdAtText} from 'src/modules/timeUtils';
import useFollow from 'src/hooks/useFollow';
import {IMAGES} from 'src/modules/images';
import {
  useGotoNftCollectionProfile,
  useGotoNftProfile,
  useGotoPost,
} from 'src/hooks/useGoto';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';

export default function NotificationScreen() {
  const {data: notificationRes, isLoading: notificationLoad} = useApiSelector(
    apis.notification.list._,
  );
  const reloadGetWithToken = useReloadGETWithToken();
  const onRefresh = () => {
    if (notificationLoad) return;
    reloadGetWithToken(apis.notification.list._());
  };
  const {goBack} = useNavigation();
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
    <KeyboardAvoidingView behavior="padding" flex={1} bgWhite relative>
      <Animated.FlatList
        automaticallyAdjustContentInsets
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
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
              <Row itemsCenter py5 h40 px15>
                <Col itemsStart></Col>
                <Col auto onPress={goBack}>
                  <Span bold fontSize={19}>
                    알림
                  </Span>
                </Col>
                <Col itemsEnd></Col>
              </Row>
            </Div>
          </Div>
        }
        refreshControl={
          <RefreshControl refreshing={notificationLoad} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Div>
            <Row py15>
              <Col></Col>
              <Col auto>
                <Span>아직 알림이 없습니다.</Span>
              </Col>
              <Col></Col>
            </Row>
          </Div>
        }
        keyExtractor={item => (item as any).id}
        renderItem={({item, index}) => (
          <Notification key={(item as any).id} notification={item} />
        )}
        data={notificationRes?.notifications || []}
        onScroll={scrollHandler}></Animated.FlatList>
    </KeyboardAvoidingView>
  );
}

enum NotificationEventType {
  Follow = 'follow',
  Comment = 'comment',
  LikePost = 'like_post',
  LikeComment = 'like_comment',
  Hug = 'hug',
}

const Notification = ({notification}) => {
  const {currentNft} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const isCurrentNft = useIsCurrentNft(notification.nft);
  return (
    <NotificationMemo
      postId={notification.metadata.target_id?.post_id}
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
};

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
  const [following, _followerCount, handlePressFollowing] = useFollow(
    isFollowing,
    0,
    apis.follow.contractAddressAndTokenId(contractAddress, tokenId).url,
  );
  const handlePressNotification = () => {
    if (event == NotificationEventType.Comment) {
      gotoPost();
      return;
    }
    if (event == NotificationEventType.LikePost) {
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
    <Row itemsCenter py10 px15 onPress={handlePressNotification}>
      <Col auto onPress={handlePressProfile}>
        <Img
          rounded100
          h50
          w50
          {...(hasNft
            ? {uri: profileImgUri}
            : {source: IMAGES.betterWorldBlueLogo})}></Img>
      </Col>
      <Col px15>
        <Span>
          {getNotificationContent()}{' '}
          <Span gray700>{createdAtText(createdAt)}</Span>
        </Span>
      </Col>
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
};

const NotificationMemo = React.memo(NotificationContent);