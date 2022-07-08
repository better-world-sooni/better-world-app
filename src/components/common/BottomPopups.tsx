import {BottomSheetModal} from '@gorhom/bottom-sheet';
import React, {useEffect, useRef, useState} from 'react';
import {EventRegister} from 'react-native-event-listeners';
import {shallowEqual, useSelector} from 'react-redux';
import {HAS_NOTCH} from 'src/modules/constants';
import {DEVICE_HEIGHT, DEVICE_WIDTH} from 'src/modules/styles';
import {RootState} from 'src/redux/rootReducer';
import {infoBottomPopupEvent, nftListEvent} from 'src/utils/bottomPopupUtils';
import BottomPopup from './BottomPopup';
import {Div} from './Div';
import NftChooseBottomSheetScrollView from './NftChooseBottomSheetScrollView';
import {Span} from './Span';

const bottomMargin = HAS_NOTCH ? 100 : 80;

export default function BottomPopups() {
  const getSnapPoints = itemsLength => {
    const fullHeight = 0.9 * DEVICE_HEIGHT;
    const unceilingedHeight = itemsLength * 70 + bottomMargin;
    if (unceilingedHeight > fullHeight) return [fullHeight];
    return [unceilingedHeight];
  };
  const bottomPopupRef = useRef<BottomSheetModal>(null);
  const bottomInfoPopupRef = useRef<BottomSheetModal>(null);
  const [bottomInfoPopupText, setBottomInfoPopupText] = useState('');
  const [enableClose, setEnableClose] = useState(true);
  const {currentUser} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );

  const changeNftLoading = isLoading => {
    if (isLoading) {
      setEnableClose(false);
    } else {
      setEnableClose(true);
    }
  };

  useEffect(() => {
    const nftListEventListenerId = EventRegister.addEventListener(
      nftListEvent(),
      () => {
        bottomPopupRef?.current?.expand();
      },
    );
    const infoBottomPopupEventListenerId = EventRegister.addEventListener(
      infoBottomPopupEvent(),
      data => {
        setBottomInfoPopupText(data);
        bottomInfoPopupRef?.current?.expand();
      },
    );
    return () => {
      if (typeof nftListEventListenerId == 'string')
        EventRegister.removeEventListener(nftListEventListenerId);
      if (typeof infoBottomPopupEventListenerId == 'string')
        EventRegister.removeEventListener(infoBottomPopupEventListenerId);
    };
  }, []);
  return (
    <>
      <BottomPopup
        ref={bottomPopupRef}
        snapPoints={getSnapPoints(currentUser?.nfts?.length || 0)}
        index={-1}
        enablePanDownToClose={enableClose}>
        <NftChooseBottomSheetScrollView
          nfts={currentUser?.nfts}
          title={'Identity 변경하기'}
          setCloseDisable={changeNftLoading}
        />
      </BottomPopup>
      <BottomPopup
        ref={bottomInfoPopupRef}
        snapPoints={[bottomMargin + 50]}
        index={-1}>
        <Div itemsCenter px15 justifyCenter>
          <Span fontSize={14} style={{textAlign: 'center'}} bold>
            {bottomInfoPopupText}
          </Span>
        </Div>
        <Div h={bottomMargin}></Div>
      </BottomPopup>
    </>
  );
}
