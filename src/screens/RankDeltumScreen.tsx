import React from 'react';
import apis from 'src/modules/apis';
import {
  useApiSelector,
  usePaginateGETWithToken,
  useReloadGETWithToken,
} from 'src/redux/asyncReducer';
import ListFlatlist from 'src/components/ListFlatlist';
import RankDeltum from 'src/components/RankDeltum';

export default function RankDeltumScreen({
  route: {
    params: {contractAddress, tokenId},
  },
}) {
  const {
    data: rankDeltumRes,
    isLoading: rankDeltumLoading,
    isPaginating: rankDeltumPaginating,
    page,
    isNotPaginatable,
  } = useApiSelector(apis.rankDeltum.list);
  const reloadGetWithToken = useReloadGETWithToken();
  const paginateGetWithToken = usePaginateGETWithToken();
  const handleRefresh = () => {
    if (rankDeltumLoading) return;
    reloadGetWithToken(apis.rankDeltum.list(contractAddress, tokenId));
  };
  const handleEndReached = () => {
    if (rankDeltumPaginating || isNotPaginatable) return;
    paginateGetWithToken(
      apis.rankDeltum.list(contractAddress, tokenId, page + 1),
      'rank_delta',
    );
  };
  return (
    <ListFlatlist
      onRefresh={handleRefresh}
      data={rankDeltumRes?.rank_delta || []}
      refreshing={rankDeltumLoading}
      onEndReached={handleEndReached}
      isPaginating={rankDeltumPaginating}
      title={'랭크 포인트 로그'}
      renderItem={({item}) => {
        return <RankDeltum rankDeltum={item} />;
      }}
    />
  );
}
