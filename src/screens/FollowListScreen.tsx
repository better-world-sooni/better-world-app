import React from 'react';
import apis from 'src/modules/apis';
import {
  useApiSelector,
  usePaginateGETWithToken,
  useReloadGETWithToken,
} from 'src/redux/asyncReducer';
import PolymorphicOwnerListFlatlist from 'src/components/PolymorphicOwnerListFlatlist';

export enum FollowOwnerType {
  Nft,
  NftCollection,
}

export enum FollowType {
  Followings,
  Followers,
}

const FollowListScreen = ({
  route: {
    params: {followOwnerType, followType, contractAddress, tokenId},
  },
}) => {
  const {
    data: followListRes,
    isLoading: followListLoading,
    isPaginating: followPaginating,
    page,
    isNotPaginatable,
  } = useApiSelector(
    apis.follow.list(
      followType == FollowType.Followers ? true : false,
      contractAddress,
      followOwnerType == FollowOwnerType.Nft ? tokenId : null,
    ),
  );
  const reloadGetWithToken = useReloadGETWithToken();
  const paginateGetWithToken = usePaginateGETWithToken();
  const handleRefresh = () => {
    if (followListLoading) return;
    reloadGetWithToken(
      apis.follow.list(
        followType == FollowType.Followers ? true : false,
        contractAddress,
        followOwnerType == FollowOwnerType.Nft ? tokenId : null,
      ),
    );
  };
  const handleEndReached = () => {
    if (followPaginating || isNotPaginatable) return;
    paginateGetWithToken(
      apis.follow.list(
        followType == FollowType.Followers ? true : false,
        contractAddress,
        followOwnerType == FollowOwnerType.Nft ? tokenId : null,
        page + 1,
      ),
      'follows',
    );
  };
  return (
    <PolymorphicOwnerListFlatlist
      onRefresh={handleRefresh}
      data={followListRes ? followListRes.follows : []}
      refreshing={followListLoading}
      onEndReached={handleEndReached}
      isPaginating={followPaginating}
      title={FollowType.Followers == followType ? '팔로워' : '팔로잉'}
    />
  );
};

export default FollowListScreen;
