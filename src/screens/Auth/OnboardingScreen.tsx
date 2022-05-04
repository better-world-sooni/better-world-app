import {CommonActions, useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Alert} from 'react-native';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {Img} from 'src/components/common/Img';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import {NAV_NAMES} from 'src/modules/navNames';
import {appActions, useChangeAccount, useLogin} from 'src/redux/appReducer';
import BottomPopup from 'src/components/common/BottomPopup';
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {useApiSelector, usePutPromiseFnWithToken} from 'src/redux/asyncReducer';
import apis from 'src/modules/apis';
import {getNftName, getNftProfileImage} from 'src/modules/nftUtils';
import {useDispatch} from 'react-redux';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faExclamationTriangle} from '@fortawesome/free-solid-svg-icons';
import Colors from 'src/constants/Colors';

const OnboardingScreen = ({navigation}) => {
  const bottomPopupRef = useRef<BottomSheetModal>(null);
  const {data: profileRes, isLoading: profileLoad} = useApiSelector(
    apis.profile._,
  );

  return (
    <Div bgPrimary flex justifyCenter>
      <Div px15 pb50>
        <Div>
          <Row itemsCenter>
            <Col auto>
              <Span fontSize={20} white>
                <Span bold fontSize={30}>
                  곰즈를 시작으로{'\n'}PFP에게 생명을 불어넣어요{'\n'}
                </Span>
                BetterWorld alpha{'\n'}
              </Span>
            </Col>
            <Col></Col>
          </Row>
        </Div>
      </Div>
      <BottomPopup
        ref={bottomPopupRef}
        snapPoints={['30%', '90%']}
        index={0}
        enablePanDownToClose={false}
        backdrop={false}>
        <BottomSheetScrollView>
          <Div px15>
            <Div itemsCenter mt15>
              <Span fontSize={12} bold>
                새로운 로그인 시에 깨울 Identity를 선택하세요.
              </Span>
            </Div>
            <Div mt15>
              {profileRes?.user?.nfts.map(nft => {
                return <NftIdentity nft={nft} />;
              })}
            </Div>
          </Div>
        </BottomSheetScrollView>
      </BottomPopup>
    </Div>
  );
};

function NftIdentity({nft}) {
  const navigation = useNavigation();
  enum StateType {
    None,
    Loading,
    Error,
  }
  const {contract_address, token_id} = nft;
  const [stateType, setStateType] = useState(StateType.None);
  const changeAccount = useChangeAccount();
  const handlePressIdentity = async () => {
    setStateType(StateType.Loading);
    await changeAccount(
      contract_address,
      token_id,
      props => {
        setStateType(StateType.None);
        navigation.navigate(NAV_NAMES.Home);
      },
      props => {
        setStateType(StateType.Error);
      },
    );
  };

  return (
    <Row
      itemsCenter
      bgGray200
      rounded10
      px10
      py10
      onPress={handlePressIdentity}>
      <Img w50 h50 rounded10 uri={getNftProfileImage(nft, 200, 200)} />
      <Col mx15>
        <Div>
          <Span medium fontSize={20}>
            {getNftName(nft)}
          </Span>
        </Div>
        {getNftName(nft) !== nft.nft_metadatum.name && (
          <Div mt5>
            <Span>{nft.nft_metadatum.name}</Span>
          </Div>
        )}
      </Col>
      {stateType !== StateType.None && (
        <Col auto px10>
          {stateType === StateType.Loading ? (
            <ActivityIndicator />
          ) : (
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              color={Colors.danger.DEFAULT}
            />
          )}
        </Col>
      )}
    </Row>
  );
}

export default OnboardingScreen;
