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

export default function ScanScreen() {
  const {data: qrRes, isLoading: qrLoad, error} = useApiSelector(apis.nft.qr);
  const {goBack} = useNavigation();
  const bottomPopupRef = useRef<BottomSheetModal>(null);
  const reloadGETWithToken = useReloadGETWithToken();
  const onSuccess = ({data}) => {
    reloadGETWithToken(apis.nft.qr(data), {
      token: data,
    });
  };
  useEffect(() => {
    if (qrRes?.nft && !error) {
      bottomPopupRef?.current.expand();
    } else {
      bottomPopupRef?.current.collapse();
    }
  }, [qrRes?.nft, qrLoad, error]);

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
            <Span bold fontSize={19}>
              인증코드 스캔
            </Span>
          </Col>
          <Col />
        </Row>
      </Div>
      <QRCodeScanner
        onRead={onSuccess}
        topViewStyle={{flex: 0}}
        bottomContent={
          <Div px15>
            <Span gray700 fontSize={14} style={{textAlign: 'center'}}>
              다른 NFT의 QR을 찍어 팔로우 하고 허그해주세요. 허그를 받은 NFT는
              랭크 스코어가 1 증가합니다. (허그는 같은 NFT에게 하루에 한번 할 수
              있습니다.)
            </Span>
          </Div>
        }
      />
      <BottomPopup ref={bottomPopupRef} snapPoints={[250]} index={-1}>
        {qrRes?.nft && <NftProfileSummary nft={qrRes.nft} />}
      </BottomPopup>
    </>
  );
}
