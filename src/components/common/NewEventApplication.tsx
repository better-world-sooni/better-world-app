import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Colors, DEVICE_WIDTH, varStyle} from 'src/modules/styles';
import {Div} from './Div';
import {Span} from './Span';
import Accordion from 'react-native-collapsible/Accordion';
import {Row} from './Row';
import {Col} from './Col';
import {Check, ArrowRight, Edit2, X, XCircle} from 'react-native-feather';
import {HAS_NOTCH} from 'src/modules/constants';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Linking,
  TextInput,
} from 'react-native';
import {
  OrderableType,
  SelectableOrderCategory,
} from 'src/hooks/useMakeEventApplication';
import BottomPopup from './BottomPopup';
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {Img} from './Img';
import {ICONS} from 'src/modules/icons';
import useTwitterId from 'src/hooks/useTwitterId';
import {EventApplicationInputType} from '../NewEventApplicationOptions';
import useDiscordId from 'src/hooks/useDiscordId';
import useOptionValue from 'src/hooks/useOptionValue';
import {useApiSelector, useReloadGETWithToken} from 'src/redux/asyncReducer';
import apis from 'src/modules/apis';
import {CheckIcon, InfoIcon} from 'native-base';
import {useGotoEventApplicationList} from 'src/hooks/useGoto';
import GradientColorButton from './GradientColorButton';
import useMakeEventApplication from 'src/hooks/useMakeEventApplication';
import useUploadEventApplication from 'src/hooks/useUploadEventApplication';
import {MenuView} from '@react-native-menu/menu';

const defaultColor = '#7166F9';
const notAppliedColor = Colors.gray[500];

export default function NewEventApplication({drawEvent, setShowNewComment}) {
  // const uploadSuccessCallback = () => {
  //   reloadGETWithToken(apis.feed.draw_event._());
  //   gotoEventApplicationList();
  // };
  const {orderable, orderableType, drawEventStatus, orderOptions} =
    useMakeEventApplication({
      drawEvent,
    });
  // const [canUploadEventApplication, setCanUploadEventApplication] =
  //   useState(false);
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
        {orderableType == OrderableType.ALL && (
          <Span fontSize={12} gray500 ml5>
            <Span fontSize={12} gray500 bold>
              {'누구나'}
            </Span>
            {' 응모 가능한 이벤트입니다.'}
          </Span>
        )}
        {orderableType == OrderableType.HOLDER_ONLY && (
          <Span fontSize={12} gray500 ml5>
            <Span fontSize={12} gray500 bold>
              {drawEvent?.nft_collection?.name}
            </Span>
            {' 홀더만 응모 가능한 이벤트입니다.'}
          </Span>
        )}
      </Row>
      {orderable && (
        <>
          <GradientColorButton
            width={DEVICE_WIDTH}
            height={30}
            text={`${
              drawEvent?.event_application_count
                ? drawEvent?.event_application_count
                : 0
            }명 참여중`}
            onPress={null}
            fontSize={14}
          />
          <FlatList
            showsVerticalScrollIndicator={false}
            keyExtractor={item => (item as any).id}
            ListEmptyComponent={<Div></Div>}
            ListHeaderComponent={
              <Row px20 justifyCenter mt10>
                <Span fontSize={16} ml5 color={defaultColor} bold>
                  {'이벤트 참여 방법'}
                </Span>
              </Row>
            }
            data={orderOptions}
            renderItem={({item, index}) => {
              return (
                <OrderOption
                  orderOption={item}
                  index={index}
                  isFirst={index == 0}
                  isLast={index >= orderOptions.length - 1}
                  setShowNewComment={setShowNewComment}
                  drawEventId={drawEvent?.id}
                />
              );
            }}></FlatList>
        </>
      )}
    </Col>
  );
}

