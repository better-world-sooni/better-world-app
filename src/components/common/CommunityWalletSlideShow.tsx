import React, {useState} from 'react';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import Colors from 'src/constants/Colors';
import CommunityWallet from './CommunityWallet';
import {Div} from './Div';

export default function CommunityWalletSlideShow({
  communityWallets,
  sliderWidth,
  roundedTopOnly = false,
  enablePagination = false,
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
            <CommunityWallet communityWallet={item} width={sliderWidth} />
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
