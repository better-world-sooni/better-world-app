import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Div} from 'src/components/common/Div';
import {Img} from 'src/components/common/Img';
import {Span} from 'src/components/common/Span';
import {IMAGES} from 'src/modules/images';
import BottomPopup from 'src/components/common/BottomPopup';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {KeyboardAvoidingView} from 'src/modules/viewComponents';
import {HAS_NOTCH, truncateKlaytnAddress} from 'src/modules/constants';
import {DEVICE_WIDTH} from 'src/modules/styles';
import Carousel from 'react-native-snap-carousel';
import QRCode from 'react-native-qrcode-svg';
import {
  useApiSelector,
  useReloadGETWithToken,
  useReloadPOSTWithToken,
} from 'src/redux/asyncReducer';
import apis from 'src/modules/apis';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';
import {ActivityIndicator} from 'react-native';
import {getNftName, getNftProfileImage} from 'src/modules/nftUtils';
import {Col} from 'src/components/common/Col';
import {ChevronLeft, RefreshCw} from 'react-native-feather';
import {useNavigation} from '@react-navigation/native';
import {Row} from 'src/components/common/Row';
import {BlurView} from '@react-native-community/blur';

const QrScreen = () => {
  const {data: qrRes, isLoading: qrLoad, error} = useApiSelector(apis.auth.qr);
  const {currentNft} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const {goBack} = useNavigation();
  const [ttl, setTtl] = useState({
    minutes: 2,
    seconds: 0,
  });
  const reloadPostWithToken = useReloadPOSTWithToken();
  const handleRefresh = () => {
    reloadPostWithToken(apis.auth.qr(), {
      contract_address: currentNft.contract_address,
      token_id: currentNft.token_id,
    });
  };
  const headerHeight = HAS_NOTCH ? 94 : 70;
  useEffect(() => {
    if (qrRes) {
      const dateInt = qrRes?.exp * 1000;
      const remainingSeconds = Math.floor(
        (dateInt - new Date().getTime()) / 1000,
      );
      setTtl({
        minutes: Math.floor(remainingSeconds / 60),
        seconds: remainingSeconds % 60,
      });
      const interval = setInterval(() => {
        const remainingSeconds = Math.floor(
          (dateInt - new Date().getTime()) / 1000,
        );
        setTtl({
          minutes: Math.floor(remainingSeconds / 60),
          seconds: remainingSeconds % 60,
        });
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [qrRes?.exp]);

  return (
    <KeyboardAvoidingView behavior="padding" flex={1} bgPrimary>
      <Div h={headerHeight} zIndex={100} absolute top0>
        <Row
          itemsCenter
          py5
          h40
          px15
          zIndex={100}
          absolute
          w={DEVICE_WIDTH}
          top={HAS_NOTCH ? 49 : 25}>
          <Col justifyStart mr10>
            <Div bgRealBlack p5 rounded100 onPress={goBack} w30>
              <ChevronLeft
                width={20}
                height={20}
                color="white"
                strokeWidth={2}
              />
            </Div>
          </Col>
          <Col auto>
            <Span bold fontSize={19} white>
              인증코드
            </Span>
          </Col>
          <Col />
        </Row>
      </Div>
      <Div flex={1} justifyCenter>
        <Div h500 bgWhite mx30 rounded20 justifyCenter itemsCenter relative>
          <Div w200 h200 justifyCenter itemsCenter>
            {qrLoad ? (
              <ActivityIndicator size={'large'} />
            ) : (
              <QRCode
                size={200}
                logoSize={60}
                value={qrRes ? qrRes.jwt : 'BetterWorld'}
                logo={{uri: getNftProfileImage(currentNft)}}
              />
            )}
            {error && (
              <>
                <BlurView
                  blurType="xlight"
                  blurAmount={5}
                  blurRadius={5}
                  style={{
                    top: 0,
                    width: 200,
                    height: 200,
                    position: 'absolute',
                  }}
                  reducedTransparencyFallbackColor="white"></BlurView>
                <Img
                  source={IMAGES.betterWorldBlueLogo}
                  h100
                  w100
                  top50
                  absolute></Img>
              </>
            )}
          </Div>
          <Div mt20>
            <Span bold fontSize={28}>
              {getNftName(currentNft)}
            </Span>
          </Div>
          {getNftName(currentNft) !== currentNft.nft_metadatum.name && (
            <Div mt10>
              <Span gray700 fontSize={14}>
                {currentNft.nft_metadatum.name}
              </Span>
            </Div>
          )}
          <Div mt10>
            <Span gray700 fontSize={14}>
              컨트렉 주소: {truncateKlaytnAddress(currentNft.contract_address)}
            </Span>
          </Div>
          <Div mt10>
            <Span gray700 fontSize={14}>
              토큰 아이디: {currentNft.token_id}
            </Span>
          </Div>
          <Row mt20 itemsCenter>
            <Col auto mr10>
              <Span bold fontSize={20} primary={!qrLoad}>
                {error
                  ? '인증코드 요청 오류'
                  : qrLoad
                  ? '인증코드 불러오는 중'
                  : ttl.minutes < 0
                  ? '유효기간 만료'
                  : `잔여 ${ttl.minutes}분 ${ttl.seconds}초`}
              </Span>
            </Col>
            <Col auto p8 rounded100 bgBlack onPress={handleRefresh}>
              <RefreshCw
                strokeWidth={2}
                color={'white'}
                height={16}
                width={16}
              />
            </Col>
          </Row>
        </Div>
      </Div>
    </KeyboardAvoidingView>
  );
};

export default QrScreen;
