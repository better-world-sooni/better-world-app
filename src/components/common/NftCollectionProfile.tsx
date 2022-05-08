import {Edit} from 'react-native-feather';
import React from 'react';
import {Col} from './Col';
import {Div} from './Div';
import {Img} from './Img';
import {Row} from './Row';
import {Span} from './Span';
import {resizeImageUri} from 'src/modules/uriUtils';
import ProfileDataTabs from '../ProfileDataTabs';

export default function NftCollectionProfile({nftCollection}) {
  return (
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
            uri={resizeImageUri(nftCollection.image_uri, 400, 400)}></Img>
        </Col>
        <Col justifyEnd>
          <Row py20>
            <Col />
            <Col auto>
              <Edit strokeWidth={2} color={'white'} height={22} width={22} />
            </Col>
          </Row>
          <Div>
            <Span fontSize={20} bold>
              {nftCollection.name}
            </Span>
          </Div>
          <Row py5>
            <Col auto mr20>
              <Span>팔로워 {nftCollection.follower_count}</Span>
            </Col>
            <Col />
          </Row>
          <Div py10></Div>
        </Col>
      </Row>
      <Div bgWhite px15>
        <Row py10>
          <Col itemsCenter rounded10 border1 borderPrimary py5>
            <Span primary medium>
              팔로우
            </Span>
          </Col>
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
