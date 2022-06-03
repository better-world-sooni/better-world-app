import React from 'react';
import apis from 'src/modules/apis';
import {
  useApiSelector,
  usePaginateGETWithToken,
  useReloadGETWithToken,
} from 'src/redux/asyncReducer';
import Post from 'src/components/common/Post';
import {Div} from 'src/components/common/Div';
import {Span} from 'src/components/common/Span';
import {useGotoNewCollectionEvent} from 'src/hooks/useGoto';
import {useIsAdmin} from 'src/modules/nftUtils';
import ListFlatlist from 'src/components/ListFlatlist';
import CollectionEvent from 'src/components/common/CollectionEvent';
import {DEVICE_WIDTH} from 'src/modules/styles';

export default function CollectionEventListScreen({
  route: {
    params: {nftCollection},
  },
}) {
  const {
    data: collectionEventListRes,
    isLoading: collectionEventListLoading,
    isPaginating: collectionEventPaginating,
    page,
    isNotPaginatable,
  } = useApiSelector(
    apis.collectionEvent.contractAddress.list(nftCollection.contract_address),
  );
  const paginateGetWithToken = usePaginateGETWithToken();
  const handleEndReached = () => {
    if (collectionEventPaginating || isNotPaginatable) return;
    paginateGetWithToken(
      apis.collectionEvent.contractAddress.list(
        nftCollection.contract_address,
        page + 1,
      ),
      'collection_events',
    );
  };
  const gotoNewCollectionEvent = useGotoNewCollectionEvent({nftCollection});
  const reloadGetWithToken = useReloadGETWithToken();
  const handleRefresh = () => {
    reloadGetWithToken(
      apis.collectionEvent.contractAddress.list(nftCollection.contract_address),
    );
  };
  const isAdmin = useIsAdmin(nftCollection);
  return (
    <ListFlatlist
      onRefresh={handleRefresh}
      data={collectionEventListRes?.collection_events || []}
      refreshing={collectionEventListLoading}
      onEndReached={handleEndReached}
      isPaginating={collectionEventPaginating}
      title={`${nftCollection.name} 일정`}
      HeaderRightComponent={
        isAdmin && (
          <Div onPress={gotoNewCollectionEvent}>
            <Span info bold fontSize={14}>
              추가
            </Span>
          </Div>
        )
      }
      renderItem={({item}) => {
        return (
          <CollectionEvent
            collectionEvent={item}
            itemWidth={DEVICE_WIDTH - 30}
          />
        );
      }}
    />
  );
}
