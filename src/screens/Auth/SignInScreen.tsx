import { CommonActions } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Col } from 'src/components/common/Col';
import { Div } from 'src/components/common/Div';
import { Img } from 'src/components/common/Img';
import { Row } from 'src/components/common/Row';
import { Span } from 'src/components/common/Span';
import { TextField } from 'src/components/TextField';
import { NAV_NAMES } from 'src/modules/navNames';
import {ScrollView} from 'src/modules/viewComponents';
import {useLogin} from 'src/redux/appReducer';
import {IMAGES} from 'src/modules/images';
import {ICONS} from 'src/modules/icons';
import Colors from 'src/constants/Colors';

const SignInScreen = ({navigation}) => {
  const [address, setAddress] = useState('');
  const [addressError, setAddressError] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useLogin();

  useEffect(() => {
    setLoading(false);
  }, []);

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
    if (address === '') {
      Alert.alert('클레이튼 주소를 입력해 주세요');
      return;
    }
    if (password === '') {
      Alert.alert('비밀번호를 입력해 주세요');
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
        Alert.alert('Error', '클레이튼 주소, 비밀번호를 확인해 주세요.', [
          {text: '네'},
        ]);
      },
    );
  }, [address, password]);

  const handleChangeAddress = useCallback(text => setAddress(text), []);
  // const handleBlurAddress = () => setAddressError(!isAddress(address));
  const handleChangePassword = useCallback(text => setPassword(text), []);

  return (
    <Div bgWhite flex justifyCenter>
      <ScrollView>
        <Div h100>
          <Row>
            <Col></Col>
            <Col auto></Col>
          </Row>
        </Div>
        <Div flex justifyCenter itemsCenter bgWhite px20>
          <Row py20 justifyCenter itemsCenter>
            <Col auto justifyCenter>
              <Span bold fontSize={30}>
                연결
              </Span>
            </Col>
            <Col></Col>
            <Col auto>
              <Img w50 h50 source={IMAGES.mainLogo} />
            </Col>
          </Row>
          <Row
            my15
            bgColor={Colors.primary.DEFAULT}
            rounded10
            h45
            flex
            itemsCenter>
            <Col />
            <Col auto pr10>
              <Div>
                <Img h10 w20 source={ICONS.iconKlip}></Img>
              </Div>
            </Col>
            <Col auto>
              <Div>
                <Span white bold>
                  {'Klip으로 연결'}
                </Span>
              </Div>
            </Col>
            <Col />
          </Row>
          <Row flex itemsCenter>
            <Col h={0.5} bgBlack>
              <Div hrTag />
            </Col>
            <Col auto px10>
              <Span>{'Or'}</Span>
            </Col>
            <Col h={0.5} bgBlack></Col>
          </Row>
          <Row mt15>
            <TextField
              label={'클레이튼 주소'}
              mt={0}
              onChangeText={handleChangeAddress}
              // onChange={handleBlurAddress}
              error={addressError && '주소가 정확한지 확인해 주세요'}
              autoCapitalize="none"
            />
          </Row>
          <Row mb15>
            <TextField
              mt={5}
              label={'비밀번호'}
              onChangeText={handleChangePassword}
              autoCapitalize="none"
              password
            />
          </Row>
          <Row
            mb15
            bgGray200
            rounded10
            h45
            flex
            itemsCenter
            onPress={handleAddressSignIn}>
            <Col />
            <Col auto>
              <Div>
                <Span black bold>
                  {'이메일로 연결'}
                </Span>
              </Div>
            </Col>
            <Col />
          </Row>
          <Row textCenter>
            <Span black fontSize={12}>
              {
                'Kaikas 유저들은 데스크탑 www.betterworldapp.io 에서 password 등록 후에 로그인 진행해 주시길 바랍니다.'
              }
            </Span>
          </Row>
        </Div>
      </ScrollView>
    </Div>
  );
};
export default SignInScreen;