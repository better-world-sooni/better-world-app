import {MenuView} from '@react-native-menu/menu';
import React from 'react';
import {ActivityIndicator} from 'react-native';
import {ChevronRight} from 'react-native-feather';
import {Colors} from 'src/modules/styles';
import {DrawEventStatus} from 'src/hooks/getDrawEventStatus';
import {useGotoDrawEvent} from 'src/hooks/useGoto';
import useUpdateEventApplication from 'src/hooks/useUpdateEventApplication';
import {IMAGES} from 'src/modules/images';
import {getDate, getNowDifference} from 'src/utils/timeUtils';
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
  return admin == true ? (
    <Div
      mx15
      my8
      px20
      py15
      borderBottom={0.5}
      borderGray200
      border={0.5}
      rounded10
      bgWhite>
      <Div absolute top={-4} right10>
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
      <Div rounded10 overflowHidden border={0.5} borderGray200 mt8>
        <PolymorphicOwner
          showFollowing={false}
          nft={cachedEventApplication.nft}
        />
      </Div>
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
                        : event_application_option.draw_event_option
                            .input_type == EventApplicationInputType.LINK
                        ? '확인 완료'
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
  ) : (
    <Div
      pl30
      pr20
      py20
      borderBottom={0.5}
      borderGray200
      border={0.5}
      onPress={gotoDrawEvent}
      bgWhite>
      <Row itemsCenter>
        <Col auto relative mr12>
          <Img uri={drawEvent.image_uri} h70 w70 rounded10 />
        </Col>
        <Col>
          <DrawEventStatusBanner
            Status={drawEvent?.status}
            expires_at={drawEvent?.expires_at}
          />
          <Div mt5>
            <Span bold fontSize={18} numberOfLines={1} mb3>
              {drawEvent.name}
            </Span>
            <Span bold fontSize={12} numberOfLines={1} gray600>
              {'참여일: '}
              {getDate(drawEvent?.created_at, 'YYYY.MM.DD')}
            </Span>
          </Div>
        </Col>
        <Col auto itemsCenter>
          <ChevronRight
            height={18}
            width={18}
            color={Colors.black}
            strokeWidth={2}
          />
        </Col>
      </Row>
    </Div>
  );
}

const DrawEventStatusBanner = ({Status, expires_at}) => {
  const colors = {
    [DrawEventStatus.FINISHED]: {bgGray500: true},
    [DrawEventStatus.IN_PROGRESS]: {bg: Colors.primary.DEFAULT},
    [DrawEventStatus.ANNOUNCED]: {bg: Colors.secondary.DEFAULT},
  };
  const expireDay = getNowDifference(expires_at);
  const text = {
    [DrawEventStatus.FINISHED]: '마감',
    [DrawEventStatus.IN_PROGRESS]: expires_at
      ? 'D-' + (expireDay > 100 ? '99+' : expireDay == 0 ? 'DAY' : expireDay)
      : '진행 중',
    [DrawEventStatus.ANNOUNCED]: '당첨 발표',
  };
  const status =
    Status == DrawEventStatus.IN_PROGRESS && expires_at && expireDay < 0
      ? DrawEventStatus.FINISHED
      : Status;
  return (
    <Row>
      <Col auto px7 py4 {...colors[status]} rounded5>
        <Span fontSzie={14} bold white>
          {text[status]}
        </Span>
      </Col>
    </Row>
  );
};
