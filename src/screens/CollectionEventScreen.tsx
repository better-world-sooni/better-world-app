import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {ActivityIndicator} from 'react-native';
import {ChevronLeft, X} from 'react-native-feather';
import {Col} from 'src/components/common/Col';
import CollectionEvent from 'src/components/common/CollectionEvent';
import {Div} from 'src/components/common/Div';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import apis from 'src/modules/apis';
import {Colors, DEVICE_WIDTH} from 'src/modules/styles';
import {useApiSelector} from 'src/redux/asyncReducer';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export default function CollectionEventScreen({
  route: {
    params: {collectionEvent, reload},
  },
}) {
  const {data: collectionEventRes, isLoading: collectionEventLoad} =
    useApiSelector(apis.collectionEvent.collectionEventId);
  const headerHeight = 50;
  const itemWidth = DEVICE_WIDTH - 30;
  const {goBack} = useNavigation();
  const loading = reload && collectionEventLoad;
  const displayedCollectionEvent = reload
    ? collectionEventRes?.collection_event
    : collectionEvent;
  return (
    <Div flex={1} justifyCenter bgWhite>
      <Div
        h={headerHeight}
        w={DEVICE_WIDTH}
        zIndex={100}
        absolute
        top0
        bgWhite
        borderBottom={0.5}
        borderGray200
        justifyCenter>
        <Row itemsCenter py5 h40 px15>
          <Col justifyStart>
            <Div auto rounded100 onPress={goBack}>
              <X width={30} height={30} color={Colors.black} strokeWidth={2} />
            </Div>
          </Col>
          <Col auto>
            <Span bold fontSize={17}>
              {collectionEvent.title} 초대장
            </Span>
          </Col>
          <Col />
        </Row>
      </Div>
      <Div>
        {loading ? (
          <ActivityIndicator size={'large'} />
        ) : (
          <CollectionEvent
            collectionEvent={displayedCollectionEvent}
            full
            itemWidth={itemWidth}
          />
        )}
      </Div>
    </Div>
  );
}
