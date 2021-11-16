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
import LinearGradient from 'react-native-linear-gradient';

const SignInScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [errEmail, setErrEmail] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useLogin();

  useEffect(() => {
    setLoading(false);
  }, []);

  const isEmail = useCallback(str => {
    return /.+\@.+\..+/.test(str);
  }, []);
  const goToHome = useCallback(() => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: NAV_NAMES.Home}],
      }),
    );
  }, []);
  const handleEmailSignIn = useCallback(() => {
    if (email === '') {
      Alert.alert('이메일을 입력해 주세요');
      return;
    }
    if (password === '') {
      Alert.alert('비밀번호를 입력해 주세요');
      return;
    }
    setLoading(true);
    login(
      email,
      password,
      props => {
        setLoading(false);
        goToHome();
      },
      props => {
        setLoading(false);
        Alert.alert('Error', '아이디, 비밀번호를 확인해 주세요.', [
          {text: '네'},
        ]);
      },
    );
  }, [email, password]);

  const handleChangeEmail = useCallback(text => setEmail(text), []);
  const handleErrEmail = useCallback(
    () => setErrEmail(!isEmail(email)),
    [email],
  );
  const handleChangePassword = useCallback(text => setPassword(text), []);
  const handlePressSignUp = useCallback(
    () => navigation.navigate(NAV_NAMES.SignUp),
    [],
  );

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
                로그인
              </Span>
            </Col>
            <Col></Col>
            <Col auto>
              <Img w50 h50 source={IMAGES.mainLogo} />
            </Col>
          </Row>
          <Row>
            <TextField
              label={'이메일'}
              onChangeText={handleChangeEmail}
              onBlur={handleErrEmail}
              error={errEmail && '이메일이 정확한지 확인해 주세요'}
              value={email}
              autoCapitalize="none"
            />
          </Row>
          <Row>
            <TextField
              label={'비밀번호'}
              onChangeText={handleChangePassword}
              value={password}
              password
            />
          </Row>
          <LinearGradient
            colors={['#25e2bc', '#45c01c']}
            style={{width: '100%', borderRadius: 5, marginTop: 20, padding: 2}}>
            <Row py15 px20 onPress={handleEmailSignIn} bgWhite rounded5>
              <Col></Col>
              <Col auto>
                <Span black bold>
                  {loading ? '' : '로그인'}
                </Span>
              </Col>
              <Col></Col>
            </Row>
          </LinearGradient>
          {/* <Row mt100 w="100%" justifyCenter>
            <Col auto mr16>
              <Img w42 h42 source={IMAGES.imageLogoFacebook} />
            </Col>
            <Col auto mr16>
              <Img w42 h42 source={IMAGES.imageLogoGoogle} />
            </Col>
            <Col auto mr={Platform.OS === 'ios' && 16}>
              <Img w42 h42 source={IMAGES.imageLogoKakaotalk} />
            </Col>
            {Platform.OS === 'ios' && (
              <Col auto>
                <Img w42 h42 source={IMAGES.imageLogoApple} />
              </Col>
            )}
          </Row> */}
        </Div>
        <Div px20 mt32 itemsCenter w="100%" onPress={handlePressSignUp}>
          <Row>
            <Span sectionBody gray600>
              {'처음이신 가요?'}
            </Span>
          </Row>
          <Row py8 px25>
            <Span header4 primary black>
              {'사인업'}
            </Span>
          </Row>
        </Div>
      </ScrollView>
    </Div>
  );
};
export default SignInScreen;