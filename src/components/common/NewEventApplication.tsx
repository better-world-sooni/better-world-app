import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Colors, DEVICE_WIDTH, varStyle} from 'src/modules/styles';
import {Div} from './Div';
import {Span} from './Span';
import Accordion from 'react-native-collapsible/Accordion';
import {Row} from './Row';
import {Col} from './Col';
import {Check, ArrowRight, Edit2} from 'react-native-feather';
import {HAS_NOTCH} from 'src/modules/constants';
import {ActivityIndicator, Keyboard, Linking, TextInput} from 'react-native';
import useUploadEventApplication, {
  SelectableOrderCategory,
} from 'src/hooks/useUploadEventApplication';
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
import {CheckIcon, ChevronDownIcon, ChevronUpIcon} from 'native-base';
import {useGotoEventApplicationList} from 'src/hooks/useGoto';
import GradientColorButton from './GradientColorButton';

export default function NewEventApplication({drawEvent}) {
  const [expandOptions, setExpandOptions] = useState(-1);
  const gotoEventApplicationList = useGotoEventApplicationList();
  const reloadGETWithToken = useReloadGETWithToken();

  const uploadSuccessCallback = () => {
    reloadGETWithToken(apis.feed.draw_event());
    gotoEventApplicationList();
  };
  const {
    error,
    loading,
    drawEventStatus,
    orderOptions,
    handleSelectOption,
    handleWriteOption,
    uploadEventApplication,
  } = useUploadEventApplication({
    drawEvent,
    uploadSuccessCallback,
  });
  const [canUploadEventApplication, setCanUploadEventApplication] =
    useState(false);
  const orderable = drawEventStatus.orderable;
  const bottomPopupRef = useRef<BottomSheetModal>(null);
  const handlePressInitialOrder = () => {
    if (!orderable) return;
    if (drawEvent.application_link) {
      Linking.openURL(drawEvent.application_link);
    }
    bottomPopupRef?.current?.expand();
  };
  const onChangeBottomSheet = index => {
    setExpandOptions(index);
  };
  return (
    <>
      <Div
        zIndex={100}
        bgWhite
        w={'100%'}
        borderTop={expandOptions == -1 ? 0.5 : 0}
        style={{
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: expandOptions == -1 ? 0.1 : 0,
          shadowRadius: 4,
          elevation: 2,
        }}
        borderColor={varStyle.gray200}>
        <Div px15 py8>
          {orderable &&
          !loading &&
          (expandOptions == -1 ||
            (expandOptions != -1 && canUploadEventApplication)) ? (
            <GradientColorButton
              borderRadius={10}
              text={'응모하기'}
              width={DEVICE_WIDTH - 30}
              height={50}
              fontSize={16}
              onPress={
                orderable &&
                (expandOptions == -1
                  ? !(
                      drawEvent?.draw_event_options == null ||
                      (drawEvent?.draw_event_options &&
                        drawEvent?.draw_event_options.length == 0)
                    ) || drawEvent?.application_link
                    ? !loading && handlePressInitialOrder
                    : !loading && uploadEventApplication
                  : canUploadEventApplication &&
                    (() => {
                      bottomPopupRef?.current?.close();
                      uploadEventApplication();
                    }))
              }
            />
          ) : (
            <Row itemsCenter>
              <Col>
                <Div
                  h50
                  rounded10
                  itemsCenter
                  justifyCenter
                  bgGray400
                  onPress={
                    orderable &&
                    (expandOptions == -1
                      ? !(
                          drawEvent?.draw_event_options == null ||
                          (drawEvent?.draw_event_options &&
                            drawEvent?.draw_event_options.length == 0)
                        ) || drawEvent?.application_link
                        ? !loading && handlePressInitialOrder
                        : !loading && uploadEventApplication
                      : canUploadEventApplication &&
                        (() => {
                          bottomPopupRef?.current?.close();
                          uploadEventApplication();
                        }))
                  }>
                  <Span white bold>
                    {loading ? <ActivityIndicator /> : '응모하기'}
                  </Span>
                </Div>
              </Col>
            </Row>
          )}
        </Div>
        <Div h={HAS_NOTCH ? 27 : 12} bgWhite />
      </Div>
      <BottomPopupOptions
        bottomPopupRef={bottomPopupRef}
        onChangeBottomSheet={onChangeBottomSheet}
        error={error}
        orderOptions={orderOptions}
        handleSelectOption={handleSelectOption}
        handleWriteOption={handleWriteOption}
        setCanUploadEventApplication={setCanUploadEventApplication}
        expanded={expandOptions != -1}
      />
    </>
  );
}

