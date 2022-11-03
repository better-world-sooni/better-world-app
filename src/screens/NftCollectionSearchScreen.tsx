import React, {useRef} from 'react';
import {Div} from 'src/components/common/Div';
import {ActivityIndicator, FlatList, RefreshControl} from 'react-native';
import {Row} from 'src/components/common/Row';
import {Col} from 'src/components/common/Col';
import {Search, ChevronLeft, XCircle} from 'react-native-feather';
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
import {TextField} from 'src/components/TextField';
import {ICONS} from 'src/modules/icons';
import GradientColorRect from 'src/components/common/GradientColorRect';
import {getNftCollectionProfileImage} from 'src/utils/nftUtils';

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
  const onPressX = () => {
    handleChangeText('');
    reloadGetWithToken(apis.nft_collection.list(''));
  };
  const handleChangeQuery = text => {
    handleChangeText(text);
    if (rankRes) {
      reloadGetWithToken(apis.nft_collection.list(text));
    }
  };
  const notchHeight = useSafeAreaInsets().top;
  const headerHeight = notchHeight + 50;
  const shadowProps = {
    style: {
      shadowOffset: {
        width: 1,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 1,
      elevation: 2,
    },
  };
  return (
    <Div flex={1} bgWhite>
      <Div h={notchHeight}></Div>
      <Div bgWhite px13 h={56} justifyCenter borderBottom={0.5} borderGray200>
        <Row itemsCenter>
          <Col px5 relative>
            <TextInput
              innerRef={searchRef}
              value={text}
              placeholder="NFT 컬렉션을 찾아보세요"
              placeholderTextColor={Colors.gray[600]}
              bgGray200
              rounded100
              pl15
              pr31
              h34
              bold
              onChangeText={handleChangeQuery}
              {...shadowProps}
            />
            <Div absolute px16 py9 right0 top0 onPress={onPressX}>
              <Img source={ICONS.xCircle} h16 w16></Img>
            </Div>
          </Col>
          <Col auto rounded100 onPress={goBack} px10>
            <Span bold info fontSize={14}>
              취소
            </Span>
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
          const prevFollowing =
            rankRes.nft_collections[index - 1]?.is_following;
          return (
            <NftCollection
              nftCollection={item}
              index={index}
              prevFollowing={prevFollowing}
            />
          );
        }}></FlatList>
    </Div>
  );
};

function NftCollection({nftCollection, index, prevFollowing}) {
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
  const shadowProps1 = {
    style: {
      shadowOffset: {
        width: 3,
        height: 3,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
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
      {index == 0 && isFollowing ? (
        <Div py12>
          <Span bold fontSize={16}>
            MY NFT
          </Span>
        </Div>
      ) : prevFollowing && !isFollowing ? (
        <Div py12 borderTop={0.5} borderGray200 mx={-20} px20>
          <Span bold fontSize={16}>
            더 많은 NFT
          </Span>
        </Div>
      ) : null}
      <Row {...shadowProps} bgWhite py15 px20 rounded20 itemsCenter>
        <Col
          auto
          h75
          w75
          rounded100
          bgGray200
          borderGray200
          border={0.5}
          {...shadowProps1}>
          <Img
            uri={getNftCollectionProfileImage(nftCollection, 200, 200)}
            h75
            w75
            rounded100
          />
        </Col>
        <Col pl15>
          <Div>
            <Span bold numberOfLines={1} fontSize={14}>
              {nftCollection.name}
            </Span>
          </Div>
          {nftCollection.about && (
            <Div mt2>
              <Span gray400 numberOfLines={2} fontSize={11}>
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
            relative
            py7
            overflowHidden
            px15
            onPress={handlePressFollowing}>
            {!isFollowing && (
              <Div absolute>
                <GradientColorRect width={100} height={50} />
              </Div>
            )}
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
