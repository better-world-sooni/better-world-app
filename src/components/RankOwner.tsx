import React, {memo} from 'react';
import {useGotoNftProfile} from 'src/hooks/useGoto';
import {resizeImageUri} from 'src/modules/uriUtils';
import {Col} from './common/Col';
import {Div} from './common/Div';
import {Img} from './common/Img';
import {Row} from './common/Row';
import {Span} from './common/Span';

export default function RankedOwner({rankItem}) {
  const gotoNftProfile = useGotoNftProfile({
    nft: {
      contract_address: rankItem.contract_address,
      token_id: rankItem.token_id,
      name: rankItem.nft_name,
      image_uri: rankItem.nft_image_uri,
      nft_metadatum: {
        name: rankItem.nft_metadatum_name,
        image_uri: rankItem.nft_metadatum_image_uri,
      },
    },
  });
  return <RankMemo {...rankItem} gotoNftProfile={() => gotoNftProfile()} />;
}

const RankMemo = memo(RankOwnerContent);

function RankOwnerContent({
  contribution,
  nft_metadatum_name,
  nft_name,
  nft_image_uri,
  nft_metadatum_image_uri,
  gotoNftProfile,
}) {
  return (
    <Row itemsCenter h70 onPress={gotoNftProfile} px15 relative>
      <Img
        w50
        h50
        rounded100
        uri={
          nft_image_uri
            ? resizeImageUri(nft_image_uri, 200, 200)
            : nft_metadatum_image_uri
        }
      />
      <Col mx15>
        <Div>
          <Span medium fontSize={15} bold>
            {nft_name || nft_metadatum_name}
          </Span>
        </Div>
        {nft_name && (
          <Div mt3>
            <Span gray600 fontSize={12}>
              {nft_metadatum_name}
            </Span>
          </Div>
        )}
      </Col>
      <Col auto mr10 itemsCenter justifyCenter>
        <Span gray700>
          <Span bold black>
            {Math.round(contribution * 10) / 10}
          </Span>{' '}
          인분 기여
        </Span>
      </Col>
    </Row>
  );
}
