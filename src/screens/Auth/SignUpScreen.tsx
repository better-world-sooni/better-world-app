import {CommonActions} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {Alert, Image, Modal, Platform} from 'react-native';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {Img} from 'src/components/common/Img';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import {TextField} from 'src/components/TextField';
import {NAV_NAMES} from 'src/modules/navNames';
import {
  GRAY_COLOR,
  GO_COLOR,
  Selecting,
  Direction,
  chevronDownSettings,
  characterDesc,
  Validity,
} from 'src/modules/constants';
import {ScrollView} from 'src/modules/viewComponents';
import {useLogin, useSocialLogin} from 'src/redux/appReducer';
import {IMAGES} from 'src/modules/images';
import {getPromiseFn, postPromiseFn} from 'src/redux/asyncReducer';
import APIS from 'src/modules/apis';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';
import {ScrollSelector} from 'src/components/ScrollSelector';
import {
  exchangeOriginDestination,
  setDestination,
  setDirection,
  setOrigin,
} from 'src/redux/routeReducer';
import {stationArr} from 'src/modules/utils';
import {Header} from 'src/components/Header';
import {ChevronDown, RefreshCw} from 'react-native-feather';
import AvatarSelect from 'src/components/AvatarSelect';
import LinearGradient from 'react-native-linear-gradient';

const passwordError =
  '비밀번호는 영어 대문자, 소문자, 숫자를 포함하는 8자 이상의 단어입니다.';

