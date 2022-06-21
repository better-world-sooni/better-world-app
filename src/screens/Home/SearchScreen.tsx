import React, {useRef} from 'react';
import {Div} from 'src/components/common/Div';
import {ActivityIndicator, RefreshControl} from 'react-native';
import {Row} from 'src/components/common/Row';
import {Col} from 'src/components/common/Col';
import {Search} from 'react-native-feather';
import {Span} from 'src/components/common/Span';
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
import Colors from 'src/constants/Colors';
import RankedOwner from 'src/components/RankOwner';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const SearchScreen = () => {
  const searchRef = useRef(null);
  const {
    data: rankRes,
    isLoading: rankLoad,
    isPaginating: rankPaginating,
    page,
    isNotPaginatable,
  } = useApiSelector(apis.rank.list);
  const reloadGetWithToken = useReloadGETWithToken();
  const paginateGetWithToken = usePaginateGETWithToken();
  const handleRefresh = () => {
    if (rankLoad) return;
    reloadGetWithToken(apis.rank.list(text));
  };
  const handleEndReached = () => {
    if (rankPaginating || isNotPaginatable) return;
    paginateGetWithToken(apis.rank.list(text, page + 1), 'ranks');
  };
  const [text, textHasChanged, handleChangeText] = useEdittableText('');
  const onPressSearch = () => {
    searchRef?.current?.focus();
  };
  const handleChangeQuery = text => {
    handleChangeText(text);
    if (rankRes) {
      reloadGetWithToken(apis.rank.list(text));
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
            <Col mr10>
              <TextInput
                innerRef={searchRef}
                value={text}
                placeholder="NFT를 찾아보세요"
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
            <Col auto rounded100 onPress={onPressSearch}>
              <Search strokeWidth={2} color={'black'} height={22} width={22} />
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
        ListHeaderComponent={<Div h={headerHeight}></Div>}
        refreshControl={
          <RefreshControl
            refreshing={rankLoad && !textHasChanged}
            onRefresh={handleRefresh}
            progressViewOffset={headerHeight}
          />
        }
        data={rankRes ? rankRes.ranks : []}
        keyExtractor={item =>
          `${(item as any)?.contract_address}-${(item as any)?.token_id}`
        }
        renderItem={({item, index}) => {
          return <RankedOwner rankItem={item} />;
        }}></Animated.FlatList>
    </Div>
  );
};


export default SearchScreen;