const BottomPopupOptions = ({
  bottomPopupRef,
  onChangeBottomSheet,
  error,
  orderOptions,
  handleSelectOption,
  handleWriteOption,
  setCanUploadEventApplication,
  expanded,
}) => {
  return (
    <BottomPopup
      ref={bottomPopupRef}
      snapPoints={useMemo(() => ['85%'], [])}
      enableContentPanningGesture={true}
      index={-1}
      onChange={onChangeBottomSheet}
      onClose={() => Keyboard.dismiss()}
      bottomInset={60}>
      <BottomSheetScrollView
        style={{
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 10,
          paddingBottom: 10,
        }}>
        <Row itemsCenter>
          <Col>
            <Div mb8>
              {error ? (
                <Span danger bold>
                  {error}
                </Span>
              ) : (
                <Span mb2 />
              )}
            </Div>
            {orderOptions.length > 0 && (
              <Div mb8>
                <OrderCategories
                  orderCategories={orderOptions}
                  handleSelectOption={handleSelectOption}
                  handleWriteOption={handleWriteOption}
                  setCanUploadEventApplication={setCanUploadEventApplication}
                  expanded={expanded}
                />
              </Div>
            )}
          </Col>
        </Row>
      </BottomSheetScrollView>
    </BottomPopup>
  );
};

function OrderCategories({
  orderCategories,
  handleSelectOption,
  handleWriteOption,
  setCanUploadEventApplication,
  expanded,
}) {
  const getNextSection = (index = orderCategories.length) => {
    const nextIndex = orderCategories.reduce(
      (nextIndex, orderCategory, idx) =>
        orderCategory.selectedOption == null && idx != index && idx < nextIndex
          ? idx
          : nextIndex,
      orderCategories.length,
    );
    if (nextIndex >= orderCategories.length) {
      setCanUploadEventApplication(true);
      return null;
    } else return nextIndex;
  };
  const [activeSection, setActiveSection] = useState(getNextSection());
  const handlePressSection = index => {
    if (index == activeSection) setActiveSection(null);
    else setActiveSection(index);
  };
  const handleNextSection = index => {
    setActiveSection(getNextSection(index));
  };
  return (
    <Div border={0.5} borderGray200 rounded10 overflowHidden>
      <Accordion
        activeSections={[activeSection]}
        sections={orderCategories as SelectableOrderCategory[]}
        underlayColor={Colors.opacity[100]}
        renderHeader={(content, index) =>
          content.inputType == EventApplicationInputType.SELECT ? (
            <Row
              wFull
              py12
              px16
              borderBottom={index == orderCategories.length - 1 ? 0 : 0.5}
              borderGray200
              itemsCenter
              onPress={() => handlePressSection(index)}>
              <Col>
                <Span bold fontSize={16}>
                  {content.name}
                </Span>
              </Col>
              <Col auto>
                {content.selectedOption && (
                  <Span mr10>{content.selectedOption.name}</Span>
                )}
                {!content.selectedOption && (
                  <Span>
                    {activeSection == index ? (
                      <ChevronUpIcon
                        strokeWidth={2}
                        color={Colors.black}
                        height={18}
                        width={18}
                        style={{marginRight: 10}}
                      />
                    ) : (
                      <ChevronDownIcon
                        strokeWidth={2}
                        color={Colors.gray['400']}
                        height={18}
                        width={18}
                        style={{marginRight: 10}}
                      />
                    )}
                  </Span>
                )}
              </Col>
            </Row>
          ) : (
            <WriteOption
              props={{
                wFull: true,
                py: 2,
                px: 8,
                borderBottom: index == orderCategories.length - 1 ? 0 : 0.5,
                borderGray200: true,
              }}
              orderCategory={content}
              orderCategoryIndex={index}
              activeSection={activeSection}
              onPressToNext={handleNextSection}
              onWriteOption={handleWriteOption}
              inputType={content.inputType}
              setCanUploadEventApplication={setCanUploadEventApplication}
              onPress={() => handlePressSection(index)}
              setActiveSection={setActiveSection}
              expanded={expanded}
            />
          )
        }
        renderContent={(content, index) =>
          content.inputType == EventApplicationInputType.SELECT ? (
            <OrderOptions
              orderCategory={content}
              orderCategoryIndex={index}
              onPressOption={handleSelectOption}
              onPressToNext={handleNextSection}
            />
          ) : null
        }
        onChange={() => {}}
      />
    </Div>
  );
}

