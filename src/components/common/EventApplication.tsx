import {MenuView} from '@react-native-menu/menu';
import React from 'react';
import {ActivityIndicator} from 'react-native';
import {useGotoDrawEvent} from 'src/hooks/useGoto';
import useUpdateEventApplication from 'src/hooks/useUpdateEventApplication';
import {IMAGES} from 'src/modules/images';
import {EventApplicationInputType} from '../NewEventApplicationOptions';
import PolymorphicOwner from '../PolymorphicOwner';
import {Col} from './Col';
import {Div} from './Div';
import {Img} from './Img';
import {Row} from './Row';
import {Span} from './Span';

enum EventApplicationStatus {
  APPLIED = 0,
  SELECTED = 1,
  RECEIVED = 2,
}
const airdropTypes = [
  {
    id: `${EventApplicationStatus.APPLIED}`,
    title: '응모 완료',
  },
  {
    id: `${EventApplicationStatus.SELECTED}`,
    title: '당첨',
  },
  {
    id: `${EventApplicationStatus.RECEIVED}`,
    title: '수령 완료',
  },
];

export default function EventApplication({eventApplication, admin = false}) {
  const {
    eventApplication: cachedEventApplication,
    loading,
    updateEventApplicationStatus,
  } = useUpdateEventApplication({initialEventApplication: eventApplication});
  const handlePressStatus = ({nativeEvent: {event}}) => {
    updateEventApplicationStatus(parseInt(event));
  };
  const drawEvent = cachedEventApplication.draw_event;
  const gotoDrawEvent = useGotoDrawEvent({
    drawEventId: drawEvent.id,
    image_uri: drawEvent?.image_uri
      ? drawEvent.image_uri
      : drawEvent?.image_uris && drawEvent.image_uris.length != 0
      ? drawEvent.image_uris[0]
      : null,
    hasApplication: drawEvent.has_application,
  });
  const status =
    cachedEventApplication.status == EventApplicationStatus.APPLIED
      ? '응모 완료'
      : cachedEventApplication.status == EventApplicationStatus.SELECTED
      ? '당첨'
      : '수령 완료';
  return (
    <Div
      mx15
      my8
      px20
      py15
      borderBottom={0.5}
      borderGray200
      border={0.5}
      rounded10>
      <Div absolute top={-4} right10>
        {admin ? (
          <MenuView onPressAction={handlePressStatus} actions={airdropTypes}>
            {loading ? (
              <ActivityIndicator />
            ) : cachedEventApplication.status ==
              EventApplicationStatus.RECEIVED ? (
              <Img source={IMAGES.received} w={35} h={(35 * 183) / 152}></Img>
            ) : cachedEventApplication.status ==
              EventApplicationStatus.SELECTED ? (
              <Img source={IMAGES.selected} w={35} h={(35 * 183) / 152}></Img>
            ) : (
              <Img source={IMAGES.applied} w={35} h={(35 * 183) / 152}></Img>
            )}
          </MenuView>
        ) : cachedEventApplication.status == EventApplicationStatus.SELECTED ? (
          <Img source={IMAGES.selected} w={35} h={(35 * 183) / 152}></Img>
        ) : null}
      </Div>
      <Row itemsCenter>
        <Col auto relative mr12 onPress={gotoDrawEvent}>
          <Img uri={drawEvent.image_uri} h60 w60 rounded10 />
        </Col>
        <Col>
          <Div mt4>
            <Span bold fontSize={14} numberOfLines={1}>
              {drawEvent.name}
            </Span>
          </Div>
        </Col>
      </Row>
      {admin && (
        <Div rounded10 overflowHidden border={0.5} borderGray200 mt8>
          <PolymorphicOwner
            showFollowing={false}
            nft={cachedEventApplication.nft}
          />
        </Div>
      )}
      {cachedEventApplication.event_application_options?.length > 0 && (
        <Div mt16>
          <Span bold fontSize={16} mb8 primary>
            선택된 옵션
          </Span>
          {cachedEventApplication.event_application_options.map(
            event_application_option => {
              return (
                <Row itemsCenter py2>
                  <Col auto pr8>
                    <Span gray600>
                      {event_application_option.draw_event_option.category} :
                    </Span>
                  </Col>
                  <Col>
                    <Span bold>
                      {event_application_option.draw_event_option.input_type ==
                      EventApplicationInputType.SELECT
                        ? event_application_option.draw_event_option.name
                        : event_application_option.value}
                    </Span>
                  </Col>
                </Row>
              );
            },
          )}
        </Div>
      )}
    </Div>
  );
}
