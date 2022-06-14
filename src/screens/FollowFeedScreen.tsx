import React from 'react';
import apis from 'src/modules/apis';
import {
  useApiSelector,
  usePaginateGETWithToken,
  useReloadGETWithToken,
} from 'src/redux/asyncReducer';
import Post from 'src/components/common/Post';
import ListFlatlist from 'src/components/ListFlatlist';

export default function FollowFeedScreen() {
  const {
    data: feedRes,
    isLoading: feedLoading,
    isPaginating: feedPaginating,
    page,
    isNotPaginatable,
  } = useApiSelector(apis.feed._);
  const paginateGetWithToken = usePaginateGETWithToken();
  const handleEndReached = () => {
    if (feedPaginating || isNotPaginatable) return;
    paginateGetWithToken(apis.feed._(page + 1), 'feed');
  };
  const reloadGetWithToken = useReloadGETWithToken();
  const onRefresh = () => {
    if (feedLoading) return;
    reloadGetWithToken(apis.feed._());
  };
  return (
    <ListFlatlist
      onRefresh={onRefresh}
      data={feedRes ? feedRes.feed : []}
      refreshing={feedLoading}
      onEndReached={handleEndReached}
      isPaginating={feedPaginating}
      enableBack={false}
      title={'팔로우 피드'}
      renderItem={({item}) => {
        return <Post key={(item as any).id} post={item} />;
      }}
    />
  );
}
