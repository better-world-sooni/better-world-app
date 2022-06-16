import React, {useState} from 'react';
import {Clipboard} from 'react-native';
import {ChevronRight, Copy} from 'react-native-feather';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import Colors from 'src/constants/Colors';
import {useGotoNftCollectionProfile} from 'src/hooks/useGoto';
import {truncateKlaytnAddress} from 'src/modules/constants';
import {smallBump} from 'src/modules/hapticFeedBackUtils';
import {ICONS} from 'src/modules/icons';
import {getNftCollectionProfileImage, getNftName} from 'src/modules/nftUtils';
import {Col} from './Col';
import {Div} from './Div';
import {Img} from './Img';
import {Row} from './Row';
import {Span} from './Span';

export default function CommunityWalletSlideShow({
  communityWallets,
  sliderWidth,
  roundedTopOnly = false,
  enablePagination = true,
}) {
  const [currentPage, setCurrentPage] = useState(0);
  return (
    <>
      <Div
        rounded10={!roundedTopOnly}
        borderBottomRight={10}
        borderBottomLeft={10}
        overflowHidden>
        <Carousel
          data={communityWallets}
          itemWidth={sliderWidth}
          sliderWidth={sliderWidth}
          renderItem={({item}) => (
            <CommunityWalletItem communityWallet={item} width={sliderWidth} />
          )}
          onSnapToItem={index => setCurrentPage(index)}
        />
      </Div>
      {enablePagination && (
        <Div flex={1} itemsCenter justifyCenter>
          <Pagination
            dotsLength={communityWallets.length}
            activeDotIndex={currentPage}
            containerStyle={{
              paddingTop: 8,
              paddingBottom: 0,
              borderRadius: 100,
            }}
            dotStyle={{
              width: 7,
              height: 7,
              borderRadius: 5,
              marginHorizontal: -5,
            }}
            inactiveDotColor={Colors.gray[400]}
            inactiveDotScale={1}
            dotColor={Colors.primary.DEFAULT}
          />
        </Div>
      )}
    </>
  );
}

function CommunityWalletItem({communityWallet, width}) {
  const gotoNftCollectionProfile = useGotoNftCollectionProfile(
    communityWallet.nft_collection,
  );
  const actionIconDefaultProps = {
    width: 18,
    height: 18,
    color: Colors.gray[700],
    strokeWidth: 1.7,
  };
  const copyToClipboard = () => {
    smallBump();
    Clipboard.setString(communityWallet.address);
  };
  return (
    <Div w={width - 30} border={0.5} borderGray200 rounded10 py8 px15 mx15 my8>
      <Row pt5 itemsCenter>
        <Col auto mr10>
          <Div onPress={gotoNftCollectionProfile}>
            <Img
              w30
              h30
              rounded100
              uri={getNftCollectionProfileImage(
                communityWallet.nft_collection,
                100,
                100,
              )}
            />
          </Div>
        </Col>
        <Col auto>
          <Span>
            <Span fontSize={14} bold onPress={gotoNftCollectionProfile}>
              {communityWallet.name}
            </Span>{' '}
            <Span fontSize={14} gray700>
              {' '}
              {truncateKlaytnAddress(communityWallet.address)}
            </Span>
          </Span>
        </Col>
      </Row>
      <Row py15 itemsCenter justifyCenter>
        <Col auto mr2>
          <Span fontSize={24} bold>
            {communityWallet.balance}
          </Span>
        </Col>
        <Col auto ml2>
          <Img h20 w20 source={ICONS.klayIcon}></Img>
        </Col>
      </Row>
      <Row mb8>
        <Col itemsCenter>
          <Row itemsCenter onPress={copyToClipboard}>
            <Col auto mr8>
              <Span gray700>주소 복사</Span>
            </Col>
            <Col auto>
              <Copy {...actionIconDefaultProps} />
            </Col>
          </Row>
        </Col>
        <Col itemsCenter>
          <Row itemsCenter>
            <Col auto mr8>
              <Span gray700>최근 기록 보기</Span>
            </Col>
            <Col auto>
              <ChevronRight {...actionIconDefaultProps} />
            </Col>
          </Row>
        </Col>
      </Row>
    </Div>
  );
}
