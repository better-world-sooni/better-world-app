import React, {useCallback, useRef, useState} from 'react';
import {Div} from 'src/components/common/Div';
import {shallowEqual, useSelector} from 'react-redux';
import {HAS_NOTCH} from 'src/modules/constants';
import {RootState} from 'src/redux/rootReducer';
import CustomHeaderWebView from 'src/components/CustomHeaderWebView';
import {urls} from 'src/modules/urls';
import {useFocusEffect} from '@react-navigation/native';
import {Row} from 'src/components/common/Row';
import {Col} from 'src/components/common/Col';
import {Span} from 'src/components/common/Span';
import {getNftName, useIsCurrentNft} from 'src/modules/nftUtils';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {ChevronDown} from 'react-native-feather';
import {MenuView} from '@react-native-menu/menu';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import BottomPopup from 'src/components/common/BottomPopup';
import NftProfileSummaryBottomSheetScrollView from 'src/components/common/NftProfileSummaryBottomSheetScrollView';
import {useApiGETWithToken} from 'src/redux/asyncReducer';
import apis from 'src/modules/apis';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function CapsuleScreen({route: {params = null}}) {
  const bottomPopupRef = useRef<BottomSheetModal>(null);
  const {token, currentNft} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const initialCapsuleOwner = params?.nft || currentNft;
  const isCurrentNft = useIsCurrentNft(initialCapsuleOwner);
  const [currentCapsuleOwner, setCurrentCapsuleOwner] =
    useState(initialCapsuleOwner);
  const [pressedNftAvatar, setPressedNftAvatar] = useState(currentCapsuleOwner);
  const apiGETWithToken = useApiGETWithToken();
  const contractAddress = currentCapsuleOwner.contract_address;
  const tokenId = currentCapsuleOwner.token_id;
  const url = urls.capsule.contractAddressAndTokenIdAndJwt(
    contractAddress,
    tokenId,
    token,
  );
  useFocusEffect(
    useCallback(
      () => setCurrentCapsuleOwner(initialCapsuleOwner),
      [initialCapsuleOwner.contract_address, initialCapsuleOwner.token_id],
    ),
  );
  const handleCapsuleMessage = message => {
    if (message.action == 'clickNft') expandNftProfilePopup(message.payload);
  };
  const expandNftProfilePopup = payload => {
    apiGETWithToken(
      apis.nft.contractAddressAndTokenId(
        payload.contract_address,
        payload.token_id,
      ),
    );
    setPressedNftAvatar(payload);
    bottomPopupRef?.current?.expand();
  };
  const notchHeight = useSafeAreaInsets().top;
  const headerHeight = notchHeight + 50;

  const menu = [
    {
      id: 'capsuleOwner',
      title: `${getNftName(initialCapsuleOwner)} 의 캡슐`,
    },
    {
      id: 'currentNft',
      title: `${getNftName(currentNft)} 의 캡슐`,
    },
  ];

  const handlePressMenu = ({nativeEvent: {event}}) => {
    if (event == 'currentNft') {
      setCurrentCapsuleOwner(currentNft);
      return;
    }
    setCurrentCapsuleOwner(initialCapsuleOwner);
  };
  return (
    <>
      <Div flex={1} backgroundColor={'black'} relative>
        <Div h={headerHeight} zIndex={100} absolute>
          <Div
            style={{
              width: DEVICE_WIDTH,
              height: '100%',
              position: 'absolute',
              top: 0,
              opacity: 0.4,
              backgroundColor: 'black',
            }}></Div>
          <Row
            itemsCenter
            py5
            h40
            zIndex={100}
            absolute
            px15
            w={DEVICE_WIDTH}
            top={notchHeight}>
            {isCurrentNft ? (
              <>
                <Col auto mr5>
                  <Span white fontSize={16} bold>
                    {getNftName(currentCapsuleOwner)}의 캡슐
                  </Span>
                </Col>
                <Col></Col>
              </>
            ) : (
              <>
                <Col>
                  <MenuView onPressAction={handlePressMenu} actions={menu}>
                    <Row>
                      <Col auto mr5>
                        <Span white fontSize={16} bold>
                          {getNftName(currentCapsuleOwner)} 의 캡슐
                        </Span>
                      </Col>
                      <Col auto>
                        <ChevronDown color={'white'} width={20} height={20} />
                      </Col>
                    </Row>
                  </MenuView>
                </Col>
                <Col></Col>
              </>
            )}
          </Row>
        </Div>
        <CustomHeaderWebView
          uri={url}
          sharedCookiesEnabled={true}
          thirdPartyCookiesEnabled={true}
          onCapsuleMessage={handleCapsuleMessage}
        />
      </Div>
      <BottomPopup ref={bottomPopupRef} snapPoints={[250]} index={-1}>
        {pressedNftAvatar && (
          <NftProfileSummaryBottomSheetScrollView
            contractAddress={pressedNftAvatar.contract_address}
            tokenId={pressedNftAvatar.token_id}
          />
        )}
      </BottomPopup>
    </>
  );
}

export default CapsuleScreen;
