import React, {useRef} from 'react';
import {Div} from 'src/components/common/Div';
import {ActivityIndicator, FlatList, RefreshControl} from 'react-native';
import {Row} from 'src/components/common/Row';
import {Col} from 'src/components/common/Col';
import {Search, ChevronLeft} from 'react-native-feather';
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
import {useNavigation} from '@react-navigation/native';
import {Span} from 'src/components/common/Span';
import {Img} from 'src/components/common/Img';
import useFollow from 'src/hooks/useFollow';
import {useGotoNftCollectionProfile} from 'src/hooks/useGoto';

const NftCollectionSearchScreen = () => {
  const searchRef = useRef(null);
  const {
    data: rankRes,
    isLoading: rankLoad,
    isPaginating: rankPaginating,
    page,
    isNotPaginatable,
  } = useApiSelector(apis.nft_collection.list);
  const reloadGetWithToken = useReloadGETWithToken();
  const paginateGetWithToken = usePaginateGETWithToken();
  const {goBack} = useNavigation();
  const handleRefresh = () => {
    if (rankLoad) return;
    reloadGetWithToken(apis.nft_collection.list(text));
  };
  const handleEndReached = () => {
    if (rankPaginating || isNotPaginatable) return;
    paginateGetWithToken(
      apis.nft_collection.list(text, page + 1),
      'nft_collections',
    );
  };
  const [text, textHasChanged, handleChangeText] = useEdittableText('');
  const onPressSearch = () => {
    searchRef?.current?.focus();
  };
  const handleChangeQuery = text => {
    handleChangeText(text);
    if (rankRes) {
      reloadGetWithToken(apis.nft_collection.list(text));
    }
  };
  const notchHeight = useSafeAreaInsets().top;
  const headerHeight = notchHeight + 50;
  return (
    <Div flex={1} bgWhite>
      <Div h={notchHeight}></Div>
      <Div bgWhite px8 h={50} justifyCenter borderBottom={0.5} borderGray200>
        <Row itemsCenter py5 h40>
          <Div auto rounded100 onPress={goBack}>
            <ChevronLeft
              width={30}
              height={30}
              color={Colors.black}
              strokeWidth={2}
            />
          </Div>
          <Col mr10>
            <TextInput
              innerRef={searchRef}
              value={text}
              placeholder="NFT 컬렉션을 찾아보세요"
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
          <Col auto rounded100 onPress={onPressSearch} pr7>
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
          !rankLoad && (
            <ListEmptyComponent h={DEVICE_HEIGHT - headerHeight * 2} />
          )
        }
        showsVerticalScrollIndicator={false}
        onEndReached={handleEndReached}
        refreshControl={
          <RefreshControl
            refreshing={rankLoad && !textHasChanged}
            onRefresh={handleRefresh}
          />
        }
        data={rankRes ? rankRes.nft_collections : []}
        keyExtractor={item =>
          `${(item as any)?.contract_address}-${(item as any)?.token_id}`
        }
        ListFooterComponent={
          <>
            {rankPaginating && (
              <Div itemsCenter py15>
                <ActivityIndicator />
              </Div>
            )}
            {isNotPaginatable && (
              <Div itemsCenter py15>
                <Span textCenter bold>
                  모두 확인했습니다.
                </Span>
              </Div>
            )}
            <Div h={50}></Div>
            <Div h={27} />
          </>
        }
        renderItem={({item, index}) => {
          return <NftCollection nftCollection={item} />;
        }}></FlatList>
    </Div>
  );
};

function NftCollection({nftCollection}) {
  const shadowProps = {
    style: {
      shadowOffset: {
        width: 3,
        height: 3,
      },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 2,
    },
  };
  const {
    isFollowing,
    followerCount,
    handlePressFollowing,
    isBlocked,
    handlePressBlock,
  } = useFollow(nftCollection.is_following, 0, nftCollection.contract_address);
  const gotoNftCollection = useGotoNftCollectionProfile({nftCollection});

  return (
    <Div pt15 px20 onPress={gotoNftCollection}>
      <Row {...shadowProps} bgWhite py15 px20 rounded20 itemsCenter>
        <Col auto h75 w75 rounded100 bgGray200 borderGray200 border={0.5}>
          <Img uri={nftCollection.image_uri} h75 w75 rounded100 />
        </Col>
        <Col pl15>
          <Div>
            <Span bold numberOfLines={1}>
              {nftCollection.name}
            </Span>
          </Div>
          {nftCollection.about && (
            <Div mt4>
              <Span gray400 numberOfLines={2}>
                {nftCollection.about}
              </Span>
            </Div>
          )}
        </Col>
        <Col auto pl15>
          <Div
            rounded7
            bgPrimary={!isFollowing}
            bgGray200={isFollowing}
            py7
            px15
            onPress={handlePressFollowing}>
            <Span bold white={!isFollowing} gray600={isFollowing}>
              {isFollowing ? '팔로잉' : '팔로우'}
            </Span>
          </Div>
        </Col>
      </Row>
    </Div>
  );
}

export default NftCollectionSearchScreen;
