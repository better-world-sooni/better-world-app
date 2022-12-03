import React from 'react';
import {Colors, DEVICE_WIDTH} from 'src/modules/styles';
import {Div} from './Div';
import {Span} from './Span';
import {Row} from './Row';
import {Col} from './Col';
import {FlatList} from 'react-native';
import {OrderableType} from 'src/hooks/useMakeEventApplication';
import {InfoIcon} from 'native-base';
import GradientColorButton from './GradientColorButton';
import useMakeEventApplication from 'src/hooks/useMakeEventApplication';
import {
  DrawEventStatus,
  EventApplicationStatus,
} from 'src/hooks/getDrawEventStatus';
import OrderOption, {OrderOptionForOnce} from './EventApplicationOrderOption';

export const eventApplicationDefaultColor = '#7166F9';
export const eventApplicationNotAppliedColor = Colors.gray[500];

export default function NewEventApplication({drawEvent, setShowNewComment}) {
  const {
    canShow,
    canModify,
    orderableType,
    orderOptions,
    setOrderOptionsListAtIndex,
    isApplied,
    selectIndex,
    drawEventStatus,
    eventApplicationCount,
    eventApplicationStatus,
    applicationLink,
    onPressApply,
  } = useMakeEventApplication({
    drawEvent,
  });
  const slicedOrderOptions = orderOptions.slice(0, selectIndex + 1);
  return (
    <Col pt10 pb20>
      <Row px20 justifyCenter mb10>
        <Div mt={1.5}>
          <InfoIcon
            height={11}
            width={11}
            color={Colors.gray[500]}
            strokeWidth={2}
          />
        </Div>
        {drawEventStatus == DrawEventStatus.IN_PROGRESS &&
          orderableType == OrderableType.ALL && (
            <Span fontSize={12} gray500 ml5>
              <Span fontSize={12} gray500 bold>
                {'누구나'}
              </Span>
              {' 응모 가능한 이벤트입니다.'}
            </Span>
          )}
        {drawEventStatus == DrawEventStatus.IN_PROGRESS &&
          orderableType == OrderableType.HOLDER_ONLY && (
            <Span fontSize={12} gray500 ml5>
              <Span fontSize={12} gray500 bold>
                {drawEvent?.nft_collection?.name}
              </Span>
              {' 홀더만 응모 가능한 이벤트입니다.'}
            </Span>
          )}
        {drawEventStatus != DrawEventStatus.IN_PROGRESS && (
          <Span fontSize={12} gray500 ml5>
            {'이 이벤트는 '}
            <Span fontSize={12} gray500 bold>
              {'마감'}
            </Span>
            {'되었습니다'}
          </Span>
        )}
      </Row>
      {canShow && (
        <>
          <GradientColorButton
            width={DEVICE_WIDTH}
            height={30}
            text={`${eventApplicationCount}명 참여중`}
            onPress={null}
            fontSize={14}
          />
          <FlatList
            showsVerticalScrollIndicator={false}
            keyExtractor={item => (item as any).id}
            ListEmptyComponent={
              <OrderOptionForOnce
                isApplied={isApplied}
                onPressApply={onPressApply}
                applicationLink={applicationLink}
              />
            }
            ListHeaderComponent={
              <Row px20 justifyCenter mt10>
                <Span
                  fontSize={16}
                  ml5
                  color={eventApplicationDefaultColor}
                  bold>
                  {'이벤트 참여 방법'}
                </Span>
              </Row>
            }
            ListFooterComponent={
              isApplied && (
                <Row px20 justifyCenter mt10>
                  <Span
                    fontSize={16}
                    ml5
                    color={eventApplicationDefaultColor}
                    bold>
                    {eventApplicationStatus ==
                      EventApplicationStatus.SELECTED ||
                    eventApplicationStatus == EventApplicationStatus.RECEIVED
                      ? '축하합니다! 당첨되셨습니다.'
                      : '참여가 완료되었습나다.'}
                  </Span>
                </Row>
              )
            }
            data={slicedOrderOptions}
            renderItem={({item, index}) => {
              return (
                <OrderOption
                  orderOption={item}
                  index={index}
                  isFirst={index == 0}
                  isLast={index >= slicedOrderOptions.length - 1}
                  setShowNewComment={setShowNewComment}
                  drawEventId={drawEvent?.id}
                  isFocus={selectIndex == index}
                  canModify={canModify}
                  setOrderOptionsList={value =>
                    setOrderOptionsListAtIndex(index, value)
                  }
                />
              );
            }}></FlatList>
        </>
      )}
    </Col>
  );
}
