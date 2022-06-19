import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {ChevronDown, ChevronLeft} from 'react-native-feather';
import Colors from 'src/constants/Colors';
import {truncateAddress} from 'src/modules/blockchainUtils';
import {ICONS} from 'src/modules/icons';
import {resizeImageUri} from 'src/modules/uriUtils';
import {Col} from './Col';
import {Div} from './Div';
import {Img} from './Img';
import {Row} from './Row';
import {Span} from './Span';

export default function CommunityWalletTopBar({communityWallet, onPressDown}) {
  const {goBack} = useNavigation();

  return (
    <Row itemsCenter px7>
      <Col auto>
        <Div auto rounded100 onPress={goBack}>
          <ChevronLeft width={30} height={30} color="black" strokeWidth={2} />
        </Div>
      </Col>
      <Col auto mr8>
        <Div>
          <Img
            w40
            h40
            border={0.5}
            borderGray200
            rounded100
            uri={resizeImageUri(communityWallet.image_uri, 200, 200)}
          />
        </Div>
      </Col>
      <Col onPress={onPressDown}>
        <Row itemsCenter>
          <Col auto mr8>
            <Span fontSize={14} bold>
              {communityWallet.name}
            </Span>
          </Col>
          <Col auto mr8>
            <Span gray700 fontSize={14}>
              {truncateAddress(communityWallet.address)}
            </Span>
          </Col>
        </Row>
        <Row itemsCenter>
          <Col auto mr2>
            <Span fontSize={18} bold>
              {communityWallet.balance}
            </Span>
          </Col>
          <Col auto ml2>
            <Img h14 w14 source={ICONS.klayIcon}></Img>
          </Col>
          <Col auto ml2>
            <ChevronDown color={Colors.gray[200]} width={20} height={20} />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
