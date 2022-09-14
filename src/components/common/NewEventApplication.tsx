import React, {useRef, useState} from 'react';
import {Colors, varStyle} from 'src/modules/styles';
import {Div} from './Div';
import {Span} from './Span';
import Accordion from 'react-native-collapsible/Accordion';
import {Row} from './Row';
import {Col} from './Col';
import {Check} from 'react-native-feather';
import {HAS_NOTCH} from 'src/modules/constants';
import useUploadOrder, {
  SelectableOrderCategory,
} from 'src/hooks/useUploadOrder';
import {ActivityIndicator, Linking} from 'react-native';
import {useGotoOrderList} from 'src/hooks/useGoto';
import useUploadEventApplication from 'src/hooks/useUploadEventApplication';
import BottomPopup from './BottomPopup';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

export default function NewEventApplication({drawEvent}) {
  const [expandOptions, setExpandOptions] = useState(-1);
  const gotoOrderList = useGotoOrderList();
  const [canUploadEventApplication, setCanUploadEventApplication] = useState(false)
  const uploadSuccessCallback = () => {
    gotoOrderList();
  };
  const {
    error,
    loading,
    drawEventStatus,
    orderOptions,
    handleSelectOption,
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
  console.log("loading", loading, "expandIndex", expandOptions)
  return (
    <>
    <Div
      zIndex={100}
      bgWhite
      w={'100%'}
      borderTop={expandOptions==-1 ?0.5:0}
      style={{
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: expandOptions==-1 ? 0.1:0,
        shadowRadius: 4,
        elevation: 2,
      }}
      borderColor={varStyle.gray200}>
      <Div px15 py8>
          <Row itemsCenter>
            <Col>
              <Div
                bgBlack={orderable&&!loading&&(expandOptions==-1||(expandOptions!=-1&&canUploadEventApplication))}
                h50
                rounded10
                itemsCenter
                justifyCenter
                bgGray400={!(orderable&&!loading&&(expandOptions==-1||(expandOptions!=-1&&canUploadEventApplication)))}
                onPress={orderable && (expandOptions==-1 ? !loading && handlePressInitialOrder : canUploadEventApplication && (()=>{bottomPopupRef?.current?.close();uploadEventApplication();}))}>
                <Span white bold>
                  {loading ? <ActivityIndicator /> : '응모하기'}
                </Span>
              </Div>
            </Col>
          </Row>
      </Div>
      <Div h={HAS_NOTCH ? 27 : 12} bgWhite />
    </Div>
    <BottomPopup
        ref={bottomPopupRef}
        snapPoints={["30%", "55%", "80%"]}
        index={-1}
        onChange={(index)=>setExpandOptions(index)}
        >
          <Div px20 py10>
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
                      onPressOption={handleSelectOption}
                      setCanUploadEventApplication={setCanUploadEventApplication}
                    />
                  </Div>
                )}
          </Col>
          </Row>
          </Div>
      </BottomPopup>
    </>
  );
}

function OrderCategories({orderCategories, onPressOption, setCanUploadEventApplication}) {
  const [activeSection, setActiveSection] = useState(0);
  const handlePressSection = index => {
    if (index == activeSection) setActiveSection(null);
    else setActiveSection(index);
  };
  const handleNextSection = index => {
    const nextIndex = orderCategories.reduce((nextIndex, orderCategory, idx)=> (orderCategory.selectedOption==null && idx!=index && idx<nextIndex) ? idx:nextIndex, orderCategories.length)
    if (nextIndex >= orderCategories.length) {setActiveSection(null);setCanUploadEventApplication(true)}
    else setActiveSection(nextIndex);
  }
  return (
    <Div border={0.5} borderGray200 rounded10 overflowHidden>
      <Accordion
        activeSections={[activeSection]}
        sections={orderCategories as SelectableOrderCategory[]}
        underlayColor={Colors.opacity[100]}
        renderHeader={(content, index) => (
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
        )}
        renderContent={(content, index) => (
          <OrderOptions
            orderCategory={content}
            orderCategoryIndex={index}
            onPressOption={onPressOption}
            onPressToNext={handleNextSection}
          />
        )}
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
