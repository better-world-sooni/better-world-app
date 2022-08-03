import React, {useCallback, useRef, useState} from 'react';
import {ActivityIndicator, Keyboard, Platform} from 'react-native';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import {TextField} from 'src/components/TextField';
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
      expandBottomPopupWithText('클레이튼 주소를 입력해 주세요');
      return;
    }
    if (!isAddress(address)) {
      expandBottomPopupWithText('클레이튼 주소가 유효하지 않습니다.');
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
        expandBottomPopupWithText('클레이튼 주소, 비밀번호를 확인해 주세요.');
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
      relative
    >
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
            <Span bold fontSize={19}>
              비밀번호로 연결
            </Span>
          </Col>
          <Col />
        </Row>
      </Div>
      <Div flex={1} justifyCenter>
        <Div>
          <Div rounded10 overflowHidden itemsCenter justifyCenter px30>
            <Span fontSize={24} bold style={{textAlign: 'center'}}>
              비밀번호는 betterworldapp.io에서 지갑 인증 후 설정/재설정 하실 수
              있습니다.
            </Span>
          </Div>
          <Div px30>
            <Row mt15>
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
                label={<Span fontSize={14}>비밀번호</Span>}
                placeholder={'비밀번호'}
                onChangeText={handleChangePassword}
                autoCapitalize="none"
                password
              />
            </Row>
            <Div h48 my15>
              <Row
                bgBlack
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

export default PasswordSigninScreen;