function OrderOptions({
  orderCategory,
  orderCategoryIndex,
  onPressOption,
  onPressToNext,
}) {
  return (
    <>
      {orderCategory.options.map((option, index) => (
        <Row
          wFull
          py12
          px16
          bgGray100
          itemsCenter
          onPress={() => {
            onPressOption(orderCategoryIndex, index);
            onPressToNext(orderCategoryIndex);
          }}>
          <Col>
            <Span fontSize={14}>{option.name}</Span>
          </Col>
          <Col auto>
            {option.selected && (
              <Check
                height={16}
                color={Colors.primary.DEFAULT}
                strokeWidth={2}
              />
            )}
          </Col>
        </Row>
      ))}
    </>
  );
}

const WriteOption = ({
  orderCategoryIndex,
  activeSection,
  onPressToNext,
  onWriteOption,
  inputType,
  onPress,
  orderCategory,
  setCanUploadEventApplication,
  props,
  setActiveSection,
  expanded,
}) => {
  const {data} = useApiSelector(apis.nft._());
  if (inputType == EventApplicationInputType.TWITTER_ID) {
    const {
      twitterId,
      twitterProfileLink,
      twitterIdError,
      isError,
      handlePressTwitterLink,
      handleChangeTwitterId,
    } = useTwitterId({twitter_id: data?.nft?.twitter_id});
    return (
      <BasicInput
        id={twitterId}
        handleChangeId={handleChangeTwitterId}
        idProfileLink={twitterProfileLink}
        handlePressLink={handlePressTwitterLink}
        idError={twitterIdError}
        inputType={inputType}
        placeholder={'Twitter ID'}
        props={props}
        orderCategoryIndex={orderCategoryIndex}
        activeSection={activeSection}
        onPressToNext={onPressToNext}
        onWriteOption={onWriteOption}
        onPress={onPress}
        isError={isError}
        setCanUploadEventApplication={setCanUploadEventApplication}
        setActiveSection={setActiveSection}
        expanded={expanded}
      />
    );
  } else if (inputType == EventApplicationInputType.DISCORD_ID) {
    const {
      discordId,
      discordProfileLink,
      discordIdError,
      isError,
      handlePressDiscordLink,
      handleChangeDiscordId,
    } = useDiscordId({discord_id: data?.nft?.discord_id});
    return (
      <BasicInput
        id={discordId}
        handleChangeId={handleChangeDiscordId}
        idProfileLink={discordProfileLink}
        handlePressLink={handlePressDiscordLink}
        idError={discordIdError}
        inputType={inputType}
        placeholder={'Discord#8888'}
        props={props}
        orderCategoryIndex={orderCategoryIndex}
        activeSection={activeSection}
        onPressToNext={onPressToNext}
        onWriteOption={onWriteOption}
        onPress={onPress}
        isError={isError}
        setCanUploadEventApplication={setCanUploadEventApplication}
        setActiveSection={setActiveSection}
        expanded={expanded}
      />
    );
  } else {
    const {text, textError, handleChangeText, isError} = useOptionValue();
    return (
      <BasicInput
        id={text}
        handleChangeId={handleChangeText}
        idProfileLink={null}
        handlePressLink={null}
        idError={textError}
        inputType={inputType}
        placeholder={orderCategory.name}
        props={props}
        orderCategoryIndex={orderCategoryIndex}
        activeSection={activeSection}
        onPressToNext={onPressToNext}
        onWriteOption={onWriteOption}
        onPress={onPress}
        isError={isError}
        setCanUploadEventApplication={setCanUploadEventApplication}
        setActiveSection={setActiveSection}
        expanded={expanded}
      />
    );
  }
};