function OrderOption({
  orderOption,
  index,
  isFirst,
  isLast,
  setShowNewComment,
  drawEventId,
}) {
  const marginY = 10;
  const lineLength = 5;
  const circleRadius = 28;
  const {
    cachedOrderOption,
    showDetail,
    onPressShowDetail,
    isApplied,
    isChanged,
    loading,
    detailText,
    optionTypes,
    handleSelectOption,
    inputType,
    editableText,
    handleWriteEditableOption,
    handleSubmitWritableOption,
    error,
    autoId,
  } = useUploadEventApplication({orderOption, drawEventId});
  return (
    <Col px30>
      <Row itemsCenter>
        <Div
          h={marginY}
          w={isFirst ? 0 : lineLength}
          ml={circleRadius - (isFirst ? 0 : lineLength / 2)}
          mr={circleRadius - (isFirst ? 0 : lineLength / 2)}
          borderBottomLeftRadius={lineLength / 2}
          borderBottomRightRadius={lineLength / 2}
          bgGray300></Div>
      </Row>
      <Row my5 itemsCenter>
        {isChanged ? (
          <Col
            h={circleRadius * 2}
            w={circleRadius * 2}
            borderRadius={circleRadius}
            borderColor={
              error
                ? Colors.danger.DEFAULT
                : isApplied
                ? defaultColor
                : notAppliedColor
            }
            border={0.8}
            itemsCenter
            justifyCenter>
            <Div>
              {loading ? (
                <ActivityIndicator />
              ) : error ? (
                <X
                  height={circleRadius / 1.2}
                  width={circleRadius / 1.2}
                  color={
                    error
                      ? Colors.danger.DEFAULT
                      : isApplied
                      ? defaultColor
                      : notAppliedColor
                  }
                  strokeWidth={3.2}
                />
              ) : (
                <CheckIcon
                  height={circleRadius / 1.5}
                  width={circleRadius / 1.5}
                  color={
                    error
                      ? Colors.danger.DEFAULT
                      : isApplied
                      ? defaultColor
                      : notAppliedColor
                  }
                  strokeWidth={1}
                />
              )}
            </Div>
          </Col>
        ) : isApplied ? (
          <GradientColorButton
            width={circleRadius * 2}
            height={circleRadius * 2}
            text={
              <Div mt={-circleRadius / (1.5 * 3)}>
                <CheckIcon
                  height={circleRadius / 1.5}
                  width={circleRadius / 1.5}
                  color={Colors.white}
                  strokeWidth={1}
                />
              </Div>
            }
            onPress={null}
            fontSize={13}
            borderRadius={circleRadius}
          />
        ) : (
          <Col
            h={circleRadius * 2}
            w={circleRadius * 2}
            borderRadius={circleRadius}
            borderColor={notAppliedColor}
            border={0.8}
            itemsCenter
            justifyCenter>
            <Span fontSize={16} bold color={notAppliedColor}>
              {index + 1}
            </Span>
          </Col>
        )}
        <Col
          itemsCenter
          justifyCenter
          ml20
          h={circleRadius * 2}
          border={0.5}
          rounded15
          onPress={onPressShowDetail}
          borderColor={
            error
              ? Colors.danger.DEFAULT
              : isApplied
              ? defaultColor
              : notAppliedColor
          }>
          <Span
            fontSize={16}
            color={
              error
                ? Colors.danger.DEFAULT
                : isApplied
                ? defaultColor
                : notAppliedColor
            }
            bold>
            {cachedOrderOption.name}
          </Span>
        </Col>
      </Row>
      <Row itemsCenter>
        <Row
          style={{height: '100%'}}
          w={isLast ? 0 : lineLength}
          ml={circleRadius - (isLast ? 0 : lineLength / 2)}
          mr={circleRadius - (isLast ? 0 : lineLength / 2)}
          borderTopLeftRadius={lineLength / 2}
          borderTopRightRadius={lineLength / 2}
          bgGray300></Row>
        <Col ml20>
          <Col
            itemsCenter
            justifyCenter
            h={showDetail ? circleRadius * 2 : 0}
            border={showDetail ? 0.5 : 0}
            rounded15
            mt={marginY}
            mb={showDetail ? marginY : 0}
            borderColor={
              error
                ? Colors.danger.DEFAULT
                : !isChanged && isApplied
                ? defaultColor
                : notAppliedColor
            }>
            {showDetail && (
              <>
                {inputType == EventApplicationInputType.SELECT && (
                  <SelectOptionMenu
                    handleSelectOption={handleSelectOption}
                    optionTypes={optionTypes}
                    fontColor={
                      !isChanged && isApplied ? defaultColor : notAppliedColor
                    }
                    fontSize={16}
                    detailText={detailText}
                  />
                )}
                {inputType != EventApplicationInputType.SELECT && (
                  <WriteOptionInput
                    fontSize={16}
                    fontColor={
                      error
                        ? Colors.danger.DEFAULT
                        : !isChanged && isApplied
                        ? defaultColor
                        : notAppliedColor
                    }
                    detailText={detailText}
                    editableText={editableText}
                    handleWriteEditableOption={handleWriteEditableOption}
                    handleSubmitWritableOption={handleSubmitWritableOption}
                    setShowNewComment={setShowNewComment}
                    autoId={autoId}
                  />
                )}
              </>
            )}
          </Col>
          {showDetail && error && (
            <Span color={Colors.danger.DEFAULT}>{error}</Span>
          )}
        </Col>
      </Row>
    </Col>
  );
}

const SelectOptionMenu = ({
  handleSelectOption,
  optionTypes,
  fontColor,
  fontSize = 16,
  detailText,
}) => {
  return (
    <MenuView
      onPressAction={handleSelectOption}
      actions={optionTypes}
      style={{height: '100%', width: '100%'}}>
      <Col itemsCenter justifyCenter>
        <Row itemsCenter justifyCenter>
          <Span fontSize={fontSize} color={fontColor} bold>
            {detailText}
          </Span>
        </Row>
      </Col>
    </MenuView>
  );
};

const WriteOptionInput = ({
  fontColor,
  fontSize = 16,
  detailText,
  editableText,
  handleWriteEditableOption,
  handleSubmitWritableOption,
  setShowNewComment,
  autoId,
}) => {
  const [pressed, setPresed] = useState(false);
  const onPress = () => {
    if (pressed == false) {
      setPresed(true);
      setShowNewComment(false);
      if (autoId) handleWriteEditableOption(autoId);
    } else setPresed(false);
  };
  const ref = useRef<TextInput | null>(null);
  useEffect(() => {
    if (pressed) ref.current?.focus();
  }, [pressed]);
  const onBlur = async () => {
    setPresed(false);
    setShowNewComment(true);
    await handleSubmitWritableOption();
  };
  return (
    <Col
      itemsCenter
      justifyCenter
      onPress={onPress}
      style={{height: '100%', width: '100%'}}>
      <Row itemsCenter justifyCenter>
        {pressed ? (
          <TextInput
            ref={ref}
            value={editableText}
            style={{fontSize: fontSize, color: fontColor}}
            placeholderTextColor={fontColor}
            onChangeText={handleWriteEditableOption}
            placeholder={'입력'}
            onBlur={onBlur}
          />
        ) : (
          <Span fontSize={fontSize} color={fontColor}>
            {detailText}
          </Span>
        )}
      </Row>
    </Col>
  );
};
