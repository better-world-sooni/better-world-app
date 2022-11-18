import React, {useCallback, useRef, useState} from 'react';
import {ActivityIndicator, Keyboard, Platform} from 'react-native';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import {TextField} from 'src/components/TextField';
import {TextInput} from 'src/components/common/ViewComponents';
import {useLogin} from 'src/redux/appReducer';
import BottomPopup from 'src/components/common/BottomPopup';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {KeyboardAvoidingView} from 'src/components/common/ViewComponents';
import {Colors, DEVICE_WIDTH} from 'src/modules/styles';
import {useGotoHome, useGotoOnboarding} from 'src/hooks/useGoto';
import {ChevronLeft} from 'react-native-feather';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {isAddress} from 'src/utils/blockchainUtils';
import GradientColorRect from 'src/components/common/GradientColorRect';

const PasswordSigninScreen = () => {
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [expandText, setExpandText] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useLogin();
  const bottomPopupRef = useRef<BottomSheetModal>(null);

  const gotoHome = useGotoHome();
  const {goBack} = useNavigation();
  const gotoOnboarding = useGotoOnboarding();
  const handleAddressSignIn = useCallback(() => {
    Keyboard.dismiss();
    if (loading) {
      return;
    }
    if (address === '') {
      expandBottomPopupWithText('Kaikas 지갑 주소를 입력해 주세요');
      return;
    }
    if (!isAddress(address)) {
      expandBottomPopupWithText('Kaikas 지갑 주소가 유효하지 않습니다.');
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
        if (props.data.user.nfts.length == 0) {
          expandBottomPopupWithText('홀더가 아닙니다.');
          return;
        }
        if (props.data.user.main_nft) {
          gotoHome();
          return;
        }
        gotoOnboarding();
      },
      props => {
        setLoading(false);
        expandBottomPopupWithText(
          'Kaikas 지갑 주소, 비밀번호를 확인해 주세요.',
        );
      },
    );
  }, [address, password]);

  const handleChangeAddress = useCallback(text => {
    setAddress(text);
  }, []);
  const handleChangePassword = useCallback(text => setPassword(text), []);

  const expandBottomPopupWithText = text => {
    setExpandText(text);
    bottomPopupRef?.current?.expand();
  };
  const notchHeight = useSafeAreaInsets().top;
  const headerHeight = notchHeight + 50;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      flex={1}
      bgWhite
      relative>
      <Div h={headerHeight} top0 zIndex={5}>
        <Row
          itemsCenter
          h40
          px15
          absolute
          w={DEVICE_WIDTH}
          top={notchHeight + 5}>
          <Col justifyStart onPress={goBack}>
            <Div auto rounded100>
              <ChevronLeft
                width={30}
                height={30}
                color={Colors.black}
                strokeWidth={2}
              />
            </Div>
          </Col>
          <Col auto>
            <Span bold fontSize={17}>
              비밀번호로 로그인
            </Span>
          </Col>
          <Col />
        </Row>
      </Div>
      <Div flex={1} justifyCenter>
        <Div px30 pb50>
          <Row mt40>
            <Div w="100%">
              <Div pl11>
                <Span fontSize={11} bold>
                  Kaikas 주소
                </Span>
              </Div>
              <Row itemsCenter mb2 pt5>
                <Col>
                  <TextInput
                    autoCorrect={false}
                    h48
                    p12
                    border={1}
                    borderGray200
                    rounded10
                    placeholder={'ex) 0x123abc...'}
                    autoCapitalize="none"
                    onChangeText={handleChangeAddress}
                    color={'#000000'}
                  />
                </Col>
              </Row>
            </Div>
          </Row>
          <Row>
            <Div w="100%" mt={10}>
              <Div pl11>
                <Span fontSize={11} bold>
                  비밀번호
                </Span>
              </Div>
              <Row itemsCenter mb2 pt5>
                <Col>
                  <TextInput
                    autoCorrect={false}
                    h48
                    p12
                    border={1}
                    borderGray200
                    rounded10
                    autoCapitalize="none"
                    placeholder={'ex) p@sw0rd'}
                    secureTextEntry={true}
                    onChangeText={handleChangePassword}
                    color={'#000000'}
                  />
                </Col>
              </Row>
            </Div>
          </Row>
          <Div h48 mt20>
            <Row
              rounded10
              h48
              flex={1}
              itemsCenter
              overflowHidden
              onPress={handleAddressSignIn}>
              <Div absolute>
                <GradientColorRect height={48} width={DEVICE_WIDTH} />
              </Div>
              <Col />
              <Col auto>
                <Div>
                  <Span white bold fontSize={14}>
                    {loading ? (
                      <ActivityIndicator></ActivityIndicator>
                    ) : (
                      '로그인'
                    )}
                  </Span>
                </Div>
              </Col>
              <Col />
            </Row>
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


export default PasswordSigninScreen;