const BasicInput = ({
  id,
  handleChangeId,
  idProfileLink,
  handlePressLink,
  idError,
  inputType,
  placeholder,
  orderCategoryIndex,
  activeSection,
  onPressToNext,
  onWriteOption,
  onPress,
  props,
  isError,
  setCanUploadEventApplication,
  setActiveSection,
  expanded,
}) => {
  const ref = useRef<TextInput | null>(null);
  useEffect(() => {
    if (expanded && activeSection == orderCategoryIndex) ref.current?.focus();
  }, [expanded, activeSection]);
  const [focus, setFocus] = useState(false);
  const onFocus = () => {
    setActiveSection(orderCategoryIndex);
    setFocus(true);
  };
  return (
    <Col auto {...props} onPress={onPress}>
      <Row px15 py15 itemsCenter>
        <Col auto w50>
          {inputType != EventApplicationInputType.CUSTOM_INPUT && (
            <Img
              h={23}
              w={23}
              source={
                inputType == EventApplicationInputType.TWITTER_ID
                  ? ICONS.twitter
                  : ICONS.discord
              }
            />
          )}
          {inputType == EventApplicationInputType.CUSTOM_INPUT && (
            <Edit2
              strokeWidth={2}
              color={Colors.black}
              height={18}
              width={18}
            />
          )}
        </Col>
        <Col>
          <TextInput
            ref={ref}
            value={id}
            style={{fontSize: 16, fontWeight: '500'}}
            placeholderTextColor={Colors.gray[600]}
            onChangeText={value => {
              handleChangeId(value);
              onWriteOption(orderCategoryIndex, isError(value) ? null : value);
              isError(value) && setCanUploadEventApplication(false);
            }}
            onSubmitEditing={() => {
              !idError && onPressToNext(orderCategoryIndex);
            }}
            placeholder={placeholder}
            onFocus={onFocus}
            onBlur={() => setFocus(false)}
          />
        </Col>
        {!focus && inputType != EventApplicationInputType.CUSTOM_INPUT && (
          <Col auto onPress={!idError && idProfileLink && handlePressLink}>
            <ArrowRight
              strokeWidth={2}
              color={Colors.gray[!idError && idProfileLink ? '600' : '400']}
              height={18}
              width={18}
            />
          </Col>
        )}
        {focus && !isError(id) && (
          <Col auto onPress={() => onPressToNext(orderCategoryIndex)}>
            <CheckIcon
              strokeWidth={2}
              color={Colors.primary.DEFAULT}
              height={18}
              width={18}
              style={{marginRight: 2}}
            />
          </Col>
        )}
      </Row>
      {idError ? (
        <Div px15>
          <Span danger mb5>
            {idError}
          </Span>
        </Div>
      ) : null}
    </Col>
  );
};
