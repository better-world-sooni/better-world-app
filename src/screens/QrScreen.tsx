import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Div} from 'src/components/common/Div';
import {Img} from 'src/components/common/Img';
import {Span} from 'src/components/common/Span';
import {IMAGES} from 'src/modules/images';
import BottomPopup from 'src/components/common/BottomPopup';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {KeyboardAvoidingView} from 'src/modules/viewComponents';
import {HAS_NOTCH} from 'src/modules/constants';
import {DEVICE_WIDTH} from 'src/modules/styles';
import Carousel from 'react-native-snap-carousel';
import QRCode from 'react-native-qrcode-svg';
import {useApiSelector} from 'src/redux/asyncReducer';
import apis from 'src/modules/apis';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';
import {ActivityIndicator} from 'react-native';

const QrScreen = ({navigation}) => {
  const {data: qrRes, isLoading: qrLoad} = useApiSelector(apis.auth.qr);
  const {currentNft} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );

  return (
    <KeyboardAvoidingView behavior="padding" flex={1} bgPrimary>
      <Div
        top={HAS_NOTCH ? 44 : 20}
        zIndex={100}
        itemsCenter
        justifyEnd
        absolute
        w={DEVICE_WIDTH}>
        <Span bold fontSize={19} mt18 white>
          인증코드
        </Span>
      </Div>
      <Div flex={1} justifyCenter>
        <Div h500 bgWhite mx15 rounded20>
          <Div px30>
            {qrLoad ? (
              <ActivityIndicator />
            ) : (
              <QRCode value="Just some string value" />
            )}
          </Div>
        </Div>
      </Div>
    </KeyboardAvoidingView>
  );
};

export default QrScreen;
