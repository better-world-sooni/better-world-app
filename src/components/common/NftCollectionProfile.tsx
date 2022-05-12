import {Edit} from 'react-native-feather';
import React, {useRef} from 'react';
import {Col} from './Col';
import {Div} from './Div';
import {Img} from './Img';
import {Row} from './Row';
import {Span} from './Span';
import {resizeImageUri} from 'src/modules/uriUtils';
import ProfileDataTabs from '../ProfileDataTabs';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useIsAdmin} from 'src/modules/nftUtils';
import BottomPopup from './BottomPopup';
import NftCollectionProfileEditBottomSheetScrollView from './NftCollectionProfileEditBottomSheetScrollView';
import useFollow from 'src/hooks/useFollow';
import apis from 'src/modules/apis';

export default function NftCollectionProfile({
  nftCollection,
  isAdmin,
  onPressEditProfile,
}) {
  const [isFollowing, followerCount, handlePressFollowing] = useFollow(
    nftCollection.is_following,
    nftCollection.follower_count,
    apis.follow.contractAddress(nftCollection.contract_address).url,
  );

  return (
    <>
      <Row zIndex={100} px15 mt={-70} relative>
        <Div h80 absolute w={DEVICE_WIDTH} bgWhite bottom0></Div>
        <Col auto mr10 relative>
          <Img
            rounded100
            border3
            borderWhite
            bgGray200
            h150
            w150
            uri={resizeImageUri(nftCollection.image_uri, 400, 400)}></Img>
        </Col>
        <Col justifyEnd>
          <Div>
            <Span fontSize={20} bold>
              {nftCollection.name}
            </Span>
          </Div>
          <Row py5>
            <Col auto mr20>
              <Span>팔로워 {followerCount}</Span>
            </Col>
            <Col />
          </Row>
          <Div py10></Div>
        </Col>
      </Row>
      <Div bgWhite px15>
        <Row py10>
          <Col
            itemsCenter
            rounded100
            bgPrimary
            py10
            onPress={handlePressFollowing}>
            <Span white bold>
              {isFollowing ? '언팔로우' : '팔로우'}
            </Span>
          </Col>
          {isAdmin && (
            <Col
              itemsCenter
              rounded100
              bgPrimary
              py10
              ml5
              onPress={onPressEditProfile}>
              <Span white bold>
                {'프로필 수정'}
              </Span>
            </Col>
          )}
        </Row>
      </Div>
      <ProfileDataTabs
        posts={nftCollection.posts}
        about={nftCollection.about}
        members={nftCollection.nfts}
      />
    </>
  );
}
