import {MenuView} from '@react-native-menu/menu';
import React from 'react';
import {ActivityIndicator} from 'react-native';
import {useGotoDrawEvent} from 'src/hooks/useGoto';
import useUpdateEventApplication from 'src/hooks/useUpdateEventApplication';
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
  const gotoDrawEvent = useGotoDrawEvent({drawEventId: drawEvent.id});
  const status =
    cachedEventApplication.status == EventApplicationStatus.APPLIED
      ? '응모 완료'
      : cachedEventApplication.status == EventApplicationStatus.SELECTED
      ? '당첨'
      : '수령 완료';
  return (
    <Div px15 py8 borderBottom={0.5} borderGray200>
      <Row itemsCenter>
        <Col auto relative mr12 onPress={gotoDrawEvent}>
          <Img uri={drawEvent.image_uri} h100 w100 rounded10 />
        </Col>
        <Col>
          <Div>
            <Span gray700 bold numberOfLines={1}>
              {drawEvent.name}
            </Span>
          </Div>
          <Div mt4>
            <Span bold fontSize={19} numberOfLines={1}>
              {drawEvent.giveaway_merchandise}
            </Span>
          </Div>
          <Row mt8 itemsCenter>
            <Col
              rounded10
              p8
              auto
              bgInfo={
                cachedEventApplication.status == EventApplicationStatus.RECEIVED
              }
              bgSuccess={
                cachedEventApplication.status == EventApplicationStatus.SELECTED
              }
              bgBlack={
                cachedEventApplication.status == EventApplicationStatus.APPLIED
              }>
              {admin ? (
                <MenuView
                  onPressAction={handlePressStatus}
                  actions={airdropTypes}>
                  <Span fontSize={17} bold white>
                    {loading ? <ActivityIndicator /> : status}
                  </Span>
                </MenuView>
              ) : (
                <Span bold fontSize={17} white>
                  {status}
                </Span>
              )}
            </Col>
            <Col></Col>
          </Row>
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
        <Div p16 mt8 border={0.5} rounded10 borderGray200>
          <Span bold fontSize={16} mb8 info>
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
