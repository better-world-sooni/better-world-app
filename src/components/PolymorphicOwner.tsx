import React from 'react';
import {Shield, Zap} from 'react-native-feather';
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
import GradientColorRect from './common/GradientColorRect';

export default function PolymorphicOwner({
  nft,
  isFollowing = false,
  showFollowing = true,
  showPrivilege = false,
  value = null,
}) {
  const {
    handlePressFollowing,
    isFollowing: following,
    isBlocked,
    handlePressBlock,
  } = useFollow(isFollowing, 0, nft.contract_address, nft.token_id);
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
      {value ? (
        <>
          <Col auto pr2>
            <Zap
              strokeWidth={1.8}
              color={Colors.black}
              height={20}
              width={20}
            />
          </Col>
          <Col auto>
            <Span bold fontSize={14}>
              {value}
            </Span>
          </Col>
        </>
      ) : null}
      {showPrivilege && isAdmin && !isCurrentNft && (
        <Col
          auto
          bgAdmin={!privilege}
          px8
          py6
          rounded100
          border={privilege && 0.5}
          borderAdminSoft={privilege}
          onPress={handlePressPrivilege}>
          <Span white={!privilege} adminSoft={privilege} bold px5>
            {!privilege ? '권한 부여' : '권한 취소'}
          </Span>
        </Col>
      )}
      {showFollowing &&
        !isCurrentNft &&
        nft.token_id &&
        (isBlocked ? (
          <Col
            auto
            bgWhite
            p8
            rounded100
            border1
            borderDanger
            ml12
            onPress={handlePressBlock}>
            <Span danger bold px5>
              차단 해제
            </Span>
          </Col>
        ) : (
          <Col
            auto
            bgPrimary={!following}
            py8
            px10
            ml12
            relative
            rounded100
            border={following && 0.5}
            borderGray200
            overflowHidden
            onPress={handlePressFollowing}>
            {!following && (
              <Div absolute>
                <GradientColorRect width={100} height={50} />
              </Div>
            )}
            <Span white={!following} bold px5 fontSize={14}>
              {!nft ? '불러오는 중' : following ? '팔로잉' : '팔로우'}
            </Span>
          </Col>
        ))}
    </Row>
  );
}
