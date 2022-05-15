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

const SignInScreen = ({navigation}) => {
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [expandText, setExpandText] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useLogin();
  const bottomPopupRef = useRef<BottomSheetModal>(null);

  const goToHome = useCallback(() => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: NAV_NAMES.Home}],
      }),
    );
  }, []);
  const goToOnboarding = useCallback(() => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: NAV_NAMES.Onboarding}],
      }),
    );
  }, []);
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
          goToHome();
          return;
        }
        goToOnboarding();
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
      'Kaikas 유저들은 데스크탑 betterworldapp.io 에서 비밀번호 등록 후 로그인 진행해 주시길 바랍니다.',
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
    <KeyboardAvoidingView bgWhite flex justifyCenter behavior="padding">
      <Div px15>
        <Div rounded10 overflowHidden>
          <Row itemsCenter>
            <Col auto>
              <Span fontSize={35} primary fontFamily={'UniSans'}>
                Connect to{'\n'}
                <Span bold fontSize={35}>
                  BetterWorld
                </Span>
              </Span>
            </Col>
            <Col></Col>
          </Row>
        </Div>
        <Div h20></Div>
        <Row>
          <TextField
            rounded100
            label={'Klaytn 주소'}
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
              <Span notice onPress={handlePressPassword}>
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
        <Div h45 my15>
          <Row
            bgGray200
            rounded100
            h45
            flex
            itemsCenter
            onPress={handleAddressSignIn}>
            <Col />
            <Col auto>
              <Div>
                <Span black bold>
                  {loading ? <ActivityIndicator></ActivityIndicator> : '연결'}
                </Span>
              </Div>
            </Col>
            <Col />
          </Row>
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


export default SignInScreen;