import React, {useRef} from 'react';
import {Row} from 'src/components/common/Row';
import {Bell} from 'react-native-feather';
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
import {StatusBar} from 'react-native';
import {useScrollToTop} from '@react-navigation/native';
import {Span} from 'src/components/common/Span';
import {getNftName, getNftProfileImage} from 'src/modules/nftUtils';
import {Col} from 'src/components/common/Col';

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
  const nft = nftProfileRes?.nft;
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
    <SideMenu
      ref={sideMenuRef}
      toleranceX={0}
      edgeHitWidth={100}
      menu={<MyNftMenu nft={nft} />}
      bounceBackOnOverdraw={false}
      openMenuOffset={DEVICE_WIDTH - 65}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF"></StatusBar>
      <FeedFlatlist
        ref={flatlistRef}
        refreshing={feedLoading}
        onRefresh={handleRefresh}
        isPaginating={feedPaginating}
        onEndReached={handleEndReached}
        isNotPaginatable={isNotPaginatable}
        enableAdd
        renderItem={({item, index}) => {
          return <Post key={(item as any).id} post={item} />;
        }}
        data={feedRes ? feedRes.feed : []}
        TopComponent={
          <Row itemsCenter>
            <Col itemsStart rounded100 onPress={openSideMenu}>
              {nft && (
                <Img h30 w30 rounded100 uri={getNftProfileImage(nft)}></Img>
              )}
            </Col>
            <Col auto itemsCenter>
              <Span bold fontSize={19}>
                {getNftName(nft)}의 소셜 피드
              </Span>
            </Col>
            <Col itemsEnd rounded100 onPress={() => gotoNotifications()}>
              <Bell strokeWidth={1.7} color={'black'} height={24} width={24} />
            </Col>
          </Row>
        }
      />
    </SideMenu>
  );
}
