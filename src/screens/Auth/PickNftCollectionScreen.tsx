import React from 'react';
import {Div} from 'src/components/common/Div';
import {Span} from 'src/components/common/Span';
import {FlatList} from 'src/components/common/ViewComponents';
import {useApiSelector, usePaginateGETWithToken} from 'src/redux/asyncReducer';
import apis from 'src/modules/apis';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';
import {
  getNftCollectionProfileImage,
  getNftName,
  getNftProfileImage,
} from 'src/utils/nftUtils';
import {ActivityIndicator, RefreshControl} from 'react-native';
import {Img} from 'src/components/common/Img';
import {Colors, DEVICE_WIDTH} from 'src/modules/styles';
import {Col} from 'src/components/common/Col';
import {Row} from 'src/components/common/Row';
import GradientText from 'src/components/common/GradientText';
import GradientBorderImg from 'src/components/common/GradientBorderImg';
import GradientColorRect from 'src/components/common/GradientColorRect';
import useFollow from 'src/hooks/useFollow';
import {Minus, Plus} from 'react-native-feather';
import GradientColorButton from 'src/components/common/GradientColorButton';
import {useGotoHome} from 'src/hooks/useGoto';

const PickNftCollectionScreen = () => {
  const {currentNft} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const gotoHome = useGotoHome();
  const {data, isLoading, isPaginating, page, isNotPaginatable} =
    useApiSelector(apis.nft_collection.list);
  const paginateGETWithToken = usePaginateGETWithToken();
  const handleEndReached = () => {
    if (isPaginating || isNotPaginatable) return;
    paginateGETWithToken(
      apis.nft_collection.list(null, page + 1),
      'nft_collections',
    );
  };
  const notchHeight = useSafeAreaInsets().top;
  const notchBottom = useSafeAreaInsets().bottom;
  const headerHeight = notchHeight;
  const numColumns = 3;
  const px = 25;
  const profilePx = 8;
  const profilePy = 17;
  const width = (DEVICE_WIDTH - 2 * px - numColumns * profilePx * 2) / 3;
  const height = width;
  return (
    <Div bgWhite flex={1}>
      <Div h={headerHeight}></Div>
      <Row mx30 py30>
        <Col>
          <Row itemsEnd mb4>
            <Col auto>
              <Span bold fontSize={18}>
                Hello{' '}
              </Span>
            </Col>
            <Col p3>
              <GradientText
                text={getNftName(currentNft)}
                fontSize={30}
                width={200}
                height={30}
              />
            </Col>
          </Row>
          <Span bold fontSize={28}>
            👋
          </Span>
        </Col>
        <Col auto>
          <GradientBorderImg
            uri={getNftProfileImage(currentNft, 300, 300)}
            radius={33}
            borderWidth={4}
          />
        </Col>
      </Row>
      <Row py8 relative>
        <Div absolute top16>
          <GradientColorRect width={DEVICE_WIDTH} height={4} />
        </Div>
        <Col></Col>
        <Col auto bgWhite px12>
          <Span bold fontSize={16}>
            관심있는 NFT 프로젝트를 팔로우 하세요
          </Span>
        </Col>
        <Col></Col>
      </Row>
      <FlatList
        px={px}
        bgWhite
        flex={1}
        onEndReached={handleEndReached}
        numColumns={numColumns}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleEndReached} />
        }
        data={data?.nft_collections || []}
        ListFooterComponent={
          <>
            {isPaginating && (
              <Div itemsCenter py15>
                <ActivityIndicator />
              </Div>
            )}
            {isNotPaginatable && (
              <Div itemsCenter py15>
                <Span textCenter bold>
                  피드를 모두 확인했습니다.
                </Span>
              </Div>
            )}
            <Div h={50}></Div>
            <Div h={27} />
          </>
        }
        renderItem={({item, index}) => {
          return (
            <PressableNftCollection
              nftCollection={item}
              width={width}
              height={height}
              px={profilePx}
              py={profilePy}
            />
          );
        }}></FlatList>
      <Div absolute bottom0 itemsCenter>
        <Div px15>
          <GradientColorButton
            width={DEVICE_WIDTH - 30}
            borderRadius={10}
            height={60}
            text={'다음'}
            fontSize={16}
            onPress={gotoHome}
          />
        </Div>
        <Div h={notchBottom}></Div>
      </Div>
    </Div>
  );
};

function PressableNftCollection({nftCollection, px, py, width, height}) {
  const {
    isFollowing,
    followerCount,
    handlePressFollowing,
    isBlocked,
    handlePressBlock,
  } = useFollow(nftCollection.is_following, 0, nftCollection.contract_address);
  return (
    <Div px={px} py={py} relative onPress={handlePressFollowing}>
      <Img
        bgGray200
        uri={getNftCollectionProfileImage(nftCollection, 150, 150)}
        w={width}
        h={height}
        rounded1000></Img>
      <Div
        absolute
        top={(py * 2) / 3}
        right={px}
        rounded20
        itemsCenter
        justifyCenter
        w28
        h28
        bgPrimary={!isFollowing}
        bgGray400={isFollowing}>
        {isFollowing ? (
          <Minus
            color={Colors.gray[600]}
            height={18}
            width={18}
            strokeWidth={3}
          />
        ) : (
          <Plus color={Colors.white} height={18} width={18} strokeWidth={3} />
        )}
      </Div>
    </Div>
  );
}

export default PickNftCollectionScreen;
