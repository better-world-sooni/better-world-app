import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Platform} from 'react-native';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import {KeyboardAvoidingView} from 'src/components/common/ViewComponents';
import {Colors, DEVICE_WIDTH} from 'src/modules/styles';
import {ChevronLeft} from 'react-native-feather';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useKlipLogin from 'src/hooks/useKlipLogin';
import {Img} from 'src/components/common/Img';
import {ICONS} from 'src/modules/icons';
import useKaikasLogin from 'src/hooks/useKaikasLogin';

const KaikasSignInScreen = () => {
  const {goBack} = useNavigation();
  const notchHeight = useSafeAreaInsets().top;
  const notchBottom = useSafeAreaInsets().bottom;
  const headerHeight = notchHeight + 50;
  const {error, loading, prepareAuthResult, requestAuth, checkResultAndLogin} =
    useKaikasLogin();
  useEffect(() => {
    requestAuth();
  }, []);

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
              Kaikas로 로그인
            </Span>
          </Col>
          <Col />
        </Row>
      </Div>
      <Div flex={1} px15>
        <Div flex={1} itemsCenter justifyCenter>
          <Div>
            <Img source={ICONS.kaikas} h60 w60></Img>
          </Div>
          <Div mt16>
            <Span fontSize={19} bold textCenter>
              {prepareAuthResult
                ? 'Kaikas 정보 제공에 동의하셨나요?'
                : 'BetterWorld가 Kaikas 지갑 정보를 사용하는 것을 허용해주세요.'}
            </Span>
          </Div>
          {error ? (
            <Div mt16>
              <Span danger bold fontSize={16} textCenter>
                {error}
              </Span>
            </Div>
          ) : null}
        </Div>
        <Row
          bg={loading ? Colors.kaikas.light : Colors.kaikas.DEFAULT}
          rounded22
          onPress={
            !loading
              ? prepareAuthResult
                ? checkResultAndLogin
                : requestAuth
              : null
          }
          p15>
          <Col />
          <Col auto>
            {loading ? (
              <ActivityIndicator />
            ) : prepareAuthResult ? (
              <Div>
                <Span bold white fontSize={16}>
                  로그인 하기
                </Span>
              </Div>
            ) : (
              <Div>
                <Span bold white fontSize={16}>
                  Kaikas 지갑 허용하기
                </Span>
              </Div>
            )}
          </Col>
          <Col />
        </Row>
      </Div>
      <Div h={notchBottom} bgWhite></Div>
    </KeyboardAvoidingView>
  );
};

export default KaikasSignInScreen;
