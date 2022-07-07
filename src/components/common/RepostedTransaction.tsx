import React, {memo} from 'react';
import {shallowEqual, useSelector} from 'react-redux';
import {
  useGotoCommunityWalletProfile,
  useGotoTransaction,
} from 'src/hooks/useGoto';
import {ICONS} from 'src/modules/icons';
import {createdAtText} from 'src/utils/timeUtils';
import {resizeImageUri} from 'src/utils/uriUtils';
import {RootState} from 'src/redux/rootReducer';
import {Col} from './Col';
import {Div} from './Div';
import {Img} from './Img';
import {Row} from './Row';
import {Span} from './Span';

function RepostedTransaction({transaction, enablePress = false}) {
  const {currentNft} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const gotoTransaction = useGotoTransaction({
    transactionHash: transaction.transaction_hash,
  });
  const communityWallet =
    transaction.from_community_wallet && transaction.to_community_wallet
      ? transaction.to_community_wallet.contract_address ==
        currentNft.contract_address
        ? transaction.to_community_wallet
        : transaction.from_community_wallet
      : transaction.from_community_wallet || transaction.to_community_wallet;
  const sent =
    communityWallet.address == transaction.from_community_wallet?.address;
  const gotoCommunityWalletProfile = useGotoCommunityWalletProfile({
    communityWallet,
  });
  return (
    <Div
      border={0.5}
      borderGray200
      p12
      rounded10
      mt4
      onPress={enablePress && gotoTransaction}>
      <Row>
        <Col
          auto
          mr8
          onPress={
            enablePress && communityWallet && gotoCommunityWalletProfile
          }>
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
        <Col>
          <Row>
            <Col mr8>
              <Span>
                <Span fontSize={14} bold>
                  {communityWallet.name}
                </Span>
                <Span gray700>
                  {' · '}
                  {createdAtText(transaction.created_at)}
                </Span>
              </Span>
            </Col>
          </Row>
          <Row itemsCenter>
            <Col auto mr8>
              <Span bold danger={sent} info={!sent}>
                {sent ? '출금' : '입금'}
              </Span>
            </Col>
            <Col auto mr2>
              <Span fontSize={24} bold>
                {transaction.value}
              </Span>
            </Col>
            <Col auto ml2>
              <Img h18 w18 source={ICONS.klayIcon}></Img>
            </Col>
          </Row>
        </Col>
      </Row>
    </Div>
  );
}

export default memo(RepostedTransaction);
