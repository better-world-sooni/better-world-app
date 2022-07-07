import React from 'react';
import {getNftCollectionProfileImage} from 'src/utils/nftUtils';
import {Col} from './Col';
import {Div} from './Div';
import {Img} from './Img';
import {Row} from './Row';
import {Span} from './Span';

export default function CommunityWalletHeader({communityWallet}) {
  return (
    <Div py5 px15 itemsCenter justifyCenter bgGray200>
      <Div style={{textAlign: 'center'}}>
        <Span bold>{communityWallet.about}</Span>
      </Div>
      <Row itemsCenter mt4>
        <Col auto>
          <Row itemsCenter>
            <Col auto mr2>
              <Span gray700>by </Span>
            </Col>
            <Col auto mr4>
              {communityWallet && (
                <Img
                  w20
                  h20
                  rounded100
                  uri={getNftCollectionProfileImage(
                    communityWallet.nft_collection,
                    100,
                    100,
                  )}
                />
              )}
            </Col>
            <Col auto mr2>
              <Span bold>{communityWallet.nft_collection?.name}</Span>
            </Col>
          </Row>
        </Col>
      </Row>
    </Div>
  );
}
