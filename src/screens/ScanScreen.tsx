import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef} from 'react';
import {Text, TouchableOpacity, Linking} from 'react-native';
import {ChevronLeft} from 'react-native-feather';
import QRCodeScanner from 'react-native-qrcode-scanner';
import BottomPopup from 'src/components/common/BottomPopup';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {NftProfileSummary} from 'src/components/common/NftProfileSummaryBottomSheetScrollView';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import Colors from 'src/constants/Colors';
import apis from 'src/modules/apis';
import {HAS_NOTCH} from 'src/modules/constants';
import {DEVICE_HEIGHT, DEVICE_WIDTH} from 'src/modules/styles';
import {
  useApiSelector,
  useReloadGETWithToken,
  useReloadPOSTWithToken,
} from 'src/redux/asyncReducer';
import {useQrLogin} from 'src/redux/appReducer';
import {useGotoHome, useGotoOnboarding, useGotoScan} from 'src/hooks/useGoto';

export enum ScanType {
  Nft,
  Login,
}

export default function ScanScreen({
  route: {
    params: {scanType},
  },
}) {

  const {data: qrRes, isLoading: qrLoad, error} = useApiSelector(
    scanType == ScanType.Nft 
    ? apis.nft.qr
    : apis.auth.jwt.qrLogin
  );
  const {goBack} = useNavigation();
  const gotoOnboarding = useGotoOnboarding(); 
  const gotoHome = useGotoHome();
  const login = useQrLogin();
  const bottomPopupRef = useRef<BottomSheetModal>(null);
  const reloadGETWithToken = useReloadGETWithToken();
  const onSuccess = ({data}) => {
    scanType == ScanType.Nft 
    ? reloadGETWithToken(apis.nft.qr(data))
    : login(
      data,
      props => {
        if (props.data.user.main_nft) {
          gotoHome();
          return;
        }
        gotoOnboarding();
      },
    );
  };
  useEffect(() => {
    if(scanType == ScanType.Nft) {
      if (qrRes?.nft && !error) {
        bottomPopupRef?.current.expand();
      }
    }
    else {
      console.log(qrRes)
    }
    
  }, [qrRes, qrLoad, error]);

  const headerHeight = HAS_NOTCH ? 94 : 70;

  return (
    <>
      <Div h={headerHeight} zIndex={100}>
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
            <Div auto rounded100 onPress={goBack}>
              <ChevronLeft
                width={30}
                height={30}
                color="black"
                strokeWidth={2}
              />
            </Div>
          </Col>
          <Col auto>
            <Span bold fontSize={19}>
              인증코드 스캔
            </Span>
          </Col>
          <Col />
        </Row>
      </Div>
      <QRCodeScanner
        reactivate
        reactivateTimeout={3000}
        onRead={onSuccess}
        topViewStyle={{flex: 0}}
        cameraStyle={{height: DEVICE_HEIGHT - 2 * headerHeight}}
      />
      <BottomPopup
        ref={bottomPopupRef}
        snapPoints={[200 + headerHeight]}
        index={-1}>
        {qrRes?.nft && <NftProfileSummary nft={qrRes.nft} token={qrRes.jwt} />}
      </BottomPopup>
    </>
  );
}
