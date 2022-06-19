import React, {useEffect, useState} from 'react';
import {Div} from 'src/components/common/Div';
import {Img} from 'src/components/common/Img';
import {Span} from 'src/components/common/Span';
import {IMAGES} from 'src/modules/images';
import {KeyboardAvoidingView} from 'src/modules/viewComponents';
import {DEVICE_WIDTH} from 'src/modules/styles';
import QRCode from 'react-native-qrcode-svg';
import {useApiSelector, useReloadPOSTWithToken} from 'src/redux/asyncReducer';
import apis from 'src/modules/apis';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';
import {ActivityIndicator, Platform} from 'react-native';
import {getNftName, getNftProfileImage} from 'src/modules/nftUtils';
import {Col} from 'src/components/common/Col';
import {ChevronLeft, RefreshCw, X} from 'react-native-feather';
import {useNavigation} from '@react-navigation/native';
import {Row} from 'src/components/common/Row';
import {CustomBlurView} from 'src/components/common/CustomBlurView';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {truncateAddress} from 'src/modules/blockchainUtils';

const QrScreen = () => {
  const {
    data: qrRes,
    isLoading: qrLoad,
    error,
  } = useApiSelector(apis.auth.jwt.qr._);
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
    reloadPostWithToken(apis.auth.jwt.qr._(), {
      contract_address: currentNft.contract_address,
      token_id: currentNft.token_id,
    });
  };
  const notchHeight = useSafeAreaInsets().top;
  const headerHeight = notchHeight + 50;
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      flex={1}
      bgRealBlack>
      <Div h={headerHeight} zIndex={100} absolute top0>
        <Row
          itemsCenter
          py5
          h40
          px15
          zIndex={100}
          absolute
          w={DEVICE_WIDTH}
          top={notchHeight + 5}>
          <Col justifyStart>
            <Div auto rounded100 onPress={goBack}>
              <X width={30} height={30} color="white" strokeWidth={2} />
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
                <CustomBlurView
                  blurType="xlight"
                  blurAmount={5}
                  blurRadius={5}
                  overlayColor=""
                  style={{
                    top: 0,
                    width: 200,
                    height: 200,
                    position: 'absolute',
                  }}></CustomBlurView>
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
              컨트렉 주소: {truncateAddress(currentNft.contract_address)}
            </Span>
          </Div>
          <Div mt10>
            <Span gray700 fontSize={14}>
              토큰 아이디: {currentNft.token_id}
            </Span>
          </Div>
          <Row mt20 itemsCenter>
            <Col auto mr10>
              <Span
                bold
                fontSize={20}
                primary={!qrLoad}
                danger={ttl.minutes < 0 && !qrLoad}>
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
