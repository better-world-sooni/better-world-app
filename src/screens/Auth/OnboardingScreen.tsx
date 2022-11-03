import React from 'react';
import {Div} from 'src/components/common/Div';
import {Span} from 'src/components/common/Span';
import {FlatList} from 'src/components/common/ViewComponents';
import {useApiSelector} from 'src/redux/asyncReducer';
import apis from 'src/modules/apis';
import {NAV_NAMES} from 'src/modules/navNames';
import {NftIdentity} from 'src/components/NftIdentity';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useGotoPickNftCollection} from 'src/hooks/useGoto';
import {Row} from 'src/components/common/Row';
import {Col} from 'src/components/common/Col';
import GradientText from 'src/components/common/GradientText';
import GradientColorRect from 'src/components/common/GradientColorRect';
import {DEVICE_WIDTH} from 'src/modules/styles';

const OnboardingScreen = ({navigation}) => {
  const {data: profileRes, isLoading: profileLoad} = useApiSelector(
    apis.profile._,
  );
  const gotoPickNftCollection = useGotoPickNftCollection();
  const notchHeight = useSafeAreaInsets().top;
  const headerHeight = notchHeight;

  return (
    <Div bgWhite flex={1}>
      <Div h={headerHeight}></Div>
      <Row itemsEnd mx30 mt40>
        <Col auto>
          <GradientText
            text={'Welcome!'}
            fontSize={30}
            width={145}
            height={35}
          />
        </Col>
        <Col></Col>
      </Row>
      <Row itemsEnd mx30 mt10>
        <Col auto>
          <Span fontSize={18} bold>
            최애 NFT를 선택해주세요
          </Span>
        </Col>
        <Col></Col>
      </Row>
      <Div mt50>
        <GradientColorRect width={DEVICE_WIDTH} height={4} />
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
              onSuccess={gotoPickNftCollection}
            />
          );
        }}></FlatList>
    </Div>
  );
};

export default OnboardingScreen;
