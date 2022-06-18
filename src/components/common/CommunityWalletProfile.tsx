import {
  ChevronDown,
  ChevronLeft,
  MoreHorizontal,
  MoreVertical,
  Repeat,
} from 'react-native-feather';
import React, {useRef} from 'react';
import {Col} from './Col';
import {Div} from './Div';
import {Img} from './Img';
import {Row} from './Row';
import {Span} from './Span';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {HAS_NOTCH, kmoment, truncateKlaytnAddress} from 'src/modules/constants';
import Animated, {
  Extrapolate,
  interpolate,
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
  truncateAddress,
} from 'src/modules/nftUtils';
import {
  useApiSelector,
  usePaginateGETWithToken,
  useReloadGETWithToken,
} from 'src/redux/asyncReducer';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {ICONS} from 'src/modules/icons';
import CommunityWallet from './CommunityWallet';
import {MenuView} from '@react-native-menu/menu';
import Colors from 'src/constants/Colors';
import {createdAtText} from 'src/modules/timeUtils';

export default function CommunityWalletProfile({
  communityWalletCore,
  isAdmin,
  communityWalletApiObject,
  pageableTransactionListFn,
}) {
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
    page,
    isNotPaginatable,
  } = useApiSelector(pageableTransactionListFn());
  const reloadGetWithToken = useReloadGETWithToken();
  const handleRefresh = () => {
    reloadGetWithToken(communityWalletApiObject);
    reloadGetWithToken(pageableTransactionListFn());
  };
  const paginateGetWithToken = usePaginateGETWithToken();
  const handleEndReached = () => {
    if (transactionListPaginating || isNotPaginatable) return;
    paginateGetWithToken(pageableTransactionListFn(page + 1), 'transactions');
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
        // keyExtractor={keyExtractor}
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
          <Div py8 px15 itemsCenter justifyCenter>
            <Row itemsCenter py5 h40>
              <Col auto mr8>
                {communityWallet && (
                  <Img
                    w36
                    h36
                    rounded100
                    uri={getNftCollectionProfileImage(
                      communityWallet.nft_collection,
                      100,
                      100,
                    )}
                  />
                )}
              </Col>
              <Col itemsStart pr7>
                <Span bold fontSize={14}>
                  {(communityWallet || communityWalletCore).name}
                </Span>
                <Span fontSize={14} gray700>
                  at{' '}
                  {truncateKlaytnAddress(
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
            <Row mt15 mb8 itemsCenter>
              <Col></Col>
              <Col auto rounded10 p8 border={0.5} borderGray200>
                <Row itemsCenter>
                  <Col />
                  <Col auto mr2>
                    <Span gray700>
                      registered at{' '}
                      {createdAtText(
                        (communityWallet || communityWalletCore).created_at,
                      )}
                    </Span>
                  </Col>
                </Row>
                <Row itemsCenter>
                  <Col />
                  <Col auto mr2>
                    <Span gray700>for </Span>
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
                  <Col auto>
                    <ChevronDown
                      color={Colors.gray[400]}
                      width={20}
                      height={20}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row mb15 itemsCenter>
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

function Transaction({transaction}) {
  const ownerIsFrom = !!transaction.from_owner?.nft_collection;
  const communityWallet = ownerIsFrom
    ? transaction.from_owner
    : transaction.to_owner;
  const opponentAddress = ownerIsFrom ? transaction.to : transaction.from;
  const opponentObject = ownerIsFrom
    ? transaction.to_owner
    : transaction.from_owner;
  return (
    <Div borderTop={0.5} borderGray200 py12 px15>
      <Row itemsCenter mb4>
        <Col>
          <Span gray700>
            {kmoment(transaction.created_at).format('YY.M.D a h:mm')}
            {' · '}
            Tx({truncateKlaytnAddress(transaction.transaction_hash)})
          </Span>
        </Col>
        <Col auto>
          <MenuView onPressAction={null} actions={[]}>
            <MoreHorizontal color={Colors.gray[400]} width={20} height={20} />
          </MenuView>
        </Col>
      </Row>
      <Row itemsCenter>
        <Col auto>
          <Div mt8>
            {opponentObject ? (
              <Div>
                <HolderNfts nftRanks={opponentObject.nft_ranks} />
                <AdminNames nftRanks={opponentObject.nft_ranks} />
                <Span bold fontSize={14}>
                  {truncateAddress(
                    ownerIsFrom ? transaction.to : transaction.from,
                  )}
                </Span>
              </Div>
            ) : (
              <Span bold fontSize={14}>
                {truncateAddress(
                  ownerIsFrom ? transaction.to : transaction.from,
                )}
              </Span>
            )}
          </Div>
        </Col>
        <Col />
        <Col auto py4>
          <Row>
            <Col />
            <Col auto>
              <Span danger={ownerIsFrom} info={!ownerIsFrom} fontSize={14}>
                {ownerIsFrom ? '출금' : '입금'}
              </Span>
            </Col>
          </Row>
          <Row mt2>
            <Col />
            <Col auto>
              <Span bold danger={ownerIsFrom} info={!ownerIsFrom} fontSize={18}>
                {transaction.value} Klay
              </Span>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row mt4>
        <Col />
        <Col auto>
          <Repeat
            color={Colors.gray[700]}
            width={18}
            height={18}
            strokeWidth={1.7}
          />
        </Col>
      </Row>
    </Div>
  );
}

function HolderNfts({nftRanks}) {
  const firstCircleDiff = 40;
  const diff = 20;
  const firstCircleDiameter = 60;
  const circleDiameter = 40;
  return (
    <Div
      w={(nftRanks.slice(0, 3).length - 1) * diff + circleDiameter}
      relative
      h={firstCircleDiameter}
      mr5>
      {nftRanks.slice(0, 3).map((nftRank, index) => {
        return (
          <Img
            key={index}
            uri={getNftProfileImage(nftRank.nft)}
            rounded100
            h={index == 0 ? firstCircleDiameter : circleDiameter}
            w={index == 0 ? firstCircleDiameter : circleDiameter}
            absolute
            bottom0
            left={index * diff + (index > 0 ? firstCircleDiff - diff : 0)}
            border={4}
            borderWhite></Img>
        );
      })}
    </Div>
  );
}

function AdminNames({nftRanks}) {
  if (nftRanks.length == 0) return null;
  if (nftRanks.length == 1)
    return <Span bold>{getNftName(nftRanks[0].nft)} 의 홀더</Span>;
  return (
    <Span>
      <Span bold>{getNftName(nftRanks[0].nft)} </Span>외{' '}
      <Span bold>+{nftRanks.length - 1}</Span>의 홀더
    </Span>
  );
}
