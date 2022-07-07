import React, {useEffect, useState} from 'react';
import ImageColors from 'react-native-image-colors';
import {Colors} from 'src/modules/styles';
import {Col} from './Col';
import {Img} from './Img';
import {Row} from './Row';

export default function NftCollectionStoreHeader({nftCollectionImageUri}) {
  const defaultBannerColors = {
    background: Colors.white,
    text: Colors.black,
  };
  const [bannerColors, setBannerColors] = useState(defaultBannerColors);
  useEffect(() => {
    if (nftCollectionImageUri) {
      ImageColors.getColors(nftCollectionImageUri, {
        fallback: Colors.black,
        cache: true,
        key: nftCollectionImageUri,
      }).then(colors => {
        setBannerColors(
          colors.platform == 'ios'
            ? {
                background: colors.background,
                text: colors.detail,
              }
            : colors.platform == 'android'
            ? {
                background: colors.average,
                text: colors.dominant,
              }
            : defaultBannerColors,
        );
      });
    }
  }, [nftCollectionImageUri]);
  return (
    <Row itemsCenter py5 h50 px15 backgroundColor={bannerColors.background}>
      <Col />
      <Col auto>
        <Img uri={nftCollectionImageUri} w35 h35 rounded100></Img>
      </Col>
      <Col />
    </Row>
  );
}
