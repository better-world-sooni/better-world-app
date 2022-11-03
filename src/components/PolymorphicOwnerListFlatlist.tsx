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
      keyExtractor={item =>
        `${(item as any).nft?.contract_address}-${(item as any).nft?.token_id}`
      }
      renderItem={({item}) => {
        return (
          <PolymorphicOwner
            nft={(item as any).nft}
            isFollowing={(item as any).is_following}
            value={(item as any).value}
          />
        );
      }}
    />
  );
}
