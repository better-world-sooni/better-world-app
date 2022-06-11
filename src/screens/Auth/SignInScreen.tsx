import React from 'react';
import {Platform} from 'react-native';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {Img} from 'src/components/common/Img';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import {IMAGES} from 'src/modules/images';
import {KeyboardAvoidingView} from 'src/modules/viewComponents';
import {HAS_NOTCH} from 'src/modules/constants';
import {DEVICE_WIDTH} from 'src/modules/styles';
import Carousel from 'react-native-snap-carousel';
import {useGotoPasswordSignIn, useGotoScan} from 'src/hooks/useGoto';
import {ScanType} from 'src/screens/ScanScreen';

const SignInScreen = () => {
  const gotoScan = useGotoScan({scanType: ScanType.Login});
  const gotoPasswordSignIn = useGotoPasswordSignIn();

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} flex={1} bgWhite>
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
              '신경쓰이는 인증과 가스비 없이 모바일에서 커뮤니티 거버넌스에 참여해요.',
              '개인정보 노출 위험 없이 커뮤니티원들과 PFP 계정으로 쉽게 소통해요.',
              'PFP의 인격을 개성에 맞게 만들어줘요.',
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
            <Div h48>
              <Row
                bgRealBlack
                rounded100
                h48
                flex={1}
                itemsCenter
                onPress={gotoScan}>
                <Col />
                <Col auto>
                  <Div>
                    <Span white bold>
                      큐알로 연결
                    </Span>
                  </Div>
                </Col>
                <Col />
              </Row>
            </Div>
            <Div h48 my15>
              <Row
                border1
                borderGray400
                rounded100
                h48
                flex={1}
                itemsCenter
                onPress={gotoPasswordSignIn}>
                <Col />
                <Col auto>
                  <Div>
                    <Span bold>비밀번호로 연결</Span>
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
