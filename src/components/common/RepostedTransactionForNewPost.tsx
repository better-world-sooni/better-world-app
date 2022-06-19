import React, {memo} from 'react';
import {ICONS} from 'src/modules/icons';
import {createdAtText} from 'src/modules/timeUtils';
import {resizeImageUri} from 'src/modules/uriUtils';
import {Col} from './Col';
import {Div} from './Div';
import {Img} from './Img';
import {Row} from './Row';
import {Span} from './Span';

function RepostedTransactionForNewPost({transaction}) {
  const ownerIsFrom = !!transaction.from_owner?.nft_collection;
  const communityWallet = ownerIsFrom
    ? transaction.from_owner
    : transaction.to_owner;
  return (
    <Div border={0.5} borderGray200 p12 rounded10 mt4>
      <Row>
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
              <Span normal danger={ownerIsFrom} info={!ownerIsFrom}>
                {ownerIsFrom ? '출금' : '입금'}
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

export default memo(RepostedTransactionForNewPost);
