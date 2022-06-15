import React from 'react';
import {Div} from 'src/components/common/Div';
import {HAS_NOTCH} from 'src/modules/constants';
import {Row} from './Row';
import {Col} from './Col';
import {Img} from './Img';
import {Span} from './Span';
import {FollowOwnerType, FollowType} from 'src/screens/FollowListScreen';
import {
  useGotoFollowList,
  useGotoNftProfile,
  useGotoQR,
  useGotoRankDeltum,
  useGotoScan,
} from 'src/hooks/useGoto';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';
import {Grid, Maximize, User, Users} from 'react-native-feather';
import {getNftName, getNftProfileImage} from 'src/modules/nftUtils';
import {ScanType} from 'src/screens/ScanScreen';
import {mediumBump} from 'src/modules/hapticFeedBackUtils';
import {EventRegister} from 'react-native-event-listeners';
import {nftListEvent} from '../BottomTabBar';

const MyNftMenu = ({nft}) => {
  const {currentNft} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const textColor = 'black';
  const backgroundColor = 'white';
  const gotoFollowList = useGotoFollowList({
    followOwnerType: FollowOwnerType.Nft,
    contractAddress: nft?.contract_address,
    tokenId: nft?.token_id,
  });
  const gotoNftProfile = useGotoNftProfile({
    nft,
  });
  const gotoRankDeltum = useGotoRankDeltum({
    contractAddress: nft.contract_address,
    tokenId: nft.token_id,
  });
  const gotoQr = useGotoQR();
  const gotoScan = useGotoScan({scanType: ScanType.Nft});
  const notchHeight = HAS_NOTCH ? 44 : 0;
  const headerHeight = notchHeight + 18;
  const handlePressUsers = () => {
    mediumBump();
    EventRegister.emit(nftListEvent());
  };

  return (
    <Div flex={1} bg={backgroundColor} relative borderRight={0.5} borderGray200>
      <Div h={headerHeight} />
      {nft && (
        <Div px30>
          <Row zIndex={100} itemsCenter>
            <Col auto mr10 onPress={gotoNftProfile}>
              <Img
                rounded100
                borderWhite
                bgGray200
                h60
                w60
                uri={getNftProfileImage(nft, 200, 200)}></Img>
            </Col>
            <Col itemsEnd onPress={handlePressUsers}>
              <Users strokeWidth={1.3} color={'black'} height={24} width={24} />
            </Col>
          </Row>
          <Div py10>
            <Row itemsCenter>
              <Col auto mr10 onPress={gotoNftProfile}>
                <Span>
                  <Span fontSize={20} bold color={textColor}>
                    {getNftName(nft)}
                  </Span>
                </Span>
              </Col>
            </Row>
            <Row itemsCenter mt12>
              <Col
                auto
                mr20
                onPress={() => gotoFollowList(FollowType.Followings)}>
                <Span bold fontSize={13}>
                  <Span gray700 regular fontSize={13}>
                    팔로잉
                  </Span>{' '}
                  {nft.following_count}
                </Span>
              </Col>
              <Col />
            </Row>
            <Row mt10 itemsEnd>
              <Col
                auto
                mr20
                onPress={() => gotoFollowList(FollowType.Followers)}>
                <Span bold fontSize={13}>
                  <Span gray700 regular fontSize={13}>
                    팔로워
                  </Span>{' '}
                  {nft.follower_count}
                </Span>
              </Col>
              <Col />
            </Row>
            <Row mt10 itemsEnd onPress={gotoRankDeltum}>
              <Col auto mr20>
                <Span bold fontSize={13}>
                  <Span gray700 regular fontSize={13}>
                    랭크 스코어
                  </Span>{' '}
                  {nft.current_rank_score}
                </Span>
              </Col>
              <Col />
            </Row>
          </Div>
          <Row itemsCenter py16 onPress={gotoNftProfile}>
            <Col auto mr16>
              <User strokeWidth={1.3} color={'black'} height={24} width={24} />
            </Col>
            <Col>
              <Span fontSize={16}>프로필</Span>
            </Col>
          </Row>
          <Row itemsCenter py16 onPress={gotoQr}>
            <Col auto mr16>
              <Grid strokeWidth={1.3} color={'black'} height={24} width={24} />
            </Col>
            <Col>
              <Span fontSize={16}>QR 코드</Span>
            </Col>
          </Row>
          <Row itemsCenter py16 onPress={gotoScan}>
            <Col auto mr16>
              <Maximize
                strokeWidth={1.3}
                color={'black'}
                height={24}
                width={24}
              />
            </Col>
            <Col>
              <Span fontSize={16}>QR 스케너</Span>
            </Col>
          </Row>
        </Div>
      )}
    </Div>
  );
};

export default MyNftMenu;
