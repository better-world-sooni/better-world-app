import React from 'react';
import ListFlatlist from './ListFlatlist';
import PolymorphicOwner from './PolymorphicOwner';

export default function PolymorphicOwnerListFlatlist({
  refreshing,
  onRefresh,
  onEndReached = null,
  isPaginating = false,
  data,
  title,
}) {
  return (
    <ListFlatlist
      onRefresh={onRefresh}
      data={data}
      refreshing={refreshing}
      onEndReached={onEndReached}
      isPaginating={isPaginating}
      title={title}
      renderItem={({item}) => {
        return (
          <PolymorphicOwner
            nft={(item as any).nft}
            isFollowing={(item as any).is_following}
          />
        );
      }}
    />
  );
}
