import React, {memo} from 'react';
import {Clipboard} from 'react-native';
import {Copy} from 'react-native-feather';
import Colors from 'src/constants/Colors';
import {useGotoCommunityWalletProfile} from 'src/hooks/useGoto';
import {truncateAddress} from 'src/modules/blockchainUtils';
import {smallBump} from 'src/modules/hapticFeedBackUtils';
import {ICONS} from 'src/modules/icons';
import {resizeImageUri} from 'src/modules/uriUtils';
import {Col} from './Col';
import {Div} from './Div';
import {Img} from './Img';
import {Row} from './Row';
import {Span} from './Span';

function CommunityWallet({communityWallet, width, verticalList = false}) {
  const gotoCommunityWalletProfile = useGotoCommunityWalletProfile({
    communityWallet,
  });
  const actionIconDefaultProps = {
    width: 12,
    height: 12,
    color: Colors.gray[500],
    strokeWidth: 1.7,
  };
  const copyToClipboard = () => {
    smallBump();
    Clipboard.setString(communityWallet.address);
  };
  return (
    <Div
      w={width - 30}
      border={0.5}
      borderGray200
      rounded10
      py8
      px15
      mx15
      mb8={verticalList}
      onPress={gotoCommunityWalletProfile}>
      <Row itemsCenter>
        <Col auto mr10>
          <Div>
            <Img
              w30
              h30
              rounded100
              uri={resizeImageUri(communityWallet.image_uri, 100, 100)}
            />
          </Div>
        </Col>
        <Col auto>
          <Row itemsCenter onPress={copyToClipboard}>
            <Col auto mr8>
              <Span fontSize={14} bold>
                {communityWallet.name}
              </Span>
            </Col>
            <Col auto mr8>
              <Span gray700>{truncateAddress(communityWallet.address)}</Span>
            </Col>
            <Col>
              <Copy {...actionIconDefaultProps} />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row itemsCenter justifyCenter>
        <Col auto mr2>
          <Span fontSize={24} bold>
            {communityWallet.balance}
          </Span>
        </Col>
        <Col auto ml2>
          <Img h20 w20 source={ICONS.klayIcon}></Img>
        </Col>
      </Row>
    </Div>
  );
}

export default memo(CommunityWallet);
