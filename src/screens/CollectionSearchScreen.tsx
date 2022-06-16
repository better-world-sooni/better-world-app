import React, {useRef} from 'react';
import {Div} from 'src/components/common/Div';
import {RefreshControl} from 'react-native';
import {Row} from 'src/components/common/Row';
import {Col} from 'src/components/common/Col';
import {ChevronLeft, Search} from 'react-native-feather';
import apis from 'src/modules/apis';
import {
  useApiSelector,
  usePaginateGETWithToken,
  useReloadGETWithToken,
} from 'src/redux/asyncReducer';
import {TextInput} from 'src/modules/viewComponents';
import {DEVICE_WIDTH} from 'src/modules/styles';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {CustomBlurView} from 'src/components/common/CustomBlurView';
import useEdittableText from 'src/hooks/useEdittableText';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import PolymorphicOwner from 'src/components/PolymorphicOwner';
import {useNavigation} from '@react-navigation/native';

const CollectionSearchScreen = ({
  route: {
    params: {contractAddress},
  },
}) => {
  const searchRef = useRef(null);
  const {
    data: memberRes,
    isLoading: memberLoading,
    isPaginating: memberPaginating,
    page,
    isNotPaginatable,
  } = useApiSelector(apis.nft_collection.contractAddress.nft.list);
  const {goBack} = useNavigation();
  const reloadGetWithToken = useReloadGETWithToken();
  const paginateGetWithToken = usePaginateGETWithToken();
  const handleRefresh = () => {
    if (memberLoading) return;
    reloadGetWithToken(
      apis.nft_collection.contractAddress.nft.list(contractAddress, text),
    );
  };
  const handleEndReached = () => {
    if (memberPaginating || isNotPaginatable) return;
    paginateGetWithToken(
      apis.nft_collection.contractAddress.nft.list(
        contractAddress,
        text,
        page + 1,
      ),
      'nfts',
    );
  };
  const [text, textHasChanged, handleChangeText] = useEdittableText('');
  const onPressSearch = () => {
    searchRef?.current?.focus();
  };
  const handleChangeQuery = text => {
    handleChangeText(text);
    if (memberRes) {
      reloadGetWithToken(
        apis.nft_collection.contractAddress.nft.list(contractAddress, text),
      );
    }
  };

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
      <Div h={headerHeight} zIndex={100}>
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
            }}></CustomBlurView>
        </Animated.View>
        <Div zIndex={100} absolute w={DEVICE_WIDTH} top={notchHeight + 5}>
          <Row itemsCenter py5 h40 px15>
            <Col auto bgRealBlack p8 rounded100 onPress={goBack}>
              <Div>
                <ChevronLeft
                  strokeWidth={2}
                  color={'white'}
                  height={15}
                  width={15}
                />
              </Div>
            </Col>
            <Col mx10>
              <TextInput
                innerRef={searchRef}
                value={text}
                placeholder="컬렉션의 NFT를 찾아보세요"
                fontSize={16}
                bgGray200
                rounded100
                m0
                p0
                px8
                h32
                bold
                onChangeText={handleChangeQuery}
              />
            </Col>
            <Col auto bgRealBlack p8 rounded100 onPress={onPressSearch}>
              <Div>
                <Search
                  strokeWidth={2}
                  color={'white'}
                  height={15}
                  width={15}
                />
              </Div>
            </Col>
          </Row>
        </Div>
      </Div>
      <Animated.FlatList
        style={{marginTop: -headerHeight}}
        automaticallyAdjustContentInsets
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        onEndReached={handleEndReached}
        refreshControl={
          <RefreshControl
            refreshing={memberLoading && !textHasChanged}
            onRefresh={handleRefresh}
            progressViewOffset={headerHeight}
          />
        }
        ListHeaderComponent={<Div h={headerHeight}></Div>}
        data={memberRes ? memberRes.nfts : []}
        keyExtractor={item =>
          `${(item as any)?.nft?.contract_address}-${
            (item as any)?.nft?.token_id
          }`
        }
        renderItem={({item, index}) => {
          return (
            <PolymorphicOwner
              showPrivilege
              nft={(item as any).nft}
              isFollowing={(item as any).is_following}
            />
          );
        }}></Animated.FlatList>
    </Div>
  );
};

export default CollectionSearchScreen;
