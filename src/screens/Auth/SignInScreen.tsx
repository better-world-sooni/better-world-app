import React, {useState} from 'react';
import {Platform} from 'react-native';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {Img} from 'src/components/common/Img';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import {IMAGES} from 'src/modules/images';
import {KeyboardAvoidingView} from 'src/components/common/ViewComponents';
import {Colors, DEVICE_WIDTH} from 'src/modules/styles';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {
  useGotoKaikasSignIn,
  useGotoKlipSignIn,
  useGotoPasswordSignIn,
} from 'src/hooks/useGoto';
import {ICONS} from 'src/modules/icons';
import GradientColorRect from 'src/components/common/GradientColorRect';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const SignInScreen = () => {
  const mottos = [
    {
      text: '흩어진 NFT 공지들을\n 한눈에 확인하세요',
      image: IMAGES.announcements,
      width: 748,
      height: 659,
    },
    {
      text: 'NFT 홀더들과\n 편리하고 안전하게 소통하세요',
      image: IMAGES.chatting,
      height: 589,
      width: 714,
    },
    {
      text: '마음에 드는 게시물을\n 코인으로 응원해보세요',
      image: IMAGES.donate,
      height: 830,
      width: 600,
    },
    {
      text: '오프라인에서\n 간편하게 홀더인증하세요',
      image: IMAGES.scan,
      height: 652,
      width: 792,
    },
  ];
  const [activeSlide, setActiveSlide] = useState(0);
  const gotoKlipSignIn = useGotoKlipSignIn();
  const gotoKaikasSignIn = useGotoKaikasSignIn();
  const gotoPasswordSignIn = useGotoPasswordSignIn();
  const bottomInset = useSafeAreaInsets().bottom;
  const topInset = useSafeAreaInsets().top;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      flex={1}
      bgWhite>
      <Div flex={1} justifyCenter pt={topInset} pb={bottomInset}>
        <Div flex={1} justifyCenter>
          <Div>
            <Carousel
              data={mottos}
              itemWidth={DEVICE_WIDTH}
              autoplay
              loop
              autoplayInterval={6000}
              sliderWidth={DEVICE_WIDTH}
              renderItem={renderItem}
              onSnapToItem={setActiveSlide}
            />
            <Pagination
              dotsLength={mottos.length}
              activeDotIndex={activeSlide}
              containerStyle={{
                paddingVertical: 0,
                marginHorizontal: 0,
                paddingHorizontal: 0,
              }}
              dotStyle={{
                width: 10,
                height: 10,
                borderRadius: 10,
                marginHorizontal: -2,
                paddingHorizontal: 0,
                backgroundColor: Colors.gray[300],
              }}
              dotElement={
                <Div w15 h10 rounded5 mx4 overflowHidden>
                  <GradientColorRect height={10} width={15} />
                </Div>
              }
              inactiveDotOpacity={0.6}
              inactiveDotScale={1}
            />
          </Div>
        </Div>
        <Div px20 wFull mb70>
          <Div h48>
            <Row
              bg={Colors.klip.DEFAULT}
              rounded={10}
              h64
              flex={1}
              itemsCenter
              onPress={gotoKlipSignIn}>
              <Col />
              <Col auto mr11>
                <Img source={ICONS.klip} h20 w40></Img>
              </Col>
              <Col auto>
                <Div>
                  <Span bold fontSize={14}>
                    클립으로 로그인
                  </Span>
                </Div>
              </Col>
              <Col />
            </Row>
          </Div>
          <Div h48 mt15>
            <Row
              rounded={10}
              bg={Colors.kaikas.DEFAULT}
              h64
              flex={1}
              itemsCenter
              onPress={gotoKaikasSignIn}>
              <Col />
              <Col auto mr11>
                <Img source={ICONS.kaikasWhite} h20 w20></Img>
              </Col>
              <Col auto>
                <Div>
                  <Span bold white fontSize={13}>
                    카이카스로 로그인
                  </Span>
                </Div>
              </Col>
              <Col />
            </Row>
          </Div>
          <Div h30 mt15 justifyCenter itemsCenter onPress={gotoPasswordSignIn}>
            <Span bold gray400 fontSize={11}>
              비밀번호로 로그인
            </Span>
          </Div>
        </Div>
      </Div>
    </KeyboardAvoidingView>
  );
};

const renderItem = ({item, index}) => {
  return (
    <Div rounded10 overflowHidden itemsCenter justifyCenter px30>
      <Span fontSize={24} bold style={{textAlign: 'center'}}>
        {item.text}
      </Span>
      <Div py70 itemsCenter justifyCenter>
        <Img source={item.image} w={(150 * item.width) / item.height} h={150} />
      </Div>
    </Div>
  );
};

export default SignInScreen;
