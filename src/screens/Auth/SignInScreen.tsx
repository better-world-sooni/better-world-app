import { CommonActions } from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Alert, Keyboard} from 'react-native';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {Img} from 'src/components/common/Img';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import {TextField} from 'src/components/TextField';
import {NAV_NAMES} from 'src/modules/navNames';
import {useLogin} from 'src/redux/appReducer';
import {IMAGES} from 'src/modules/images';
import {ICONS} from 'src/modules/icons';
import BottomPopup from 'src/components/common/BottomPopup';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {QuestionIcon} from 'native-base';
import {KeyboardAvoidingView} from 'src/modules/viewComponents';
import Colors from 'src/constants/Colors';
import {HAS_NOTCH} from 'src/modules/constants';
import {DEVICE_WIDTH} from 'src/modules/styles';
import Carousel from 'react-native-snap-carousel';
import {useGotoHome, useGotoOnboarding} from 'src/hooks/useGoto';

const SignInScreen = ({navigation}) => {
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [expandText, setExpandText] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useLogin();
  const bottomPopupRef = useRef<BottomSheetModal>(null);

  const gotoHome = useGotoHome();
  const gotoOnboarding = useGotoOnboarding();
  const handleAddressSignIn = useCallback(() => {
    Keyboard.dismiss();
    if (loading) {
      return;
    }
    if (address === '') {
      expandBottomPopupWithText('클레이튼 주소를 입력해 주세요');
      return;
    }
    if (password === '') {
      expandBottomPopupWithText('비밀번호를 입력해 주세요');
      return;
    }
    setLoading(true);
    login(
      address,
      password,
      props => {
        setLoading(false);
        if (props.data.user.main_nft) {
          gotoHome();
          return;
        }
        gotoOnboarding();
      },
      props => {
        setLoading(false);
        expandBottomPopupWithText('클레이튼 주소, 비밀번호를 확인해 주세요.');
      },
    );
  }, [address, password]);

  const handleChangeAddress = useCallback(text => setAddress(text), []);
  const handleChangePassword = useCallback(text => setPassword(text), []);

  const handlePressPassword = () => {
    expandBottomPopupWithText(
      '데스크탑 betterworldapp.io 에서 비밀번호 등록 후 로그인 진행해 주시길 바랍니다.',
    );
  };

  const expandBottomPopupWithText = text => {
    setExpandText(text);
    bottomPopupRef?.current?.expand();
  };

  const iconSettingsXs = {
    strokeWidth: 1.3,
    color: 'black',
    height: 12,
    width: 20,
  };

  return (
    <KeyboardAvoidingView behavior="padding" flex={1} bgWhite>
      <Div
        top={HAS_NOTCH ? 44 : 20}
        zIndex={100}
        itemsCenter
        justifyEnd
        w={DEVICE_WIDTH}>
        <Img source={IMAGES.betterWorldBlueLogo} h40 w40></Img>
      </Div>
      <Div flex={1} justifyCenter>
        <Div>
          <Carousel
            data={[
              '보유한 PFP의 가치를 직접 창조하고 함께 공유해요.',
              '개인정보 노출 위험 없이 커뮤니티원들과 PFP 계정으로 쉽게 소통해요.',
              '귀찮은 인증, 신경쓰이는 가스비 없이 모바일에서 커뮤니티 거버넌스에 참여해요.',
              'PFP의 메타버스와 프로필을 개성에 맞게 꾸며봐요.',
            ]}
            itemWidth={DEVICE_WIDTH}
            autoplay
            loop
            autoplayInterval={8000}
            sliderWidth={DEVICE_WIDTH}
            renderItem={renderItem}
          />
          <Div px30>
            <Div h20></Div>
            <Row>
              <TextField
                rounded100
                label={<Span fontSize={14}>Klaytn 주소</Span>}
                placeholder={'0x...'}
                mt={0}
                onChangeText={handleChangeAddress}
                autoCapitalize="none"
              />
            </Row>
            <Row>
              <TextField
                rounded100
                mt={10}
                label={
                  <Span fontSize={14} onPress={handlePressPassword}>
                    비밀번호
                    <QuestionIcon {...iconSettingsXs} />
                  </Span>
                }
                placeholder={'비밀번호'}
                onChangeText={handleChangePassword}
                autoCapitalize="none"
                password
              />
            </Row>
            <Div h48 my15>
              <Row
                bgRealBlack
                rounded100
                h48
                flex={1}
                itemsCenter
                onPress={handleAddressSignIn}>
                <Col />
                <Col auto>
                  <Div>
                    <Span white bold>
                      {loading ? (
                        <ActivityIndicator></ActivityIndicator>
                      ) : (
                        '연결'
                      )}
                    </Span>
                  </Div>
                </Col>
                <Col />
              </Row>
            </Div>
          </Div>
        </Div>
      </Div>
      <BottomPopup ref={bottomPopupRef} snapPoints={['15%']}>
        <Div px15>
          <Span sectionBody style={{textAlign: 'center'}}>
            {expandText}
          </Span>
        </Div>
      </BottomPopup>
    </KeyboardAvoidingView>
  );
};

const renderItem = ({item, index}) => {
  return (
    <Div rounded10 overflowHidden itemsCenter justifyCenter px30>
      <Span fontSize={28} bold style={{textAlign: 'center'}}>
        {item}
      </Span>
    </Div>
  );
};


export default SignInScreen;