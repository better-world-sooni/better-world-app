import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {X} from 'react-native-feather';
import QRCodeScanner from 'react-native-qrcode-scanner';
import BottomPopup from 'src/components/common/BottomPopup';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {NftProfileSummary} from 'src/components/common/NftProfileSummaryBottomSheetScrollView';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import apis from 'src/modules/apis';
import {Colors, DEVICE_HEIGHT, DEVICE_WIDTH} from 'src/modules/styles';
import {
  useApiGETAsync,
  useApiSelector,
  useReloadGETWithToken,
} from 'src/redux/asyncReducer';
import {useQrLogin} from 'src/redux/appReducer';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useGotoHome, useGotoOnboarding} from 'src/hooks/useGoto';
import {RNCamera} from 'react-native-camera';
import {ActivityIndicator} from 'react-native';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';

export enum ScanType {
  Nft,
  Login,
}

export default function ScanScreen({
  route: {
    params: {scanType},
  },
}) {
  const {userToken} = useSelector(
    (root: RootState) => ({userToken: root.app.session.token}),
    shallowEqual,
  );
  const {
    data: qrRes,
    isLoading: qrLoading,
    error,
  } = useApiSelector(
    scanType == ScanType.Nft ? apis.nft.qr : apis.auth.jwt.qr.login,
  );
  const [loading, setLoading] = useState(false);
  const {goBack} = useNavigation();
  const login = useQrLogin();
  const gotoHome = useGotoHome();
  const gotoOnboarding = useGotoOnboarding();
  const bottomPopupRef = useRef<BottomSheetModal>(null);
  const reloadGETWithToken = useReloadGETWithToken();
  const apiGETAsync = useApiGETAsync();
  const onSuccess = async ({data}) => {
    if (loading) return;
    setLoading(true);
    if (scanType == ScanType.Nft) {
      await apiGETAsync(apis.nft.qr(data), userToken, () => {});
    } else {
      await apiGETAsync(apis.auth.jwt.qr.login(data), null, props => {
        login(props.data, data => {
          if (data.user.main_nft) {
            gotoHome();
            return;
          }
          gotoOnboarding();
        });
      });
    }
    setLoading(false);
  };
  useEffect(() => {
    if (qrRes && scanType == ScanType.Nft) bottomPopupRef?.current.expand();
  }, [qrRes]);

  const notchHeight = useSafeAreaInsets().top;
  const headerHeight = notchHeight + 50;

  return (
    <Div flex={1}>
      <Div h={headerHeight} zIndex={100}>
        <Row
          itemsCenter
          py5
          h40
          px15
          zIndex={100}
          absolute
          w={DEVICE_WIDTH}
          top={notchHeight + 5}>
          <Col justifyStart mr10>
            <Div auto rounded100 onPress={goBack}>
              <X width={30} height={30} color={Colors.black} strokeWidth={2} />
            </Div>
          </Col>
          <Col auto>
            <Span bold fontSize={17}>
              {ScanType.Login == scanType ? '큐알로 연결' : '인증코드 스캔'}
            </Span>
          </Col>
          <Col />
        </Row>
      </Div>
      {!loading ? (
        <QRCodeScanner
          fadeIn={false}
          reactivate
          flashMode={RNCamera.Constants.FlashMode.auto}
          reactivateTimeout={5000}
          onRead={onSuccess}
          topViewStyle={{flex: 0}}
          cameraStyle={{height: DEVICE_HEIGHT - 2 * headerHeight}}
        />
      ) : (
        <Div h={DEVICE_HEIGHT} bgBlack>
          <Div flex={1} itemsCenter justifyCenter>
            <ActivityIndicator />
          </Div>
          <Div h={headerHeight} wFull></Div>
        </Div>
      )}
      <BottomPopup
        ref={bottomPopupRef}
        snapPoints={[200 + headerHeight]}
        index={-1}>
        {qrRes?.nft && <NftProfileSummary nft={qrRes.nft} token={qrRes.jwt} />}
      </BottomPopup>
    </Div>
  );
}
