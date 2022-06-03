import React from 'react';
import {Div} from 'src/components/common/Div';
import {Row} from 'src/components/common/Row';
import {Col} from 'src/components/common/Col';
import {Span} from 'src/components/common/Span';
import apis from 'src/modules/apis';
import {
  useApiSelector,
  usePaginateGETWithToken,
  useReloadGETWithToken,
} from 'src/redux/asyncReducer';
import {Img} from 'src/components/common/Img';
import {
  getNftName,
  getNftProfileImage,
  useIsCurrentNft,
} from 'src/modules/nftUtils';
import {useGotoNftProfile} from 'src/hooks/useGoto';
import useFollow from 'src/hooks/useFollow';
import ListFlatlist from 'src/components/ListFlatlist';

export enum LikeListType {
  Comment = 'comment',
  Post = 'post',
}

const LikeListScreen = ({
  route: {
    params: {likableType, likableId},
  },
}) => {
  const {
    data: likeListRes,
    isLoading: likeListLoad,
    isPaginating: likePaginating,
    page,
  } = useApiSelector(apis.like.list);
  const reloadGetWithToken = useReloadGETWithToken();
  const paginateGetWithToken = usePaginateGETWithToken();
  const handleRefresh = () => {
    if (likeListLoad) return;
    reloadGetWithToken(apis.like.list(likableType, likableId));
  };
  const handleEndReached = () => {
    if (likePaginating) return;
    paginateGetWithToken(
      apis.like.list(likableType, likableId, page + 1),
      'feed',
    );
  };
  return (
    <ListFlatlist
      onRefresh={handleRefresh}
      data={likeListRes ? likeListRes.likes : []}
      refreshing={likeListLoad}
      onEndReached={handleEndReached}
      isPaginating={likePaginating}
      title={'좋아요'}
      renderItem={({item, index}) => {
        return (
          <LikeOwner
            nft={(item as any).nft}
            isFollowing={(item as any).is_following}
          />
        );
      }}
    />
  );
};

function LikeOwner({nft, isFollowing}) {
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
  return (
    <Row itemsCenter h70 onPress={gotoNftProfile} px15 relative>
      <Img w50 h50 rounded100 uri={getNftProfileImage(nft, 100, 100)} />
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

export default LikeListScreen;
