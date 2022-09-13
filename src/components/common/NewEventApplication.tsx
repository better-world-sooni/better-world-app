import React, {useState} from 'react';
import {Colors, varStyle} from 'src/modules/styles';
import {Div} from './Div';
import {Span} from './Span';
import Accordion from 'react-native-collapsible/Accordion';
import {Row} from './Row';
import {Col} from './Col';
import {Check, ChevronDown, Minus, Plus} from 'react-native-feather';
import {HAS_NOTCH} from 'src/modules/constants';
import useUploadOrder, {
  SelectableOrderCategory,
} from 'src/hooks/useUploadOrder';
import {ActivityIndicator, Linking} from 'react-native';
import {useGotoOrderList} from 'src/hooks/useGoto';
import useUploadEventApplication from 'src/hooks/useUploadEventApplication';

export default function NewEventApplication({drawEvent}) {
  const [expandOptions, setExpandOptions] = useState(false);
  const gotoOrderList = useGotoOrderList();
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
  const handlePressInitialOrder = () => {
    if (!orderable) return;
    if (drawEvent.application_link) {
      Linking.openURL(drawEvent.application_link);
      return;
    }
    setExpandOptions(true);
  };
  return (
    <Div
      zIndex={100}
      bgWhite
      w={'100%'}
      borderTop={0.5}
      style={{
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }}
      borderColor={varStyle.gray200}>
      <Div px15 py8>
        {expandOptions ? (
          <>
            {error ? (
              <Div mb8>
                <Span danger bold>
                  {error}
                </Span>
              </Div>
            ) : null}
            <Div itemsCenter pb4 onPress={() => setExpandOptions(false)}>
              <ChevronDown color={Colors.gray[400]} width={22} height={22} />
            </Div>
            {orderOptions.length > 0 && (
              <Div mb8>
                <OrderCategories
                  orderCategories={orderOptions}
                  onPressOption={handleSelectOption}
                />
              </Div>
            )}
            <Row itemsCenter onPress={uploadEventApplication}>
              <Col>
                <Div bgBlack h50 rounded10 itemsCenter justifyCenter>
                  <Span white bold>
                    {loading ? <ActivityIndicator /> : '응모하기'}
                  </Span>
                </Div>
              </Col>
            </Row>
          </>
        ) : (
          <Row itemsCenter>
            <Col>
              <Div
                bgBlack={orderable}
                h50
                rounded10
                itemsCenter
                justifyCenter
                bgGray400={!orderable}
                onPress={handlePressInitialOrder}>
                <Span white bold>
                  응모하기
                </Span>
              </Div>
            </Col>
          </Row>
        )}
      </Div>
      <Div h={HAS_NOTCH ? 27 : 12} bgWhite />
    </Div>
  );
}

function OrderCategories({orderCategories, onPressOption}) {
  const [activeSection, setActiveSection] = useState(0);
  const handlePressSection = index => {
    if (index == activeSection) setActiveSection(null);
    else setActiveSection(index);
  };
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
          />
        )}
        onChange={() => {}}
      />
    </Div>
  );
}

function OrderOptions({orderCategory, orderCategoryIndex, onPressOption}) {
  return (
    <>
      {orderCategory.options.map((option, index) => (
        <Row
          wFull
          py12
          px16
          bgGray100
          itemsCenter
          onPress={() => onPressOption(orderCategoryIndex, index)}>
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
