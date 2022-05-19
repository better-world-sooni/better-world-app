import React, {useRef} from 'react';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import BottomPopup from 'src/components/common/BottomPopup';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useApiSelector} from 'src/redux/asyncReducer';
import apis from 'src/modules/apis';
import NftChooseBottomSheetScrollView from 'src/components/common/NftChooseBottomSheetScrollView';
import {NAV_NAMES} from 'src/modules/navNames';

const OnboardingScreen = ({navigation}) => {
  const bottomPopupRef = useRef<BottomSheetModal>(null);
  const {data: profileRes, isLoading: profileLoad} = useApiSelector(
    apis.profile._,
  );

  return (
    <Div bgPrimary flex={1} justifyCenter>
      <Div px15 pb50>
        <Div>
          <Row itemsCenter>
            <Col auto>
              <Span fontSize={20} white>
                <Span bold fontSize={30}>
                  곰즈를 시작으로{'\n'}PFP에게 생명을 불어넣어요{'\n'}
                </Span>
                BetterWorld alpha{'\n'}
              </Span>
            </Col>
            <Col></Col>
          </Row>
        </Div>
      </Div>
      <BottomPopup
        ref={bottomPopupRef}
        snapPoints={['30%', '90%']}
        index={0}
        enablePanDownToClose={false}
        backdrop={false}>
        <NftChooseBottomSheetScrollView
          nfts={profileRes?.user?.nfts}
          onSuccess={() => navigation.navigate(NAV_NAMES.Home)}
          title={'새로운 로그인 시에 깨울 Identity를 선택하세요.'}
        />
      </BottomPopup>
    </Div>
  );
};

export default OnboardingScreen;
