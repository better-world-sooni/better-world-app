import React from 'react';
import {Div} from 'src/components/common/Div';
import {Span} from 'src/components/common/Span';
import {FlatList} from 'src/components/common/ViewComponents';
import {useApiSelector} from 'src/redux/asyncReducer';
import apis from 'src/modules/apis';
import {NAV_NAMES} from 'src/modules/navNames';
import {NftIdentity} from 'src/components/NftIdentity';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const OnboardingScreen = ({navigation}) => {
  const {data: profileRes, isLoading: profileLoad} = useApiSelector(
    apis.profile._,
  );
  const notchHeight = useSafeAreaInsets().top;
  const headerHeight = notchHeight + 50;

  return (
    <Div bgWhite flex={1}>
      <Div h={headerHeight}></Div>
      <Div mx15 borderBottom={0.5} borderGray200>
        <Span bold fontSize={30}>
          주로 사용하실 PFP를{'\n'}선택해 주세요{'\n'}
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
