import React from 'react';
// import {StyleSheet} from 'react-native';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {Img} from 'src/components/common/Img';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
// import {ScrollView} from 'modules/viewComponents';
// import {RefreshControl} from 'react-native';
// import {DEVICE_WIDTH} from 'modules/styles';
import {IMAGES} from 'src/modules/images';
// import Carousel, {Pagination} from 'react-native-snap-carousel';
// import {useNavigation} from '@react-navigation/native';

export default function TabOneScreen() {
  return (
    <Div flex bgGray100>
      <Row h54 itemsCenter bgWhite>
        <Col auto>
          <Div px20 onPress={console.log()}>
            <Img w="100%" uri={IMAGES.mainLogo} />
            <Span>순간이동</Span>
          </Div>
        </Col>
      </Row>
      <Body />
    </Div>
  );
}

const Body = props => {
  const {style, ...otherProps} = props;
  return <Div flex bgGray100 style={style} {...otherProps} />;
};
