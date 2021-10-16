// import { appleAuth } from '@invertase/react-native-apple-authentication';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import CookieManager from '@react-native-community/cookies';
// import { GoogleSignin } from '@react-native-community/google-signin';
// import KakaoLogins from '@react-native-seoul/kakao-login';
import { CommonActions } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
// import { AccessToken, LoginManager } from 'react-native-fbsdk';
import Button from 'src/components/Button';
import { Col } from 'src/components/common/Col';
import { Div } from 'src/components/common/Div';
import { Img } from 'src/components/common/Img';
import { Row } from 'src/components/common/Row';
import { Span } from 'src/components/common/Span';
import { TextField } from 'src/components/TextField';
import { ICONS } from 'src/modules/icons';
import { NAV_NAMES } from 'src/modules/navNames';
import { IOS_APP_VERSION, IOS_CODE_PUSH_VERSION, ANDROID_APP_VERSION, ANDROID_CODE_PUSH_VERSION } from 'src/modules/constants';
import { ScrollView } from 'src/modules/viewComponents';
import { useLogin, useSocialLogin } from 'src/redux/appReducer';
import { IMAGES } from 'src/modules/images';

declare enum KAKAO_AUTH_TYPES {
  Talk = 2,
  Story = 4,
  Account = 8
}

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [errEmail, setErrEmail] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useLogin();
  const socialLogin = useSocialLogin();
  const appVersion =
    Platform.OS === 'ios'
      ? `${IOS_APP_VERSION}_${IOS_CODE_PUSH_VERSION}`
      : `${ANDROID_APP_VERSION}_${ANDROID_CODE_PUSH_VERSION}`;

  useEffect(() => {
    setLoading(false);
    // GoogleSignin.configure({
    //   webClientId:
    //     '1005999098966-bveirigjrl7a4mqfiqq5aeqconlsm654.apps.googleusercontent.com',
    //   offlineAccess: false,
    // });
  }, []);

  const isEmail = (str) => {
    return  /.+\@.+\..+/.test(str)
  }

  const goToHome = () => {
    // CookieManager.clearAll().then((success) => {
    //   console.log('CookieManager.clearAll =>', success);
    // });
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: NAV_NAMES.Home }],
      }),
    );
  }
  const emailSignIn = () => {
    if (email === '') {
      Alert.alert('Error', "이메일을 입력해 주세요", [{ text: "네" }]);
      return;
    }
    if (password === '') {
      Alert.alert('Error', "비밀번호를 입력해 주세요", [{ text: "네" }]);
      return;
    }
    setLoading(true);
    login(
      email,
      password,
      (props) => {
        setLoading(false);
        goToHome()
      },
      (props) => {
        setLoading(false);
        Alert.alert('Error', props.error.message, [{ text: "네" }]);
      },
    );
    // goToHome()
  };
  // const facebookSignIn = () => {
  //   LoginManager.logInWithPermissions(['public_profile']).then(
  //     function (result) {
  //       if (result.isCancelled) {
  //       } else {
  //         AccessToken.getCurrentAccessToken().then((data) => {
  //           const provider = 'facebook';
  //           console.log(data);
  //           const body = {
  //             access_token: data.accessToken.toString(),
  //             provider: provider,
  //             locale: getServerLocale(tempLocale),
  //           };
  //           socialLogin(
  //             body,
  //             (props) => {
  //               console.log(props);
  //               const data = props.data;
  //               if (data.is_new_user) {
  //                 navigation.navigate(NAV_NAMES.SignUp, {
  //                   email: data.email,
  //                   provider: provider,
  //                   uid: data.uid,
  //                   phone: data.phone
  //                 });
  //               } else {
  //                 goToHome()
  //               }
  //             },
  //             (props) => {
  //               Alert.alert('Error', props.error.message, [{ text: t(s_common.ok) }]);
  //             },
  //           );
  //         });
  //       }
  //     }.bind(this),
  //     function (error) {
  //       Alert.alert('Login fail with error: ' + error);
  //     },
  //   );
  // };
  // const googleSignIn = async () => {
  //   try {
  //     await GoogleSignin.hasPlayServices();
  //     const userInfo = await GoogleSignin.signIn();
  //     const provider = 'google_oauth2'
  //     // const tokens = await GoogleSignin.getTokens();
  //     const accessToken = userInfo.idToken;
  //     const body = {
  //       email: userInfo.user.email,
  //       uid: userInfo.user.id,
  //       access_token: accessToken,
  //       provider: provider,
  //       locale: getServerLocale(tempLocale),
  //     };
  //     socialLogin(
  //       body,
  //       (props) => {
  //         const data = props.data;
  //         if (data.is_new_user) {
  //           navigation.navigate(NAV_NAMES.SignUp, {
  //             email: data.email,
  //             provider: provider,
  //             uid: data.uid,
  //             phone: data.phone,
  //           });
  //         } else {
  //           goToHome()
  //         }
  //       },
  //       (props) => {
  //         Alert.alert('Error', props.error.message, [{ text: t(s_common.ok) }]);
  //       },
  //     );
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // const kakaoSignIn = () => {
  //   KakaoLogins.login()
  //     .then((result) => {
  //       KakaoLogins.getProfile().then((profile) => {
  //         const provider = 'kakao';
  //         const body = {
  //           email: profile.email,
  //           uid: profile.id,
  //           provider: provider,
  //           phone: profile.phoneNumber,
  //           locale: getServerLocale(tempLocale),
  //         };
  //         socialLogin(
  //           body,
  //           (props) => {
  //             const data = props.data;
  //             if (data.is_new_user) {
  //               navigation.navigate(NAV_NAMES.SignUp, {
  //                 email: profile.email,
  //                 provider: provider,
  //                 uid: profile.id,
  //                 phone: profile.phoneNumber,
  //               });
  //             } else {
  //               goToHome();
  //             }
  //           },
  //           (props) => {
  //             Alert.alert('Message', props.error.message, [{ text: t(s_common.ok) }]);
  //           },
  //         );
  //       });
  //     })
  //     .catch((err) => {
  //       if (err.code === 'E_CANCELLED_OPERATION') {
  //         console.log(`Login Cancelled:${err.message}`);
  //       } else {
  //         console.log(`Login Failed:${err.code} ${err.message}`);
  //       }
  //     });
  // };
  // const appleSignIn = async () => {
  //   const appleAuthRequestResponse = await appleAuth.performRequest({
  //     requestedOperation: appleAuth.Operation.LOGIN,
  //     requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  //   });
  //   const credentialState = await appleAuth.getCredentialStateForUser(
  //     appleAuthRequestResponse.user,
  //   );
  //   if (credentialState === appleAuth.State.AUTHORIZED) {
  //     const { email, identityToken } = appleAuthRequestResponse;
  //     AsyncStorage.getItem('appleLogin').then((value) => {
  //       if (value) {
  //         const body = {
  //           email: value,
  //           uid: identityToken,
  //           provider: 'apple',
  //           locale: getServerLocale(tempLocale),
  //         };
  //         socialLogin(
  //           body,
  //           (props) => {
  //             goToHome()
  //           },
  //           (props) => {
  //             Alert.alert('Message', props.error.message, [{ text: t(s_common.ok) }]);
  //           },
  //         );
  //       } else {
  //         if (email) {
  //           AsyncStorage.setItem('appleLogin', `${email}`);
  //           const body = {
  //             email: email,
  //             uid: identityToken,
  //             provider: 'apple',
  //             locale: getServerLocale(tempLocale),
  //           };
  //           socialLogin(
  //             body,
  //             (props) => {
  //               goToHome()
  //             },
  //             (props) => {
  //               Alert.alert('Message', props.error.message, [{ text: t(s_common.ok) }]);
  //             },
  //           );
  //         } else {
  //           Alert.alert(
  //             'Welcome!',
  //             t(s_auth.welcome_to_ringle),
  //             [{
  //               text: t(s_common.ok),
  //               onPress: () => {
  //                 navigation.navigate(NAV_NAMES.SignUp, {
  //                   provider: 'apple',
  //                   uid: identityToken,
  //                 });
  //               }
  //             }]
  //           )
  //         }
  //       }
  //     })
  //   }
  // }
  return (
    <>
      <ScrollView flex={1} >
        <Div h100>
          <Row>
            <Col></Col>
            <Col auto>
            </Col>
          </Row>
        </Div>
        <Div flex justifyCenter itemsCenter mx20 bgWhite rounded20 overflowHidden>
          <Row py20 px20>
            <Col auto>
              <Span bold fontSize={30}>사인인</Span>
            </Col>
            <Col></Col>
            <Col auto><Img w50 h50 source={IMAGES.mainLogo} /></Col>
          </Row>
          <Div rounded20  overflowHidden>
              <Row px20>
                <TextField
                label={'이메일'}
                placeholder={''}
                onChangeText={(text) => setEmail(text)}
                onBlur={() => setErrEmail(!isEmail(email))}
                error={errEmail && "이메일이 정확한지 확인해 주세요"}
                value={email}
                autoCapitalize="none"
              />
              </Row>
              <Row px20>
                <TextField
                  label={"비밀번호"}
                  placeholder={'p@ssword'}
                  onChangeText={(text) => setPassword(text)}
                  value={password}
                  password
                />
              </Row>
              <Div backgroundColor={"black"} mt32>
                <Row py20 px20 onPress={() => emailSignIn()}>
                  <Col></Col>
                  <Col auto >
                    <Span white>{loading ? "" : "로그인"}</Span>
                  </Col>
                  <Col></Col>
                </Row>
              </Div>
          </Div>
          {/* <Div
            itemsCenter
            mt20
            p20
            onPress={() => {
              // navigation.navigate(NAV_NAMES.ForgotPassword);
            }}>
            <Span sectionBody gray600>
              {"비밀번호 되찾기"}
            </Span>
          </Div> */}
          {/* <Div mt32 itemsCenter w="100%">
            <Span sectionBody gray500>
              {"로그인 방식"}
            </Span>
            <Row mt16 w="100%" justifyCenter>
              <Col auto mr16 onPress={facebookSignIn}>
                <Img w42 h42 source={IMAGES.imageLogoFacebook} />
              </Col>
              <Col auto mr16 onPress={googleSignIn}>
                <Img w42 h42 source={IMAGES.imageLogoGoogle} />
              </Col>
              <Col auto mr={Platform.OS === 'ios' && 16} onPress={kakaoSignIn}>
                <Img w42 h42 source={IMAGES.imageLogoKakaotalk} />
              </Col>
              {Platform.OS === 'ios' && (
                <Col auto onPress={appleSignIn}>
                  <Img w42 h42 source={IMAGES.imageLogoApple} />
                </Col>
              )}
            </Row>
          </Div> */}
        </Div>
        <Div
            px20
            mt32
            itemsCenter
            w="100%"
            onPress={() => navigation.navigate(NAV_NAMES.SignUp)}>
            <Row>
              <Span sectionBody gray600>
                {"처음이신 가요?"}
              </Span>
            </Row>
            <Row py8 px25>
              <Span header4 primary black>
                {"사인업"}
              </Span>
            </Row>
          </Div>
        {/* <Span mt50 mb150 alignCenter header6 gray600>
          {appVersion}
        </Span> */}
      </ScrollView>
    </>
  );
};
export default SignInScreen;