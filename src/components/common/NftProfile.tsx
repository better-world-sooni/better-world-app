import {ChevronLeft, Edit, PlusSquare} from 'react-native-feather';
import React, {useCallback, useRef} from 'react';
import {
  getNftName,
  getNftProfileImage,
  useIsCurrentNft,
} from 'src/modules/nftUtils';
import {Col} from './Col';
import {Div} from './Div';
import Feed from './Feed';
import {Img} from './Img';
import {Row} from './Row';
import {Span} from './Span';
import {
  useApiGETWithToken,
  usePromiseFnWithToken,
} from 'src/redux/asyncReducer';
import apis from 'src/modules/apis';
import {useNavigation} from '@react-navigation/native';
import {NAV_NAMES} from 'src/modules/navNames';
import {RefreshControl} from 'react-native';
import {FlatList} from 'src/modules/viewComponents';
import Post from './Post';
import TruncatedMarkdown from './TruncatedMarkdown';
import useFollow from 'src/hooks/useFollow';
import {ICONS} from 'src/modules/icons';
import {HAS_NOTCH} from 'src/modules/constants';
import {DEVICE_WIDTH} from 'src/modules/styles';
import BottomPopup from './BottomPopup';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import NftProfileEditBottomSheetScrollView from './NftProfileEditBottomSheetScrollView';

export default function NftProfile({
  nft,
  refreshing,
  onRefresh,
  enableBack = true,
}) {
  const bottomPopupRef = useRef<BottomSheetModal>(null);
  const navigation = useNavigation();
  const apiGETWithToken = useApiGETWithToken();
  const isCurrentNft = useIsCurrentNft(nft);
  const goToProfile = useCallback(() => {
    apiGETWithToken(
      apis.nft_collection.contractAddress.profile(nft.contract_address),
    );
    navigation.navigate(NAV_NAMES.NftCollection, {
      contractAddress: nft.contract_address,
    });
  }, [nft.contract_address]);
  const goToCapsule = useCallback(() => {
    navigation.navigate(NAV_NAMES.Capsule, {
      nft,
    });
  }, [nft]);
  const editProfile = () => {
    bottomPopupRef?.current?.expand();
  };
  const [isFollowing, followerCount, handlePressFollowing] = useFollow(
    nft.is_following,
    nft.follower_count,
    apis.follow.contractAddressAndTokenId(nft.contract_address, nft.token_id)
      .url,
  );
  const {goBack} = useNavigation();

  return (
    <>
      <FlatList
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <Div w={'100%'} zIndex={100} h170>
              <Div h={HAS_NOTCH ? 44 : 20} />
              <Row itemsCenter py8 zIndex={100}>
                {enableBack && (
                  <Col auto ml15 bgBlack p5 rounded100 onPress={goBack}>
                    <ChevronLeft
                      width={20}
                      height={20}
                      color="white"
                      strokeWidth={3}
                    />
                  </Col>
                )}
                <Col ml10></Col>
                <Col auto mr15 bgBlack p8 rounded100 onPress={goToCapsule}>
                  <Div>
                    <Img w20 h20 source={ICONS.capsuleIconWhite}></Img>
                  </Div>
                </Col>
                <Col auto mr15 bgBlack p8 rounded100>
                  <Div>
                    <PlusSquare
                      strokeWidth={2}
                      color={'white'}
                      height={20}
                      width={20}
                    />
                  </Div>
                </Col>
              </Row>
            </Div>
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
                  uri={getNftProfileImage(nft, 200, 200)}></Img>
              </Col>
              <Col justifyEnd>
                <Div>
                  <Span fontSize={20} bold>
                    {getNftName(nft)}
                  </Span>
                </Div>
                <Div pb5 onPress={goToProfile}>
                  <Span gray600>{nft.nft_metadatum.name}</Span>
                </Div>
                <Row py5>
                  <Col auto mr20>
                    <Span>팔로워 {followerCount}</Span>
                  </Col>
                  <Col auto>
                    <Span>팔로잉 {nft.following_count}</Span>
                  </Col>
                  <Col />
                </Row>
              </Col>
            </Row>
            {!isCurrentNft ? (
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
                  <Col itemsCenter rounded100 bgPrimary py10 mx5>
                    <Span white bold>
                      Message
                    </Span>
                  </Col>
                  <Col
                    onPress={goToCapsule}
                    auto
                    itemsCenter
                    justifyCenter
                    rounded100
                    border1
                    borderPrimary
                    w36>
                    <Img h18 w18 source={ICONS.capsuleIconPrimary}></Img>
                  </Col>
                </Row>
              </Div>
            ) : (
              <Div bgWhite px15>
                <Row py10>
                  <Col
                    itemsCenter
                    rounded100
                    bgPrimary
                    py10
                    mx5
                    onPress={editProfile}>
                    <Span white bold>
                      프로파일 수정
                    </Span>
                  </Col>
                </Row>
              </Div>
            )}
            {nft.story ? (
              <Div py25 px15 bgWhite borderBottom={0.5} borderGray200>
                <TruncatedMarkdown text={nft.story} maxLength={300} />
              </Div>
            ) : null}
          </>
        }
        data={nft.posts}
        renderItem={({item}) => <Post post={item} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }></FlatList>
      {isCurrentNft && (
        <BottomPopup ref={bottomPopupRef} snapPoints={['90%']} index={-1}>
          <NftProfileEditBottomSheetScrollView nft={nft} />
        </BottomPopup>
      )}
    </>
  );
}
