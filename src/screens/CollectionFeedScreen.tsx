import React from 'react';
import apis from 'src/modules/apis';
import {
  useApiSelector,
  usePaginateGETWithToken,
  useReloadGETWithToken,
} from 'src/redux/asyncReducer';
import Post from 'src/components/common/Post';
import ListFlatlist from 'src/components/ListFlatlist';

export default function CollectionFeedScreen({
  route: {
    params: {contractAddress, title, type},
  },
}) {
  const {
    data: feedRes,
    isLoading: feedLoading,
    isPaginating: feedPaginating,
    page,
    isNotPaginatable,
  } = useApiSelector(apis.feed.collection);
  const paginateGetWithToken = usePaginateGETWithToken();
  const handleEndReached = () => {
    if (feedPaginating || isNotPaginatable) return;
    paginateGetWithToken(
      apis.feed.collection(contractAddress, type, page + 1),
      'feed',
    );
  };
  const reloadGetWithToken = useReloadGETWithToken();
  const onRefresh = () => {
    if (feedLoading) return;
    reloadGetWithToken(apis.feed.collection(contractAddress, type));
  };
  return (
    <ListFlatlist
      onRefresh={onRefresh}
      data={feedRes ? feedRes.feed : []}
      refreshing={feedLoading}
      onEndReached={handleEndReached}
      isPaginating={feedPaginating}
      title={title}
      renderItem={({item}) => {
        return <Post key={(item as any).id} post={item} />;
      }}
    />
  );
}
