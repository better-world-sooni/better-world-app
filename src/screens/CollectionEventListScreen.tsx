import React from 'react';
import {Col} from 'src/components/common/Col';
import apis from 'src/modules/apis';
import {useApiSelector, useReloadGETWithToken} from 'src/redux/asyncReducer';
import Post from 'src/components/common/Post';
import {Div} from 'src/components/common/Div';
import {useNavigation} from '@react-navigation/native';
import {ChevronLeft} from 'react-native-feather';
import FeedFlatlistWithHeader from 'src/components/FeedFlatlistWithHeader';
import {Span} from 'src/components/common/Span';
import {useGotoNewCollectionEvent} from 'src/hooks/useGoto';
import CollectionEvent from 'src/components/common/CollectionEvent';
import {DEVICE_WIDTH} from 'src/modules/styles';

export default function CollectionEventListScreen({
  route: {
    params: {nftCollection},
  },
}) {
  const {data: collectionEventRes, isLoading: collectionEventLoad} =
    useApiSelector(apis.collectionEvent.contractAddress.list);
  const {goBack} = useNavigation();
  const gotoNewCollectionEvent = useGotoNewCollectionEvent({nftCollection});
  const reloadGetWithToken = useReloadGETWithToken();
  const onRefresh = () => {
    reloadGetWithToken(
      apis.collectionEvent.contractAddress.list(nftCollection.contract_address),
    );
  };
  return (
    <FeedFlatlistWithHeader
      refreshing={collectionEventLoad}
      onRefresh={onRefresh}
      renderItem={({item, index}) => {
        return (
          <CollectionEvent
            collectionEvent={item}
            itemWidth={DEVICE_WIDTH - 30}
          />
        );
      }}
      data={collectionEventRes ? collectionEventRes.collection_events : []}
      HeaderComponent={
        <>
          <Col itemsStart>
            <Div auto rounded100 onPress={goBack}>
              <ChevronLeft
                width={30}
                height={30}
                color="black"
                strokeWidth={2}
              />
            </Div>
          </Col>
          <Col auto>
            <Span bold fontSize={19}>
              {`${nftCollection.name} 일정`}
            </Span>
          </Col>
          <Col itemsEnd pr7>
            <Div onPress={gotoNewCollectionEvent}>
              <Span info bold fontSize={14}>
                추가
              </Span>
            </Div>
          </Col>
        </>
      }
    />
  );
}
