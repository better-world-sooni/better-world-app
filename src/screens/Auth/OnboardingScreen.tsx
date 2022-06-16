import React, {useRef} from 'react';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import {FlatList, ScrollView} from 'src/modules/viewComponents';
import BottomPopup from 'src/components/common/BottomPopup';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useApiSelector} from 'src/redux/asyncReducer';
import apis from 'src/modules/apis';
import NftChooseBottomSheetScrollView from 'src/components/common/NftChooseBottomSheetScrollView';
import {NAV_NAMES} from 'src/modules/navNames';
import {DEVICE_HEIGHT} from 'src/modules/styles';
import {HAS_NOTCH} from 'src/modules/constants';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';
import {NftIdentity} from 'src/components/NftIdentity';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const OnboardingScreen = ({navigation}) => {
  const bottomPopupRef = useRef<BottomSheetModal>(null);
  const {data: profileRes, isLoading: profileLoad} = useApiSelector(
    apis.profile._,
  );
  const {currentUser} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const getSnapPoints = itemsLength => {
    const fullHeight = 0.9 * DEVICE_HEIGHT;
    const unceilingedHeight = itemsLength * 70 + (HAS_NOTCH ? 130 : 110);
    if (unceilingedHeight > fullHeight) return [fullHeight];
    return [unceilingedHeight];
  };
  const notchHeight = useSafeAreaInsets().top;
  const headerHeight = notchHeight + 50;

  return (
    <Div bgPrimary flex={1}>
      <Div h={headerHeight}></Div>
      <Div px15>
        <Span bold fontSize={30} white>
          사용하실 PFP를{'\n'}선택해 주세요{'\n'}
        </Span>
        <Span fontSize={14} white>
          앱 내 프로필을 길게 누를시 변경 가능합니다.{'\n'}
        </Span>
      </Div>
      <FlatList
        px20
        bgWhite
        flex={1}
        data={profileRes?.user?.nfts || []}
        renderItem={({item, index}) => {
          return (
            <NftIdentity
              key={index}
              nft={item}
              setCloseDisable={null}
              onSuccess={() => navigation.navigate(NAV_NAMES.Home)}
            />
          );
        }}></FlatList>
    </Div>
  );
};

export default OnboardingScreen;
