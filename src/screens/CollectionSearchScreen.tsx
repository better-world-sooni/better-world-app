import React, {useRef} from 'react';
import {Div} from 'src/components/common/Div';
import {FlatList, RefreshControl} from 'react-native';
import {Row} from 'src/components/common/Row';
import {Col} from 'src/components/common/Col';
import {ChevronLeft, Search} from 'react-native-feather';
import apis from 'src/modules/apis';
import {
  useApiSelector,
  usePaginateGETWithToken,
  useReloadGETWithToken,
} from 'src/redux/asyncReducer';
import {TextInput} from 'src/components/common/ViewComponents';
import {Colors} from 'src/modules/styles';
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
  const notchHeight = useSafeAreaInsets().top;
  return (
    <Div flex={1} bgWhite>
      <Div h={notchHeight} />
      <FlatList
        automaticallyAdjustContentInsets
        showsVerticalScrollIndicator={false}
        onEndReached={handleEndReached}
        ListHeaderComponent={
          <Div
            bgWhite
            px8
            h={50}
            justifyCenter
            borderBottom={0.5}
            borderGray200>
            <Row itemsCenter>
              <Col auto onPress={goBack}>
                <ChevronLeft
                  strokeWidth={2}
                  color={Colors.black}
                  height={22}
                  width={22}
                />
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
              <Col auto onPress={onPressSearch} pr8>
                <Search
                  strokeWidth={2}
                  color={Colors.black}
                  height={22}
                  width={22}
                />
              </Col>
            </Row>
          </Div>
        }
        stickyHeaderIndices={[0]}
        refreshControl={
          <RefreshControl
            refreshing={memberLoading && !textHasChanged}
            onRefresh={handleRefresh}
          />
        }
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
        }}></FlatList>
    </Div>
  );
};

export default CollectionSearchScreen;
