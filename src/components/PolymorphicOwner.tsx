import React from 'react';
import {Shield} from 'react-native-feather';
import {Colors} from 'src/modules/styles';
import useFollow from 'src/hooks/useFollow';
import {
  useGotoNftCollectionProfile,
  useGotoNftProfile,
} from 'src/hooks/useGoto';
import usePrivilege from 'src/hooks/usePrivilege';
import apis from 'src/modules/apis';
import {
  getNftName,
  getNftProfileImage,
  useIsAdmin,
  useIsCurrentNft,
} from 'src/utils/nftUtils';
import {Col} from './common/Col';
import {Div} from './common/Div';
import {Img} from './common/Img';
import {Row} from './common/Row';
import {Span} from './common/Span';
import {ICONS} from 'src/modules/icons';

export default function PolymorphicOwner({
  nft,
  isFollowing,
  showPrivilege = false,
}) {
  const [following, _followerCount, handlePressFollowing] = useFollow(
    isFollowing,
    0,
    apis.follow.contractAddressAndTokenId(nft.contract_address, nft.token_id)
      .url,
  );
  const isCurrentNft = useIsCurrentNft(nft);
  const isAdmin = useIsAdmin();
  const {privilege, handlePressPrivilege} = usePrivilege(nft);
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
    <Row itemsCenter h64 onPress={handlePressRow} px15 relative>
      <Img w50 h50 rounded100 uri={getNftProfileImage(nft, 150, 150)} />
      <Col mx15>
        <Div>
          <Span medium fontSize={15} bold>
            {getNftName(nft)}{' '}
            {showPrivilege && privilege && (!isAdmin || isCurrentNft) && (
              <Img source={ICONS.sealCheck} h12 w12></Img>
            )}
          </Span>
        </Div>
        {getNftName(nft) !== nft.nft_metadatum.name && (
          <Div mt3>
            <Span gray700 fontSize={12} bold>
              {nft.nft_metadatum.name}
            </Span>
          </Div>
        )}
      </Col>
      {showPrivilege && isAdmin && !isCurrentNft && (
        <Col
          auto
          bgAdmin={!privilege}
          px8
          py6
          rounded100
          mx5
          border={privilege && 0.5}
          borderAdminSoft={privilege}
          onPress={handlePressPrivilege}>
          <Span white={!privilege} adminSoft={privilege} bold px5>
            {!privilege ? '권한 부여' : '권한 취소'}
          </Span>
        </Col>
      )}
      {!isCurrentNft && nft.token_id && (
        <Col
          auto
          bgBlack={!following}
          p8
          rounded100
          border={following && 0.5}
          borderGray200
          onPress={handlePressFollowing}>
          <Span white={!following} bold px5 fontSize={14}>
            {!nft ? '불러오는 중' : following ? '팔로잉' : '팔로우'}
          </Span>
        </Col>
      )}
    </Row>
  );
}
