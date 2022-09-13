import React, {useCallback, useRef, useState} from 'react';
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
import BottomPopup from './BottomPopup';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';

export default function NewEventApplication({drawEvent}) {
  const sampleOption = [
      {"category": "디스코드 아이디", "created_at": "2022-09-08T19:49:30.585+09:00", "draw_event_id": 1, "id": 10, "input_type": 3, "name": "디스코드 아이디", "updated_at": "2022-09-08T19:49:30.585+09:00"}, 
      {"category": "트위터 아이디", "created_at": "2022-09-08T19:49:30.585+09:00", "draw_event_id": 1, "id": 10, "input_type": 2, "name": "트위터 아이디", "updated_at": "2022-09-08T19:49:30.585+09:00"}, 
      {"category": "커스텀 인풋", "created_at": "2022-09-08T19:49:30.585+09:00", "draw_event_id": 1, "id": 10, "input_type": 1, "name": "커스텀", "updated_at": "2022-09-08T19:49:30.585+09:00"}, 
      {"category": "옵션1", "created_at": "2022-09-08T19:49:30.585+09:00", "draw_event_id": 1, "id": 1, "input_type": 0, "name": "선택지1", "updated_at": "2022-09-08T19:49:30.585+09:00"}, 
      {"category": "옵션1", "created_at": "2022-09-08T19:49:30.585+09:00", "draw_event_id": 1, "id": 2, "input_type": 0, "name": "선택지2", "updated_at": "2022-09-08T19:49:30.585+09:00"}, 
      {"category": "옵션1", "created_at": "2022-09-08T19:49:30.585+09:00", "draw_event_id": 1, "id": 3, "input_type": 0, "name": "선택지3", "updated_at": "2022-09-08T19:49:30.585+09:00"}, 
      {"category": "옵션2", "created_at": "2022-09-08T19:49:30.585+09:00", "draw_event_id": 1, "id": 4, "input_type": 0, "name": "선택지1", "updated_at": "2022-09-08T19:49:30.585+09:00"},
      {"category": "옵션2", "created_at": "2022-09-08T19:49:30.585+09:00", "draw_event_id": 1, "id": 5, "input_type": 0, "name": "선택지2", "updated_at": "2022-09-08T19:49:30.585+09:00"},
      {"category": "옵션3", "created_at": "2022-09-08T19:49:30.585+09:00", "draw_event_id": 1, "id": 6, "input_type": 0, "name": "선택지1", "updated_at": "2022-09-08T19:49:30.585+09:00"},
      {"category": "옵션3", "created_at": "2022-09-08T19:49:30.585+09:00", "draw_event_id": 1, "id": 7, "input_type": 0, "name": "선택지2", "updated_at": "2022-09-08T19:49:30.585+09:00"},
      {"category": "옵션3", "created_at": "2022-09-08T19:49:30.585+09:00", "draw_event_id": 1, "id": 8, "input_type": 0, "name": "선택지3", "updated_at": "2022-09-08T19:49:30.585+09:00"},
      {"category": "옵션3", "created_at": "2022-09-08T19:49:30.585+09:00", "draw_event_id": 1, "id": 9, "input_type": 0, "name": "선택지4", "updated_at": "2022-09-08T19:49:30.585+09:00"},
    ]
    const sample = {
      "application_link": null, 
      "created_at": "2022-09-08T19:49:30.574+09:00", 
      "description": "가자가자가자가자", 
      "draw_event_options": sampleOption, 
      "event_application": null, 
      "expires_at": null, 
      "giveaway_merchandise": "Eric or Jaesus", 
      "id": 1, 
      "image_uris": ["https://d122m4njb70d8u.cloudfront.net/draw_event/image/eb64901b-3598-4209-9a27-f0419f7d47ad.jpeg", "https://d122m4njb70d8u.cloudfront.net/draw_event/image/ada1fb3b-8e46-49eb-8cd4-7dea88e8d834.jpeg"], 
      "name": "Manhood Event", 
      "nft_collection": {"about": "현실과 가상 세계에 공존하는 문화의 프랜차이즈, 기꺼이 이상해지고자 하는 젊고 세계적인 혁신가들을 위해.", "background_image_uri": "https://d122m4njb70d8u.cloudfront.net/nft_collection/image/7019606d-37f2-416c-ab2b-1a75be2234eb.jpeg", "contract_address": "0x858efce380470eea04fe7ccf39133905b46811f5", "created_at": "2022-07-12T05:14:32.460+09:00", "image_uri": "https://d122m4njb70d8u.cloudfront.net/nft_collection/image/85af5e84-547e-4145-b7ae-d1f68dc7384d.png", "name": "WeBe", "network": "Klaytn", "symbol": "WBE", "total_supply": 8, "updated_at": "2022-08-04T01:55:02.531+09:00"}, 
      "status": 0}
  const [expandOptions, setExpandOptions] = useState(-1);
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
    drawEvent:sample,
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
    bottomPopupRef?.current?.snapToIndex(0);
  };
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
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }}
      borderColor={varStyle.gray200}>
      <Div px15 py8>
          <Row itemsCenter>
            <Col>
              <Div
                bgBlack={orderable}
                h50
                rounded10
                itemsCenter
                justifyCenter
                bgGray400={!orderable}
                onPress={expandOptions==-1 ? handlePressInitialOrder : uploadEventApplication}>
                <Span white bold>
                  {expandOptions==-1 ? "응모하기" : (loading ? <ActivityIndicator /> : '응모하기')}
                </Span>
              </Div>
            </Col>
          </Row>
      </Div>
      <Div h={HAS_NOTCH ? 27 : 12} bgWhite />
    </Div>
    <BottomPopup
        ref={bottomPopupRef}
        snapPoints={["50%", "80%"]}
        index={-1}
        onChange={(_,t)=>setExpandOptions(t)}
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
