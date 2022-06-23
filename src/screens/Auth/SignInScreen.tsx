import React from 'react';
import {Platform} from 'react-native';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {Img} from 'src/components/common/Img';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import {IMAGES} from 'src/modules/images';
import {KeyboardAvoidingView} from 'src/components/common/ViewComponents';
import {DEVICE_WIDTH} from 'src/modules/styles';
import Carousel from 'react-native-snap-carousel';
import {useGotoPasswordSignIn, useGotoScan} from 'src/hooks/useGoto';
import {ScanType} from 'src/screens/ScanScreen';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const SignInScreen = () => {
  const gotoScan = useGotoScan({scanType: ScanType.Login});
  const gotoPasswordSignIn = useGotoPasswordSignIn();

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
        <Img source={IMAGES.bW} h40 w40></Img>
      </Div>
      <Div flex={1} justifyCenter>
        <Div>
          <Carousel
            data={[
              '가스비 없이 모바일에서 포럼과 거버넌스에 참여해요.',
              '커뮤니티 지갑을 투명하고 편리하게 모니터해요.',
              '커뮤니티원들과 PFP 계정으로 쉽고 재밌게 소통해요.',
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
                bgBlack
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
                borderGray200
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
