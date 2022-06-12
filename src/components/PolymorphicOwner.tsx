import React from 'react';
import useFollow from 'src/hooks/useFollow';
import {
  useGotoNftCollectionProfile,
  useGotoNftProfile,
} from 'src/hooks/useGoto';
import apis from 'src/modules/apis';
import {
  getNftName,
  getNftProfileImage,
  useIsCurrentNft,
} from 'src/modules/nftUtils';
import {Col} from './common/Col';
import {Div} from './common/Div';
import {Img} from './common/Img';
import {Row} from './common/Row';
import {Span} from './common/Span';

export default function PolymorphicOwner({nft, isFollowing}) {
  const [following, _followerCount, handlePressFollowing] = useFollow(
    isFollowing,
    0,
    apis.follow.contractAddressAndTokenId(nft.contract_address, nft.token_id)
      .url,
  );
  const isCurrentNft = useIsCurrentNft(nft);
  const gotoNftProfile = useGotoNftProfile({
    nft,
  });
  const gotoNftCollectionProfile = useGotoNftCollectionProfile({
    nftCollection: nft,
  });
  const handlePressRow = () => {
    if (nft.token_id) {
      gotoNftProfile();
      return;
    }
    gotoNftCollectionProfile();
  };
  
  return (
    <Row itemsCenter h70 onPress={handlePressRow} px15 relative>
      <Img w50 h50 rounded100 uri={getNftProfileImage(nft, 150, 150)} />
      <Col mx15>
        <Div>
          <Span medium fontSize={15} bold>
            {getNftName(nft)}
          </Span>
        </Div>
        {getNftName(nft) !== nft.nft_metadatum.name && (
          <Div mt3>
            <Span gray600 fontSize={12}>
              {nft.nft_metadatum.name}
            </Span>
          </Div>
        )}
      </Col>
      <Col />
      {!isCurrentNft && (
        <Col
          auto
          bgRealBlack={!following}
          p8
          rounded100
          border1={following}
          borderGray400={following}
          onPress={handlePressFollowing}>
          <Span white={!following} bold px5>
            {following ? '언팔로우' : '팔로우'}
          </Span>
        </Col>
      )}
    </Row>
  );
}
