import React, {useRef} from 'react';
import {Div} from 'src/components/common/Div';
import apis from 'src/modules/apis';
import {useApiSelector, useReloadGETWithToken} from 'src/redux/asyncReducer';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {getNftName, getNftProfileImage, useIsAdmin} from 'src/modules/nftUtils';
import {HAS_NOTCH} from 'src/modules/constants';
import {Row} from './Row';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {Col} from './Col';
import {Img} from './Img';
import {resizeImageUri} from 'src/modules/uriUtils';
import {Span} from './Span';
import TruncatedMarkdown from './TruncatedMarkdown';
import {FollowOwnerType, FollowType} from 'src/screens/FollowListScreen';
import {useGotoFollowList, useGotoProfile} from 'src/hooks/useGoto';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';
import {Award, Layers, List, Map, ThumbsUp} from 'react-native-feather';
import {ICONS} from 'src/modules/icons';

const MyNftCollectionMenu = ({}) => {
  const {data: profileData, isLoading: loading} = useApiSelector(
    apis.nft_collection.profile(),
  );
  const {currentNft} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const textColor = 'rgb(49, 45, 52)';
  const backgroundColor = 'rgb(209, 217, 254)';
  const bottomPopupRef = useRef<BottomSheetModal>(null);
  const reloadGetWithToken = useReloadGETWithToken();
  const onRefresh = () => {
    reloadGetWithToken(apis.nft_collection.profile());
  };
  const nftCollection = profileData?.nft_collection;
  const gotoFollowList = useGotoFollowList({
    followOwnerType: FollowOwnerType.NftCollection,
    contractAddress: nftCollection?.contract_address,
  });
  const goToProfile = useGotoProfile();
  const isAdmin = useIsAdmin(nftCollection);
  const editProfile = () => {
    bottomPopupRef?.current?.expand();
  };
  const notchHeight = HAS_NOTCH ? 44 : 20;
  const headerHeight = notchHeight + 18;

  return (
    <Div flex={1} bg={backgroundColor} relative>
      <Div h={headerHeight} />
      {nftCollection && (
        <>
          <Row zIndex={100} px15 relative>
            <Col auto mr10 relative>
              <Img
                rounded100
                borderWhite
                bgGray200
                h60
                w60
                uri={resizeImageUri(nftCollection.image_uri, 100, 100)}></Img>
            </Col>
          </Row>
          <Div px15 py10>
            <Row itemsCenter>
              <Col auto mr10>
                <Span>
                  <Span fontSize={20} bold color={textColor}>
                    {nftCollection.name}
                  </Span>
                </Span>
              </Col>
            </Row>
            <Row mt10 itemsEnd>
              <Col auto mr5>
                <Span
                  onPress={() => gotoFollowList(FollowType.Followers)}
                  bold
                  color={textColor}
                  fontSize={16}>
                  {nftCollection.follower_count} <Span gray700>팔로워</Span>
                </Span>
              </Col>
              <Col />
            </Row>
            {nftCollection.about ? (
              <Div mt8 bgWhite>
                <TruncatedMarkdown text={nftCollection.about} maxLength={500} />
              </Div>
            ) : null}
            <Div h15></Div>
          </Div>
          <Row px15 itemsCenter py15>
            <Col auto mr20>
              <Map strokeWidth={1.3} color={textColor} height={28} width={28} />
            </Col>
            <Col>
              <Span fontSize={18} color={textColor}>
                로드맵
              </Span>
            </Col>
          </Row>
          <Row px15 itemsCenter py15>
            <Col auto mr20>
              <Layers
                strokeWidth={1.3}
                color={textColor}
                height={28}
                width={28}
              />
            </Col>
            <Col>
              <Span fontSize={18} color={textColor}>
                멤버들의 모든 포스트
              </Span>
            </Col>
          </Row>
          <Row px15 itemsCenter py15>
            <Col auto mr20>
              <ThumbsUp
                strokeWidth={1.3}
                color={textColor}
                height={28}
                width={28}
              />
            </Col>
            <Col>
              <Span fontSize={18} color={textColor}>
                진행중인 투표
              </Span>
            </Col>
          </Row>
          <Row px15 itemsCenter py15>
            <Col auto mr20>
              <Award
                strokeWidth={1.3}
                color={textColor}
                height={28}
                width={28}
              />
            </Col>
            <Col>
              <Span fontSize={18} color={textColor}>
                파트너
              </Span>
            </Col>
          </Row>
          <Row px15 itemsCenter py15>
            <Col auto mr20>
              <Img h28 w28 source={ICONS.discordIcon} />
            </Col>
            <Col>
              <Span fontSize={18} color={textColor}>
                디스코드
              </Span>
            </Col>
          </Row>
          <Row px15 itemsCenter py15>
            <Col auto mr20>
              <Img h28 w28 source={ICONS.openseaIcon} />
            </Col>
            <Col>
              <Span fontSize={18} color={textColor}>
                오픈씨
              </Span>
            </Col>
          </Row>
        </>
      )}
    </Div>
  );
};

export default MyNftCollectionMenu;
