import React, {useRef, useState} from 'react';
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
import {getNftName} from 'src/modules/nftUtils';

const CapsuleScreen = ({route: {params}}) => {
  const {currentNft} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const capsuleOwner = params?.nft || currentNft;
  return <Capsule capsuleOwner={capsuleOwner} />;
};

function Capsule({capsuleOwner}) {
  const contractAddress = capsuleOwner.contract_address;
  const tokenId = capsuleOwner.token_id;
  const {token} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const [url, setUrl] = useState(null);
  useFocusEffect(() => {
    setUrl(`http://localhost:3100/${contractAddress}/${tokenId}?jwt=${token}`);
    return () => {
      setUrl(null);
    };
  });
  const handleBwwMessage = message => {};

  return (
    <>
      <Div flex bgBlack relative>
        <Div absolute h100 zIndex={100} w={'100%'}>
          <Div h={HAS_NOTCH ? 44 : 20} />
          <Row itemsCenter>
            <Col ml15>
              <Span fontSize={18} bold white fontFamily={'UniSans'}>
                {getNftName(capsuleOwner)}의 캡슐
              </Span>
            </Col>
            <Col />
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
