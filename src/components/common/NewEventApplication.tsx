import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Colors, varStyle} from 'src/modules/styles';
import {Div} from './Div';
import {Span} from './Span';
import Accordion from 'react-native-collapsible/Accordion';
import {Row} from './Row';
import {Col} from './Col';
import {Check, ArrowRight, Edit2} from 'react-native-feather';
import {HAS_NOTCH} from 'src/modules/constants';
import useUploadOrder from 'src/hooks/useUploadOrder';
import {ActivityIndicator, Keyboard, KeyboardAvoidingView, Linking, TextInput} from 'react-native';
import {useGotoEventApplicationList} from 'src/hooks/useGoto';
import useUploadEventApplication, {
  SelectableOrderCategory,
} from 'src/hooks/useUploadEventApplication';
import BottomPopup from './BottomPopup';
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {Img} from './Img';
import {ICONS} from 'src/modules/icons';
import useTwitterId from 'src/hooks/useTwitterId';
import {EventApplicationInputType} from '../NewEventApplicationOptions';
import BottomSheetTextInput from './BottomSheetTextInput';
import useDiscordId from 'src/hooks/useDiscordId';
import useOptionValue from 'src/hooks/useOptionValue';
import {useApiSelector, useReloadGETWithToken} from 'src/redux/asyncReducer';
import apis from 'src/modules/apis';

