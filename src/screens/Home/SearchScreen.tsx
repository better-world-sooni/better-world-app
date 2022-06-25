import React, {useRef} from 'react';
import {Div} from 'src/components/common/Div';
import {FlatList, RefreshControl} from 'react-native';
import {Row} from 'src/components/common/Row';
import {Col} from 'src/components/common/Col';
import {Search} from 'react-native-feather';
import apis from 'src/modules/apis';
import {
  useApiSelector,
  usePaginateGETWithToken,
  useReloadGETWithToken,
} from 'src/redux/asyncReducer';
import {TextInput} from 'src/components/common/ViewComponents';
import {Colors, DEVICE_HEIGHT} from 'src/modules/styles';
import useEdittableText from 'src/hooks/useEdittableText';
import RankedOwner from 'src/components/RankOwner';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ListEmptyComponent from 'src/components/common/ListEmptyComponent';
import FocusAwareStatusBar from 'src/components/FocusAwareStatusBar';

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
  const notchHeight = useSafeAreaInsets().top;
  const headerHeight = notchHeight + 50;
  return (
    <Div flex={1} bgWhite>
      <Div h={notchHeight}></Div>
      <Div bgWhite px15 h={50} justifyCenter borderBottom={0.5} borderGray200>
        <Row itemsCenter py5 h40>
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
            <Search
              strokeWidth={2}
              color={Colors.black}
              height={22}
              width={22}
            />
          </Col>
        </Row>
      </Div>
      <FlatList
        ListEmptyComponent={
          <ListEmptyComponent h={DEVICE_HEIGHT - headerHeight * 2} />
        }
        showsVerticalScrollIndicator={false}
        onEndReached={handleEndReached}
        refreshControl={
          <RefreshControl
            refreshing={rankLoad && !textHasChanged}
            onRefresh={handleRefresh}
          />
        }
        data={rankRes ? rankRes.ranks : []}
        keyExtractor={item =>
          `${(item as any)?.contract_address}-${(item as any)?.token_id}`
        }
        renderItem={({item, index}) => {
          return <RankedOwner rankItem={item} />;
        }}></FlatList>
    </Div>
  );
};


export default SearchScreen;
