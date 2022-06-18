import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {ActivityIndicator} from 'react-native';
import {ChevronLeft} from 'react-native-feather';
import {Col} from 'src/components/common/Col';
import CollectionEvent from 'src/components/common/CollectionEvent';
import {Div} from 'src/components/common/Div';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import apis from 'src/modules/apis';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {useApiSelector} from 'src/redux/asyncReducer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CollectionEventScreen({
  route: {
    params: {collectionEvent, reload},
  },
}) {
  const {data: collectionEventRes, isLoading: collectionEventLoad} = 
    useApiSelector(apis.collectionEvent.collectionEventId);
  const notchHeight = useSafeAreaInsets().top;
  const headerHeight = notchHeight + 50;
  const itemWidth = DEVICE_WIDTH - 30;
  const {goBack} = useNavigation();
  const loading = reload && collectionEventLoad;
  const displayedCollectionEvent = reload
    ? collectionEventRes?.collection_event
    : collectionEvent;
  return (
    <Div flex={1} justifyCenter bgRealBlack>
      <Div h={headerHeight} zIndex={100} absolute top0 bgWhite>
        <Row
          itemsCenter
          py5
          h40
          px8
          zIndex={100}
          absolute
          w={DEVICE_WIDTH}
          top={notchHeight+5}>
          <Col justifyStart>
            <Div auto rounded100 onPress={goBack}>
              <ChevronLeft
                width={30}
                height={30}
                color="white"
                strokeWidth={2}
              />
            </Div>
          </Col>
          <Col auto>
            <Span bold fontSize={19} white>
              {collectionEvent.title}
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