export default function NewEventApplication({drawEvent}) {
  const [expandOptions, setExpandOptions] = useState(-1);
  const gotoEventApplicationList = useGotoEventApplicationList();
  const reloadGETWithToken = useReloadGETWithToken();
  const [canUploadEventApplication, setCanUploadEventApplication] =
    useState(false);
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
  const orderable = drawEventStatus.orderable;
  const bottomPopupRef = useRef<BottomSheetModal>(null);
  const handlePressInitialOrder = () => {
    if (!orderable) return;
    if (drawEvent.application_link) {
      Linking.openURL(drawEvent.application_link);
      return;
    }
    bottomPopupRef?.current?.snapToIndex(1);
  };
  const onChangeBottomSheet = index => {
    // if (index==-1) Keyboard.dismiss()
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
          <Row itemsCenter>
            <Col>
              <Div
                bgBlack={
                  orderable &&
                  !loading &&
                  (expandOptions == -1 ||
                    (expandOptions != -1 && canUploadEventApplication))
                }
                h50
                rounded10
                itemsCenter
                justifyCenter
                bgGray400={
                  !(
                    orderable &&
                    !loading &&
                    (expandOptions == -1 ||
                      (expandOptions != -1 && canUploadEventApplication))
                  )
                }
                onPress={
                  orderable &&
                  (expandOptions == -1
                    ? !loading && handlePressInitialOrder
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
      />
    </>
  );
}

const BottomPopupOptions = ({bottomPopupRef, onChangeBottomSheet, error, orderOptions, handleSelectOption, handleWriteOption, setCanUploadEventApplication}) => {
  return (
    <BottomPopup
        ref={bottomPopupRef}
        snapPoints={useMemo(() => ["30%", "55%", "80%"], [])}
        enableContentPanningGesture={true}
        index={-1}
        onChange={onChangeBottomSheet}
        >
          <BottomSheetScrollView style={{paddingLeft:20, paddingRight:20, paddingTop:10, paddingBottom:10}}>
          <Row itemsCenter>
          <Col>
              <Div mb8>
              {error ? (
                <Span danger bold>
                  {error}
                </Span>) : 
                <Span mb2/>}
              </Div>
                {orderOptions.length > 0 && (
                  <Div mb8>
                    <OrderCategories
                      orderCategories={orderOptions}
                      handleSelectOption={handleSelectOption}
                      handleWriteOption={handleWriteOption}
                      setCanUploadEventApplication={setCanUploadEventApplication}
                    />
                  </Div>
                )}
          </Col>
          </Row>
          </BottomSheetScrollView>
      </BottomPopup>
  )
}

function OrderCategories({orderCategories, handleSelectOption, handleWriteOption, setCanUploadEventApplication}) {
  const getNextSection = (index=orderCategories.length) => {
    const nextIndex = orderCategories.reduce((nextIndex, orderCategory, idx)=> (orderCategory.selectedOption==null && idx!=index && idx<nextIndex) ? idx:nextIndex, orderCategories.length)
    if (nextIndex >= orderCategories.length) {setCanUploadEventApplication(true);return null}
    else return nextIndex;
  }
  const [activeSection, setActiveSection] = useState(getNextSection());
  const handlePressSection = index => {
    if (index == activeSection) setActiveSection(null);
    else setActiveSection(index);
  };
  const handleNextSection = index => {
      setActiveSection(getNextSection(index));
  }
  return (
    <Div
      border={0.5}
      borderGray200
      rounded10
      overflowHidden
      mb={90 + (HAS_NOTCH ? 27 : 12)}>
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
                  <Span>{content.selectedOption.name}</Span>
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

function OrderOptions({orderCategory, orderCategoryIndex, onPressOption, onPressToNext}) {
  return (
    <>
      {orderCategory.options.map((option, index) => (
        <Row
          wFull
          py12
          px16
          bgGray100
          itemsCenter
          onPress={() => {onPressOption(orderCategoryIndex, index);onPressToNext(orderCategoryIndex)}}>
          <Col>
            <Span fontSize={14}>{option.name}</Span>
          </Col>
          <Col auto>
            {option.selected && (
              <Check
                height={16}
                color={Colors.success.DEFAULT}
                strokeWidth={2}
              />
            )}
          </Col>
        </Row>
      ))}
    </>
  );
}

const WriteOption = ({orderCategoryIndex, activeSection, onPressToNext, onWriteOption, inputType, onPress, orderCategory, setCanUploadEventApplication, props}) => {
  const { data } = useApiSelector(apis.nft._());
  if (inputType==EventApplicationInputType.TWITTER_ID) {
    const {
      twitterId,
      twitterProfileLink,
      twitterIdError,
      isError,
      handlePressTwitterLink,
      handleChangeTwitterId,
    } = useTwitterId({twitter_id:orderCategory?.selectedOption?.value});
    return (
      <BasicInput id={twitterId} handleChangeId={handleChangeTwitterId} idProfileLink={twitterProfileLink} handlePressLink={handlePressTwitterLink} idError={twitterIdError} inputType={inputType} placeholder={"Twitter ID"} props={props} orderCategoryIndex={orderCategoryIndex} activeSection={activeSection} onPressToNext={onPressToNext} onWriteOption={onWriteOption} onPress={onPress} isError={isError} setCanUploadEventApplication={setCanUploadEventApplication}/>
    )
  } else if (inputType==EventApplicationInputType.DISCORD_ID) {
    const {
      discordId,
      discordProfileLink,
      discordIdError,
      isError,
      handlePressDiscordLink,
      handleChangeDiscordId,
    } = useDiscordId({discord_id:orderCategory?.selectedOption?.value});
  return (
    <BasicInput id={discordId} handleChangeId={handleChangeDiscordId} idProfileLink={discordProfileLink} handlePressLink={handlePressDiscordLink} idError={discordIdError} inputType={inputType} placeholder={"Discord#8888"} props={props} orderCategoryIndex={orderCategoryIndex} activeSection={activeSection} onPressToNext={onPressToNext} onWriteOption={onWriteOption} onPress={onPress} isError={isError} setCanUploadEventApplication={setCanUploadEventApplication}/>
  )
  } else {
    const {text, textError, isTextSavable, handleChangeText, isError} = useOptionValue()
    return(
    <BasicInput id={text} handleChangeId={handleChangeText} idProfileLink={null} handlePressLink={null} idError={textError} inputType={inputType} placeholder={orderCategory.name} props={props} orderCategoryIndex={orderCategoryIndex} activeSection={activeSection} onPressToNext={onPressToNext} onWriteOption={onWriteOption} onPress={onPress} isError={isError} setCanUploadEventApplication={setCanUploadEventApplication}/>
    )
  }
}

const BasicInput = ({id, handleChangeId, idProfileLink, handlePressLink, idError, inputType, placeholder, orderCategoryIndex, activeSection, onPressToNext, onWriteOption, onPress, props, isError, setCanUploadEventApplication}) => {
  const ref = useRef<TextInput | null>(null)
  useEffect(() => {
    if (activeSection==orderCategoryIndex) ref.current?.focus()
  },[activeSection]);
  return (
    <Col auto {...props} onPress={onPress}>
    <Row px15 py15 itemsCenter>
    <Col auto w50>
      {inputType!=EventApplicationInputType.CUSTOM_INPUT&&<Img h={23} w={23} source={inputType==EventApplicationInputType.TWITTER_ID ? ICONS.twitter : ICONS.discord} />}
      {inputType==EventApplicationInputType.CUSTOM_INPUT&& <Edit2 strokeWidth={2} color={Colors.black} height={18} width={18}/>}
    </Col>
    <Col>
        <TextInput
          ref={ref}
          value={id}
          style={{fontSize:16}}
          onChangeText={(value) => {handleChangeId(value);onWriteOption(orderCategoryIndex, isError(value) ? null:value);isError(value) && setCanUploadEventApplication(false)}}
          onSubmitEditing={()=>{!idError&&onPressToNext(orderCategoryIndex)}}
          placeholder={placeholder}/>
    </Col>
    {inputType!=EventApplicationInputType.CUSTOM_INPUT&&<Col auto onPress={!idError&&idProfileLink&&handlePressLink}>
        <ArrowRight
          strokeWidth={2}
          color={Colors.black}
          height={18}
          width={18}
        />
    </Col>}
  </Row>
  {idError ? (
    <Div px15>
      <Span danger mb5>{idError}</Span>
    </Div>
  ) : null}
  </Col>
  )
}