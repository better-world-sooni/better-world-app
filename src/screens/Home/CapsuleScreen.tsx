import React, {useCallback, useRef, useState} from 'react';
import {Div} from 'src/components/common/Div';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {HAS_NOTCH} from 'src/modules/constants';
import {RootState} from 'src/redux/rootReducer';
import CustomHeaderWebView from 'src/components/CustomHeaderWebView';
import {urls} from 'src/modules/urls';
import {useChangeAccount} from 'src/redux/appReducer';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {NAV_NAMES} from 'src/modules/navNames';
import {Row} from 'src/components/common/Row';
import {Col} from 'src/components/common/Col';
import {Span} from 'src/components/common/Span';
import {getNftName, useIsCurrentNft} from 'src/modules/nftUtils';
import {BlurView} from '@react-native-community/blur';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {ChevronDown} from 'react-native-feather';
import {MenuView} from '@react-native-menu/menu';

function CapsuleScreen({route: {params}}) {
  const {token, currentNft} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const initialCapsuleOwner = params?.nft || currentNft;
  const isCurrentNft = useIsCurrentNft(initialCapsuleOwner);
  const [currentCapsuleOwner, setCurrentCapsuleOwner] =
    useState(initialCapsuleOwner);
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
  const handleBwwMessage = message => {};
  const headerHeight = HAS_NOTCH ? 84 : 60;

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
      <Div flex backgroundColor={'black'} relative>
        <Div h={HAS_NOTCH ? 44 : 20} />
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
            top={HAS_NOTCH ? 44 : 20}>
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
          onbwwMessage={handleBwwMessage}
        />
      </Div>
    </>
  );
}

export default CapsuleScreen;
