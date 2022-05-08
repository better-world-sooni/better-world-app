import {Edit} from 'react-native-feather';
import React, {useCallback} from 'react';
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
import {useApiGETWithToken} from 'src/redux/asyncReducer';
import apis from 'src/modules/apis';
import {useNavigation} from '@react-navigation/native';
import {NAV_NAMES} from 'src/modules/navNames';
import {RefreshControl} from 'react-native';
import {FlatList} from 'src/modules/viewComponents';
import Post from './Post';

export default function NftProfile({nft, refreshing, onRefresh}) {
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
  }, []);
  return (
    <FlatList
      bgWhite
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <>
          <Div bgPrimary h100 mb={-70}></Div>
          <Row zIndex={100} px15>
            <Col auto mr10 relative>
              <Img
                rounded100
                border3
                borderWhite
                h150
                w150
                uri={getNftProfileImage(nft, 400, 400)}></Img>
            </Col>
            <Col justifyEnd>
              <Row py20>
                <Col />
                <Col auto>
                  <Edit
                    strokeWidth={2}
                    color={'white'}
                    height={22}
                    width={22}
                  />
                </Col>
              </Row>
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
                  <Span>팔로워 {nft.follower_count}</Span>
                </Col>
                <Col auto>
                  <Span>팔로잉 {nft.following_count}</Span>
                </Col>
                <Col />
              </Row>
            </Col>
          </Row>
          {!isCurrentNft && (
            <Div bgWhite px15>
              <Row py10>
                <Col itemsCenter rounded10 border1 borderPrimary py5>
                  <Span primary medium>
                    팔로우
                  </Span>
                </Col>
                <Col itemsCenter rounded10 border1 borderPrimary py5 mx5>
                  <Span primary medium>
                    Message
                  </Span>
                </Col>
                <Col itemsCenter rounded10 border1 borderPrimary py5>
                  <Span primary medium>
                    캡슐 입장
                  </Span>
                </Col>
              </Row>
            </Div>
          )}
          <Div py10 px15 bgWhite borderBottom={0.5} borderGray200>
            <Span fontSize={18} bold>
              스토리
            </Span>
            <Span py5>{nft.story}</Span>
          </Div>
        </>
      }
      data={nft.posts}
      renderItem={({item}) => <Post post={item} />}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }></FlatList>
  );
}
