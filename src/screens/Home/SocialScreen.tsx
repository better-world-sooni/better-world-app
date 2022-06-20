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
import {useGotoNewPost, useGotoNotification} from 'src/hooks/useGoto';
import FeedFlatlist from 'src/components/FeedFlatlist';
import {Platform} from 'react-native';
import {useScrollToTop} from '@react-navigation/native';
import {Span} from 'src/components/common/Span';
import {Col} from 'src/components/common/Col';
import {MenuView} from '@react-native-menu/menu';
import {PostOwnerType, PostType} from '../NewPostScreen';
import {Div} from 'src/components/common/Div';

enum SocialFeedFilter {
  All = 'all',
  Following = 'following',
}

export default function SocialScreen() {
  const flatlistRef = useRef(null);
  useScrollToTop(flatlistRef);
  const {
    data: feedRes,
    isLoading: feedLoading,
    isPaginating: feedPaginating,
    page,
    isNotPaginatable,
  } = useApiSelector(apis.feed.social);
  const {data: nftProfileRes} = useApiSelector(apis.nft._());
  const nft = nftProfileRes?.nft;
  const menuOptions = [
    {
      id: SocialFeedFilter.All,
      title: `커뮤니티 피드`,
      titleColor: '#46F289',
      image: Platform.select({
        ios: 'globe.asia.australia',
        android: 'ic_menu_mapmode',
      }),
    },
    {
      id: SocialFeedFilter.Following,
      title: `팔로잉 피드`,
      titleColor: '#46F289',
      image: Platform.select({
        ios: 'star',
        android: 'star_big_on',
      }),
    },
  ];
  const gotoNotifications = useGotoNotification();
  const reloadGETWithToken = useReloadGETWithToken();
  const paginateGetWithToken = usePaginateGETWithToken();
  const gotoNewPost = useGotoNewPost({
    postOwnerType: PostOwnerType.Nft,
  });
  const handlePressMenu = ({nativeEvent: {event}}) => {
    flatlistRef?.current
      ?.getScrollResponder()
      ?.scrollTo({x: 0, y: 0, animated: true});
    if (
      event == SocialFeedFilter.All &&
      feedRes?.filter !== SocialFeedFilter.All
    ) {
      reloadGETWithToken(apis.feed.social(SocialFeedFilter.All));
    }
    if (
      event == SocialFeedFilter.Following &&
      feedRes?.filter !== SocialFeedFilter.Following
    ) {
      reloadGETWithToken(apis.feed.social(SocialFeedFilter.Following));
    }
  };
  const handleRefresh = () => {
    if (feedLoading) return;
    reloadGETWithToken(apis.feed.social(feedRes?.filter));
  };
  const handleEndReached = () => {
    if (feedPaginating || isNotPaginatable) return;
    paginateGetWithToken(apis.feed.social(feedRes?.filter, page + 1), 'feed');
  };
  return (
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
          <Col auto>
            <MenuView onPressAction={handlePressMenu} actions={menuOptions}>
              <Row itemsCenter>
                <Col auto>
                  <Span fontSize={19} bold>
                    {menuOptions.filter(
                      menuOption => menuOption.id == feedRes?.filter,
                    )[0]?.title || '피드를 다시 로드해주세요'}
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
          <Col itemsEnd>
            <Div onPress={() => gotoNotifications()}>
              <Bell strokeWidth={2} color={'black'} height={22} width={22} />
            </Div>
          </Col>
        </Row>
      }
    />
  );
}
