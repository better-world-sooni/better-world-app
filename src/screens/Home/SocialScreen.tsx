import React, {useRef} from 'react';
import {Row} from 'src/components/common/Row';
import {Bell, ChevronDown, Feather} from 'react-native-feather';
import apis from 'src/modules/apis';
import {
  useApiSelector,
  usePaginateGETWithToken,
  useReloadGETWithToken,
} from 'src/redux/asyncReducer';
import Post from 'src/components/common/Post';
import {Img} from 'src/components/common/Img';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {useGotoNotification} from 'src/hooks/useGoto';
import SideMenu from 'react-native-side-menu-updated';
import MyNftMenu from '../../components/common/MyNftMenu';
import FeedFlatlist from 'src/components/FeedFlatlist';
import {Platform, StatusBar} from 'react-native';
import {useScrollToTop} from '@react-navigation/native';
import {Span} from 'src/components/common/Span';
import {getNftName, getNftProfileImage} from 'src/modules/nftUtils';
import {Col} from 'src/components/common/Col';
import {MenuView} from '@react-native-menu/menu';
import Colors from 'src/constants/Colors';

enum SocialFilter {
  All = '',
  Following = 'following',
}

export default function SocialScreen() {
  const {
    data: feedRes,
    isLoading: feedLoading,
    isPaginating: feedPaginating,
    page,
    isNotPaginatable,
  } = useApiSelector(apis.feed.social);
  const {data: nftProfileRes, isLoading: nftProfileLoad} = useApiSelector(
    apis.nft._(),
  );
  const {data: nftCollectionRes, isLoading: nftCollectionLoad} = useApiSelector(
    apis.nft_collection._(),
  );
  const nftCollection = nftCollectionRes?.nft_collection;
  const nft = nftProfileRes?.nft;
  const menuOptions = [
    {
      id: SocialFilter.All,
      title: `커뮤니티 피드`,
      titleColor: '#46F289',
      image: Platform.select({
        ios: 'globe.asia.australia.fill',
        android: 'ic_menu_mapmode',
      }),
    },
    {
      id: SocialFilter.Following,
      title: `${getNftName(nft)}의 피드`,
      titleColor: '#46F289',
      image: Platform.select({
        ios: 'star.fill',
        android: 'star_big_on',
      }),
    },
  ];
  const gotoNotifications = useGotoNotification();
  const reloadGETWithToken = useReloadGETWithToken();
  const paginateGetWithToken = usePaginateGETWithToken();
  const handleRefresh = () => {
    if (feedLoading) return;
    reloadGETWithToken(apis.nft._());
    reloadGETWithToken(apis.feed.social());
  };
  const handleEndReached = () => {
    if (feedPaginating || isNotPaginatable) return;
    paginateGetWithToken(apis.feed.social(page + 1), 'feed');
  };
  const sideMenuRef = useRef(null);
  const openSideMenu = () => {
    sideMenuRef?.current?.openMenu(true);
  };
  const flatlistRef = useRef(null);
  useScrollToTop(flatlistRef);
  return (
    <FeedFlatlist
      ref={flatlistRef}
      refreshing={feedLoading}
      onRefresh={handleRefresh}
      isPaginating={feedPaginating}
      onEndReached={handleEndReached}
      isNotPaginatable={isNotPaginatable}
      renderItem={({item, index}) => {
        return <Post key={(item as any).id} post={item} />;
      }}
      data={feedRes ? feedRes.feed : []}
      TopComponent={
        <Row itemsCenter>
          <Col auto>
            <MenuView onPressAction={null} actions={menuOptions}>
              <Row itemsCenter>
                <Col auto>
                  <Span fontSize={19} bold>
                    커뮤니티 피드
                  </Span>
                </Col>
                <Col auto>
                  <ChevronDown
                    strokeWidth={2}
                    color={'black'}
                    height={20}
                    width={20}
                  />
                </Col>
              </Row>
            </MenuView>
          </Col>
          <Col itemsEnd rounded100 onPress={() => gotoNotifications()} pr15>
            <Row itemsCenter>
              <Col auto>
                <Span bold fontSize={10}>
                  게시하기
                </Span>
              </Col>
              <Col auto>
                <Feather
                  width={22}
                  height={22}
                  strokeWidth={2}
                  fill={Colors.info.DEFAULT}
                  color={'black'}></Feather>
              </Col>
            </Row>
          </Col>
          <Col auto rounded100 onPress={() => gotoNotifications()}>
            <Bell strokeWidth={2} color={'black'} height={22} width={22} />
          </Col>
        </Row>
      }
    />
  );
}
