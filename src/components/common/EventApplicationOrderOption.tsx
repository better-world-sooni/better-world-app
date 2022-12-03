import React, {useEffect, useRef, useState} from 'react';
import {Colors} from 'src/modules/styles';
import {Div} from './Div';
import {Span} from './Span';
import {Row} from './Row';
import {Col} from './Col';
import {X} from 'react-native-feather';
import {ActivityIndicator, TextInput} from 'react-native';
import {EventApplicationInputType} from '../NewEventApplicationOptions';
import {CheckIcon} from 'native-base';
import GradientColorButton from './GradientColorButton';
import useUploadEventApplication from 'src/hooks/useUploadEventApplication';
import {MenuView} from '@react-native-menu/menu';
import {
  eventApplicationDefaultColor,
  eventApplicationNotAppliedColor,
} from './NewEventApplication';

export default function OrderOption({
  orderOption,
  index,
  isFirst,
  isLast,
  setShowNewComment,
  drawEventId,
  setOrderOptionsList,
  canModify,
  isFocus,
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
    setFocus,
    error,
    autoId,
  } = useUploadEventApplication({
    orderOption,
    drawEventId,
    setOrderOptionsList,
  });
  useEffect(() => {
    setFocus(isFocus);
  }, [isFocus]);
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
                ? eventApplicationDefaultColor
                : eventApplicationNotAppliedColor
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
                      ? eventApplicationDefaultColor
                      : eventApplicationNotAppliedColor
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
                      ? eventApplicationDefaultColor
                      : eventApplicationNotAppliedColor
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
            borderColor={eventApplicationNotAppliedColor}
            border={0.8}
            itemsCenter
            justifyCenter>
            <Span fontSize={16} bold color={eventApplicationNotAppliedColor}>
              {index + 1}
            </Span>
          </Col>
        )}
        <Col
          itemsCenter
          justifyCenter
          ml20
          minH={circleRadius * 2}
          border={0.5}
          rounded15
          py12
          px15
          onPress={onPressShowDetail}
          borderColor={
            error
              ? Colors.danger.DEFAULT
              : isApplied
              ? eventApplicationDefaultColor
              : eventApplicationNotAppliedColor
          }>
          <Span
            fontSize={16}
            color={
              error
                ? Colors.danger.DEFAULT
                : isApplied
                ? eventApplicationDefaultColor
                : eventApplicationNotAppliedColor
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
                ? eventApplicationDefaultColor
                : eventApplicationNotAppliedColor
            }>
            {showDetail && (
              <>
                {inputType == EventApplicationInputType.SELECT && (
                  <SelectOptionMenu
                    handleSelectOption={handleSelectOption}
                    optionTypes={optionTypes}
                    fontColor={
                      !isChanged && isApplied
                        ? eventApplicationDefaultColor
                        : eventApplicationNotAppliedColor
                    }
                    fontSize={16}
                    canModify={canModify}
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
                        ? eventApplicationDefaultColor
                        : eventApplicationNotAppliedColor
                    }
                    detailText={detailText}
                    editableText={editableText}
                    handleWriteEditableOption={handleWriteEditableOption}
                    handleSubmitWritableOption={handleSubmitWritableOption}
                    setShowNewComment={setShowNewComment}
                    autoId={autoId}
                    canModify={canModify}
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
  canModify,
}) => {
  return canModify ? (
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
  ) : (
    <Col itemsCenter justifyCenter>
      <Row itemsCenter justifyCenter>
        <Span fontSize={fontSize} color={fontColor} bold>
          {detailText}
        </Span>
      </Row>
    </Col>
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
  canModify,
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
      onPress={canModify && onPress}
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
            autoCapitalize={'none'}
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

export function OrderOptionForOnce({isApplied, onPressApply, applicationLink}) {
  const marginY = 10;
  const lineLength = 5;
  const circleRadius = 28;
  return (
    <Col px30>
      <Row itemsCenter>
        <Div
          h={marginY}
          w={0}
          ml={circleRadius - 0}
          mr={circleRadius - 0}
          borderBottomLeftRadius={lineLength / 2}
          borderBottomRightRadius={lineLength / 2}
          bgGray300></Div>
      </Row>
      <Row my5 itemsCenter>
        {isApplied ? (
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
            borderColor={eventApplicationNotAppliedColor}
            border={0.8}
            itemsCenter
            justifyCenter>
            <Span fontSize={16} bold color={eventApplicationNotAppliedColor}>
              1
            </Span>
          </Col>
        )}
        <Col
          itemsCenter
          justifyCenter
          ml20
          minH={circleRadius * 2}
          border={0.5}
          rounded15
          py12
          px15
          onPress={onPressApply}
          borderColor={
            isApplied
              ? eventApplicationDefaultColor
              : eventApplicationNotAppliedColor
          }>
          <Span
            fontSize={16}
            color={
              isApplied
                ? eventApplicationDefaultColor
                : eventApplicationNotAppliedColor
            }
            bold>
            {applicationLink && applicationLink != ''
              ? '링크를 통해 응모하기'
              : '응모하기'}
          </Span>
        </Col>
      </Row>
      <Row itemsCenter>
        <Row
          style={{height: '100%'}}
          w={0}
          ml={circleRadius - 0}
          mr={circleRadius - 0}
          borderTopLeftRadius={lineLength / 2}
          borderTopRightRadius={lineLength / 2}
          bgGray300></Row>
        <Col ml20>
          <Col
            itemsCenter
            justifyCenter
            h={0}
            border={0}
            rounded15
            mt={marginY}
            mb={0}
            borderColor={
              isApplied
                ? eventApplicationDefaultColor
                : eventApplicationNotAppliedColor
            }></Col>
        </Col>
      </Row>
    </Col>
  );
}
