import React from 'react';
import {ActivityIndicator, Platform} from 'react-native';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {Img} from 'src/components/common/Img';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import {IMAGES} from 'src/modules/images';
import {KeyboardAvoidingView} from 'src/components/common/ViewComponents';
import {DEVICE_WIDTH} from 'src/modules/styles';
import Carousel from 'react-native-snap-carousel';
import {
  useGotoKlipSignIn,
  useGotoPasswordSignIn,
  useGotoScan,
} from 'src/hooks/useGoto';
import {ScanType} from 'src/screens/ScanScreen';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ICONS} from 'src/modules/icons';

const SignInScreen = () => {
  const gotoScan = useGotoScan({scanType: ScanType.Login});
  const gotoPasswordSignIn = useGotoPasswordSignIn();
  const gotoKlipSignIn = useGotoKlipSignIn();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      flex={1}
      bgWhite>
      <Div
        top={useSafeAreaInsets().top}
        zIndex={100}
        itemsCenter
        justifyEnd
        w={DEVICE_WIDTH}>
        <Img source={IMAGES.betterWorldPlanet} h40 w40 rounded10></Img>
      </Div>
      <Div flex={1} justifyCenter>
        <Div>
          <Carousel
            data={[
              '내 NFT 프로필로\n 커뮤니티원들과 소통하세요',
              '커뮤니티 지갑 사용 내역을\n 투명하게 확인하세요',
              '홀더 혜택을 한눈에\n 모아보세요',
              '오프라인에서 편리하게\n 홀더임을 인증하세요',
            ]}
            itemWidth={DEVICE_WIDTH}
            autoplay
            loop
            autoplayInterval={6000}
            sliderWidth={DEVICE_WIDTH}
            renderItem={renderItem}
          />
          <Div px30>
            <Div h40></Div>
            <Div h48>
              <Row
                bg={'rgb(254, 229, 0)'}
                rounded100
                h48
                flex={1}
                itemsCenter
                onPress={gotoKlipSignIn}>
                <Col />
                <Col auto mr4>
                  <Img source={ICONS.klip} h20 w40></Img>
                </Col>
                <Col auto>
                  <Div>
                    <Span bold fontSize={14}>
                      으로 로그인
                    </Span>
                  </Div>
                </Col>
                <Col />
              </Row>
            </Div>
            <Div h48 mt15>
              <Row
                bgBlack
                rounded100
                h48
                flex={1}
                itemsCenter
                onPress={gotoScan}>
                <Col />
                <Col auto>
                  <Div>
                    <Span white bold fontSize={14}>
                      BetterWorld QR로 로그인
                    </Span>
                  </Div>
                </Col>
                <Col />
              </Row>
            </Div>
            <Div h48 my15>
              <Row
                border1
                borderGray200
                rounded100
                h48
                flex={1}
                itemsCenter
                onPress={gotoPasswordSignIn}>
                <Col />
                <Col auto>
                  <Div>
                    <Span bold fontSize={14}>
                      비밀번호로 로그인
                    </Span>
                  </Div>
                </Col>
                <Col />
              </Row>
            </Div>
          </Div>
        </Div>
      </Div>
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