const SignUpSceen = ({navigation}) => {
  const {
    route: {origin, destination, direction, stations},
  } = useSelector((root: RootState) => root.route, shallowEqual);
  const [username, setUsername] = useState('');
  const [errId, setErrId] = useState<any>(false);
  const [email, setEmail] = useState('');
  const [errEmail, setErrEmail] = useState(false);
  const [password, setPassword] = useState('');
  const [errPassword, setErrPassword] = useState(false);
  const [character, setCharacter] = useState(null);
  const [selectingAvatar, setSelectingAvatar] = useState(false);
  const [selecting, setSelecting] = useState(Selecting.NONE);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    setLoading(false);
  }, []);

  const exchangeOD = useCallback(() => {
    if (origin && destination) {
      dispatch(exchangeOriginDestination());
    } else {
      Alert.alert('출발지와 도착지를 먼저 설정해주세요.');
    }
  }, [origin, destination, exchangeOriginDestination]);

  const isUsername = useCallback(str => {
    return (
      str && str.length > 5 && str.length < 12 && /^[a-zA-Z0-9._]+$/.test(str)
    );
  }, []);
  const isEmail = useCallback(str => {
    return /.+\@.+\..+/.test(str);
  }, []);
  const isPassword = useCallback(str => {
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/.test(str);
  }, []);
  const emailSignUp = useCallback(async () => {
    if (username === '' || !isUsername(username)) {
      Alert.alert('Error', '아이디를 확인해 주세요', [{text: '네'}]);
      setUsername('');
      return;
    }
    if (email === '' || !isEmail(email)) {
      Alert.alert('Error', '이메일을 확인해 주세요', [{text: '네'}]);
      setEmail('');
      return;
    }
    if (password === '' || !isPassword(password)) {
      Alert.alert('Error', passwordError, [{text: '네'}]);
      setPassword('');
      return;
    }
    if (!character) {
      Alert.alert('Error', '아바타를 선택해 주세요', [{text: '네'}]);
      return;
    }
    if (!origin) {
      Alert.alert('Error', '출발지를 설정해 주세요!');
      return;
    }
    if (!destination) {
      Alert.alert('Error', '출발지를 설정해 주세요!');
      return;
    }
    setLoading(true);
    try {
      const newUserResponse = await postPromiseFn({
        url: APIS.auth.signUp().url,
        body: {
          username: username,
          email: email,
          password: password,
          avatar: character,
        },
        token: '',
      });

      if (newUserResponse.status == 200) {
        const {jwtToken} = newUserResponse.data;
        const defaultRouteResponse = await postPromiseFn({
          url: APIS.route.starred().url,
          body: {
            route: {
              origin: origin,
              destination: destination,
              stations: stations,
              direction: direction,
            },
            main: true,
          },
          token: jwtToken,
        });
        if (defaultRouteResponse.status == 200) {
          Alert.alert('Success', '사인업이 완료되었습니다. 로그인 해주세요.', [
            {text: '네', onPress: () => navigation.navigate(NAV_NAMES.SignIn)},
          ]);
          navigation.navigate(NAV_NAMES.SignIn);
          return;
        }
      }
    } catch (e) {
      Alert.alert(
        'Error',
        `${e}: 사인업 도중 문재가 발생하였습니다. 고객 전화번호로 문의 부탁드립니다. `,
      );
      setLoading(false);
      return;
    }
    Alert.alert('Error', `사인업 도중 문재가 발생하였습니다.`);
    setLoading(false);
  }, [username, email, password, character, passwordError]);
  const borderProp = useCallback(bool => {
    if (!bool || bool === Validity.NULL || bool === Validity.ZERO) {
      return {
        borderColor: GRAY_COLOR,
        borderWidth: 1,
      };
    } else if (bool === Validity.INVALID) {
      return {
        borderColor: 'red',
        borderWidth: 1,
      };
    } else {
      return {
        borderColor: 'black',
        borderWidth: 1,
      };
    }
  }, []);
  const selectGetterSetter = {
    [Selecting.ORIGIN]: {
      get: origin,
      set: ori => dispatch(setOrigin(ori)),
      options: stationArr([], '시청', '충정로(경기대입구)', Direction.CW),
    },
    [Selecting.DESTINATION]: {
      get: destination,
      set: dest => dispatch(setDestination(dest)),
      options: stationArr([], '시청', '충정로(경기대입구)', Direction.CW),
    },
    [Selecting.DIRECTION]: {
      get: direction,
      set: dir => dispatch(setDirection(dir)),
      options: [Direction.INNER, Direction.OUTER],
    },
  };
  const handleEmailChange = useCallback(text => setEmail(text), []);
  const handleEmailBlur = useCallback(
    () => setErrEmail(!isEmail(email)),
    [email],
  );
  const handlePasswordChange = useCallback(text => setPassword(text), []);
  const handlePasswordBlur = useCallback(
    () => setErrPassword(!isPassword(password)),
    [password],
  );
  const handleIdChange = useCallback(async id => {
    setUsername(id);
    const res = await getPromiseFn({
      url: APIS.auth.usernameValidity(id).url,
      body: {},
      token: null,
    });
    if (isUsername(id)) {
      if (res.status == 200 && res.data.valid) {
        setErrId(false);
      } else {
        setErrId('이미 존재하는 아이디 입니다.');
      }
    } else {
      setErrId('다른 아이디를 시도해주세요.');
    }
  }, []);
  const handleSelectAvatar = useCallback(() => setSelectingAvatar(true), []);
  const handleDoneSelectAvatar = useCallback(
    () => setSelectingAvatar(false),
    [],
  );
  const handleSelectDirection = useCallback(
    () => setSelecting(Selecting.DIRECTION),
    [],
  );
  const handleSelectOrigin = useCallback(
    () => setSelecting(Selecting.ORIGIN),
    [],
  );
  const handleSelectDestination = useCallback(
    () => setSelecting(Selecting.DESTINATION),
    [],
  );
  const handleDoneSelecting = useCallback(
    () => setSelecting(Selecting.NONE),
    [],
  );
  const handlePressSignUp = useCallback(() => emailSignUp(), []);
  const handlePressSignIn = useCallback(
    () => navigation.navigate(NAV_NAMES.SignIn),
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
                회원가입
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
              onChangeText={handleEmailChange}
              onBlur={handleEmailBlur}
              error={errEmail && '이메일이 정확한지 확인해 주세요'}
              value={email}
              autoCapitalize="none"
            />
          </Row>
          <Row>
            <TextField
              label={'비밀번호'}
              onChangeText={handlePasswordChange}
              value={password}
              onBlur={handlePasswordBlur}
              error={errPassword && passwordError}
              password
            />
          </Row>
          <Row>
            <TextField
              label={'아이디'}
              onChangeText={handleIdChange}
              error={errId}
              value={username}
              autoCapitalize="none"
            />
          </Row>
          <Div w={'100%'} rounded5 mt20 {...borderProp(null)}>
            {!character ? (
              <Row py15 px20 onPress={handleSelectAvatar}>
                <Col auto>
                  <Img source={IMAGES.imageProfileNull} w100 h100></Img>
                </Col>
                <Col itemsCenter justifyCenter>
                  <Span>아바타 선택</Span>
                </Col>
              </Row>
            ) : (
              <Row p5 onPress={handleSelectAvatar}>
                <Col auto px20>
                  <Row justifyCenter itemsCenter>
                    <Img source={IMAGES.characters[character]} w100 h100></Img>
                  </Row>
                  <Row itemsCenter justifyCenter>
                    <Span fontSize={10} color={GO_COLOR}>
                      아바타 바꾸기
                    </Span>
                  </Row>
                </Col>
                <Col itemsCenter justifyCenter>
                  {characterDesc.get(character).span}
                </Col>
              </Row>
            )}
          </Div>
          <Div w={'100%'} rounded5 mt20 {...borderProp(null)} pt15 pb5>
            <Row px20>
              <Col></Col>
              <Col auto>
                <Span>내 기본길 설정</Span>
              </Col>
              <Col></Col>
            </Row>
            <Row
              itemsCenter
              justifyCenter
              rounded5
              auto
              mx20
              py5
              my5
              onPress={handleSelectDirection}>
              <Col auto>
                <Span
                  bold
                  textCenter
                  color={'black'}
                  numberOfLines={1}
                  ellipsizeMode="head">
                  {direction || '방향'}
                </Span>
              </Col>
              <Col auto justifyCenter>
                <ChevronDown {...chevronDownSettings}></ChevronDown>
              </Col>
            </Row>
            <Row px10>
              <Col
                bg={'rgb(242, 242, 247)'}
                rounded5
                py7
                my5
                mr5
                pl5
                justifyCenter
                onPress={handleSelectOrigin}>
                <Row>
                  <Col itemsCenter>
                    <Span
                      bold
                      textCenter
                      color={'black'}
                      numberOfLines={1}
                      ellipsizeMode="head">
                      {origin}
                    </Span>
                  </Col>
                  <Col auto justifyCenter>
                    <ChevronDown {...chevronDownSettings}></ChevronDown>
                  </Col>
                </Row>
              </Col>
              <Col mx5 auto itemsCenter justifyCenter onPress={exchangeOD}>
                <Span>
                  <RefreshCw color={'black'} height={14}></RefreshCw>
                </Span>
              </Col>
              <Col
                bg={'rgb(242, 242, 247)'}
                rounded5
                py7
                my5
                pl5
                justifyCenter
                onPress={handleSelectDestination}>
                <Row>
                  <Col itemsCenter>
                    <Span
                      bold
                      textCenter
                      color={'black'}
                      numberOfLines={1}
                      ellipsizeMode="head">
                      {destination}
                    </Span>
                  </Col>
                  <Col auto justifyCenter>
                    <ChevronDown {...chevronDownSettings}></ChevronDown>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Div>
          <LinearGradient
            colors={['#25e2bc', '#45c01c']}
            style={{width: '100%', borderRadius: 5, marginTop: 20, padding: 2}}>
            <Row py15 px20 onPress={handlePressSignUp} rounded5 bgWhite>
              <Col></Col>
              <Col auto>
                <Span black bold>
                  {loading ? '' : '회원가입'}
                </Span>
              </Col>
              <Col></Col>
            </Row>
          </LinearGradient>
        </Div>
        <Div px20 mt32 itemsCenter w="100%" onPress={handlePressSignIn}>
          <Row>
            <Span sectionBody gray600>
              {'이미 가입하셨나요?'}
            </Span>
          </Row>
          <Row py8 px25>
            <Span header4 primary black>
              {'로그인'}
            </Span>
          </Row>
        </Div>
        <Div h100></Div>
      </ScrollView>
      <AvatarSelect
        visible={selectingAvatar}
        onPressReturn={handleDoneSelectAvatar}
        character={character}
        setCharacter={setCharacter}
      />
      {selecting && (
        <ScrollSelector
          selectedValue={selectGetterSetter[selecting].get}
          onValueChange={selectGetterSetter[selecting].set}
          options={selectGetterSetter[selecting].options}
          onClose={handleDoneSelecting}
        />
      )}
    </Div>
  );
};
export default SignUpSceen;
