import {
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  MoreHorizontal,
  Repeat,
} from 'react-native-feather';
import React, {useRef, useState} from 'react';
import {Col} from './Col';
import {Div} from './Div';
import {Img} from './Img';
import {Row} from './Row';
import {Span} from './Span';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {HAS_NOTCH, kmoment} from 'src/modules/constants';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {CustomBlurView} from 'src/components/common/CustomBlurView';
import {useNavigation} from '@react-navigation/native';
import {ActivityIndicator, RefreshControl} from 'react-native';
import {
  getNftCollectionProfileImage,
  getNftName,
  getNftProfileImage,
} from 'src/modules/nftUtils';
import {
  useApiSelector,
  usePaginateGETWithToken,
  useReloadGETWithToken,
} from 'src/redux/asyncReducer';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {ICONS} from 'src/modules/icons';
import {MenuView} from '@react-native-menu/menu';
import Colors from 'src/constants/Colors';
import {createdAtText} from 'src/modules/timeUtils';
import {truncateAddress} from 'src/modules/blockchainUtils';
import {resizeImageUri} from 'src/modules/uriUtils';
import Transaction from './Transaction';

export default function CommunityWalletProfile({
  communityWalletCore,
  isAdmin,
  communityWalletApiObject,
  pageableTransactionListFn,
}) {
  const [aboutOpen, setAboutOpen] = useState(false);
  const bottomPopupRef = useRef<BottomSheetModal>(null);
  const editProfile = () => {
    bottomPopupRef?.current?.expand();
  };
  const {data: communityWalletRes, isLoading: communityWalletLoading} =
    useApiSelector(communityWalletApiObject);
  const {
    data: transactionListRes,
    isLoading: transactionListLoading,
    isPaginating: transactionListPaginating,
  } = useApiSelector(pageableTransactionListFn());
  const reloadGetWithToken = useReloadGETWithToken();
  const handleRefresh = () => {
    reloadGetWithToken(communityWalletApiObject);
    reloadGetWithToken(pageableTransactionListFn());
  };
  const paginateGetWithToken = usePaginateGETWithToken();
  const handleEndReached = () => {
    if (transactionListPaginating || !transactionListRes?.cursor) return;
    paginateGetWithToken(
      pageableTransactionListFn(transactionListRes.cursor),
      'transactions',
    );
  };
  const communityWallet = communityWalletRes?.community_wallet;
  const {goBack} = useNavigation();
  const translationY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => {
    translationY.value = event.contentOffset.y;
  });
  const notchHeight = useSafeAreaInsets().top;
  const headerHeight = notchHeight + 50;
  const headerStyles = useAnimatedStyle(() => {
    return {
      width: DEVICE_WIDTH,
      height: headerHeight,
      opacity: Math.min(translationY.value / 50, 1),
    };
  });
  return (
    <Div flex={1} bgWhite>
      <Div h={headerHeight} zIndex={100} absolute top0>
        <Animated.View style={headerStyles}>
          <CustomBlurView
            blurType="xlight"
            blurAmount={30}
            blurRadius={20}
            overlayColor=""
            style={{
              width: DEVICE_WIDTH,
              height: '100%',
              position: 'absolute',
            }}
            reducedTransparencyFallbackColor="white"></CustomBlurView>
        </Animated.View>
        <Div zIndex={100} absolute w={DEVICE_WIDTH} top={notchHeight + 5}>
          <Row itemsCenter py5 h40 px8>
            <Col itemsStart onPress={goBack}>
              <ChevronLeft
                width={30}
                height={30}
                color="black"
                strokeWidth={2}
              />
            </Col>
            <Col auto mr8>
              <Span bold fontSize={19}>
                지갑상세조회
              </Span>
            </Col>
            <Col></Col>
          </Row>
        </Div>
      </Div>
      <Animated.FlatList
        automaticallyAdjustContentInsets
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        keyExtractor={item => (item as any).transaction_hash}
        initialNumToRender={10}
        removeClippedSubviews
        updateCellsBatchingPeriod={100}
        windowSize={11}
        contentContainerStyle={{
          marginTop: headerHeight,
          marginBottom: headerHeight,
        }}
        refreshControl={
          <RefreshControl
            refreshing={transactionListLoading}
            onRefresh={handleRefresh}
            progressViewOffset={headerHeight}
          />
        }
        onEndReached={handleEndReached}
        data={transactionListRes?.transactions || []}
        renderItem={({item}) => <Transaction transaction={item} />}
        ListHeaderComponent={
          <Div py8 px15 itemsCenter justifyCenter bgGray200>
            <Row itemsCenter py5 h40>
              <Col auto mr8>
                {communityWallet && (
                  <Img
                    w36
                    h36
                    rounded100
                    uri={resizeImageUri(communityWallet.image_uri, 100, 100)}
                  />
                )}
              </Col>
              <Col itemsStart pr7>
                <Span bold fontSize={14}>
                  {(communityWallet || communityWalletCore).name}
                </Span>
                <Span fontSize={14} gray700>
                  at{' '}
                  {truncateAddress(
                    (communityWallet || communityWalletCore).address,
                  )}
                </Span>
              </Col>
              <Col auto>
                <MenuView onPressAction={null} actions={[]}>
                  <MoreHorizontal
                    color={Colors.gray[400]}
                    width={20}
                    height={20}
                  />
                </MenuView>
              </Col>
            </Row>
            <Row itemsCenter>
              <Col></Col>
              <Col auto>
                <Row itemsCenter>
                  <Col />
                  <Col auto mr2>
                    <Span gray700>by </Span>
                  </Col>
                  <Col auto mr4>
                    {communityWallet && (
                      <Img
                        w20
                        h20
                        rounded100
                        uri={getNftCollectionProfileImage(
                          communityWallet.nft_collection,
                          100,
                          100,
                        )}
                      />
                    )}
                  </Col>
                  <Col auto mr2>
                    <Span bold>
                      {
                        (communityWallet || communityWalletCore).nft_collection
                          ?.name
                      }
                    </Span>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row itemsCenter>
              <Col />
              <Col auto mr2>
                <Span fontSize={28} bold>
                  {(communityWallet || communityWalletCore).balance}
                </Span>
              </Col>
              <Col auto ml2>
                <Img h24 w24 source={ICONS.klayIcon}></Img>
              </Col>
            </Row>
            <Row>
              <Col />
              <Col auto onPress={() => setAboutOpen(prev => !prev)}>
                {aboutOpen ? (
                  <ChevronUp color={Colors.gray[400]} width={20} height={20} />
                ) : (
                  <ChevronDown
                    color={Colors.gray[400]}
                    width={20}
                    height={20}
                  />
                )}
              </Col>
            </Row>
          </Div>
        }
        ListFooterComponent={
          <>
            {transactionListPaginating && (
              <Div itemsCenter py15>
                <ActivityIndicator />
              </Div>
            )}
            <Div h={headerHeight}></Div>
            <Div h={HAS_NOTCH ? 27 : 12} />
          </>
        }></Animated.FlatList>
    </Div>
  );
}
