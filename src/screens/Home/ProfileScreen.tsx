import {
useNavigation
} from '@react-navigation/native';
import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {Img} from 'src/components/common/Img';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import APIS from 'src/modules/apis';
import {IMAGES} from 'src/modules/images';
import {NAV_NAMES} from 'src/modules/navNames';
import {FlatList, ScrollView} from 'src/modules/viewComponents';
import {
  deletePromiseFn,
  getPromiseFn,
  postPromiseFn,
  useApiSelector,
  useReloadGET,
} from 'src/redux/asyncReducer';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {LogOut, PlusSquare} from 'react-native-feather';
import {
  Direction,
  GRAY_COLOR,
  HAS_NOTCH,
  iconSettings,
  LINE2_Linked_List,
  MAIN_LINE2,
  MY_ROUTE,
  Selecting,
  shortenStations,
  truncateKlaytnAddress,
} from 'src/modules/constants';
import {appActions, useLogout} from 'src/redux/appReducer';
import {RootState} from 'src/redux/rootReducer';
import {Alert, RefreshControl, Switch} from 'react-native';
import {ICONS} from 'src/modules/icons';

const ProfileScreen = props => {
  const navigation = useNavigation();
  const logout = useLogout(() => navigation.navigate(NAV_NAMES.SignIn));
  const {data: profileResponse, isLoading: profileLoading} = useApiSelector(
    APIS.profile.my,
  );
  const loadingUser = {
    uuid: 'loading...',
    username: 'loading...',
    email_account: null,
    klaytn_accounts: [],
    avatar_nfts: [],
  };
  const user = profileResponse?.user || loadingUser;
  const avatarNfts =
    user.avatar_nfts.filter(nft => {
      nft.main;
    })[0] || user.avatar_nfts[0];
  const profileImgUrl = avatarNfts?.nft_metadatum?.image_url || '';
  console.log(avatarNfts);
  const apiGET = useReloadGET();
  const {currentUser, token} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const pullToRefresh = useCallback(async () => {
    apiGET(APIS.profile.my());
  }, []);
  const handleGotoPost = useCallback(
    () => navigation.navigate(NAV_NAMES.Post),
    [],
  );
  useEffect(() => {}, []);

  return (
    <Div flex backgroundColor={'white'}>
      <Div h={HAS_NOTCH ? 44 : 20} />
      <Row itemsCenter py10 px20 bg={'white'}>
        <Col justifyCenter bgGray300 rounded20 h30 wFull mr20 px20>
          <Span gray500>Search by address or username</Span>
        </Col>
        <Col pl15 auto onPress={logout}>
          <LogOut {...iconSettings} color={'black'}></LogOut>
        </Col>
      </Row>
      <FlatList
        flex={1}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Div relative px20>
            <Row my10>
              <Col auto>
                <Img uri={profileImgUrl} h100 w100 rounded20></Img>
              </Col>
              <Col px20 flex itemsStart>
                <Span bold fontSize={20}>
                  {truncateKlaytnAddress(user.username)}
                </Span>
              </Col>
            </Row>
            <Row pt10 pb5>
              <Span bold fontSize={20}>
                Accounts
              </Span>
            </Row>
            {user.klaytn_accounts.map(klaytnAccount => {
              return (
                <Row border1 borderGray400 rounded5 my5 py10 px15>
                  <Col auto>
                    <Img
                      source={ICONS[klaytnAccount.type]}
                      w30
                      h30
                      rounded25></Img>
                  </Col>
                  <Col ml10>
                    <Span bold>{klaytnAccount.type}</Span>
                    <Span bold>
                      {truncateKlaytnAddress(klaytnAccount.address)}
                    </Span>
                  </Col>
                  <Col auto>
                    <Div rounded5 bgGray200 py2 px5>
                      <Span bold>{klaytnAccount.main ? 'Main' : 'Voting'}</Span>
                    </Div>
                  </Col>
                </Row>
              );
            })}
            <Row pt10 pb5>
              <Span bold fontSize={20}>
                Gomz
              </Span>
            </Row>
            <ScrollView horizontal>
              {user.avatar_nfts.map(avatarNft => {
                return (
                  <Div w100 mr20>
                    <Row auto>
                      <Img
                        uri={avatarNft.nft_metadatum?.image_url}
                        w100
                        h100
                        rounded25></Img>
                    </Row>
                    <Row py5>
                      <Span bold>
                        {avatarNft.nft_metadatum?.name ||
                          'Metadata doesnt exist'}
                      </Span>
                    </Row>
                  </Div>
                );
              })}
            </ScrollView>
          </Div>
        }
        data={user.klaytn_accounts}
        renderItem={({item, index}) => {
          return <Span></Span>;
        }}
        ListEmptyComponent={
          <>
            <Row itemsCenter justifyCenter pt20 pb10 onPress={handleGotoPost}>
              <Col h2 />
              <Col auto>
                <PlusSquare
                  height={50}
                  width={50}
                  strokeWidth={0.7}
                  color={GRAY_COLOR}></PlusSquare>
              </Col>
              <Col h2></Col>
            </Row>
            <Row pb20>
              <Col></Col>
              <Col auto>
                <Span color={GRAY_COLOR}>게시물을 올려보세요!</Span>
              </Col>
              <Col></Col>
            </Row>
          </>
        }
        refreshControl={
          <RefreshControl
            refreshing={profileLoading}
            onRefresh={pullToRefresh}
          />
        }></FlatList>
    </Div>
  );
};

export default ProfileScreen;
  