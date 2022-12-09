import React, {useRef, useState} from 'react';
import {Div} from './Div';
import {Img} from './Img';
import {Row} from './Row';
import {Col} from './Col';
import {expandImageViewer} from 'src/utils/imageViewerUtils';
import {Image} from 'react-native';

export default function ImageSlideShow({
  imageUris,
  sliderHeight,
  sliderWidth,
  roundedTopOnly = false,
  enablePagination = true,
  borderRadius = 10,
  autoHeight = false,
}) {
  const [currentPage, setCurrentPage] = useState(0);
  return (
    <>
      <Div
        rounded={!roundedTopOnly && borderRadius}
        borderBottomRight={borderRadius}
        borderBottomLeft={borderRadius}
        border={0.5}
        borderGray200
        overflowHidden>
        <ExpandableImages
          data={imageUris}
          itemWidth={sliderWidth}
          itemHeight={sliderHeight}
          autoHeight={autoHeight}
        />
      </Div>
    </>
  );
}

function ExpandableImages({itemWidth, itemHeight, data, autoHeight = false}) {
  const defaultRatio = 0.7;
  const images = data.map(url => ({uri: url}));
  const [itemSize, setItemSize] = useState({itemWidth, itemHeight});
  const autoGetHeight = ({nativeEvent: {width, height}}) => {
    setItemSize({
      itemWidth: width,
      itemHeight: (itemWidth * height) / width,
    });
  };
  if (data.length == 1)
    return (
      <Div onPress={() => expandImageViewer(images, 0)}>
        <Img
          w={itemWidth}
          h={autoHeight == true ? itemSize.itemHeight : itemHeight}
          uri={data[0]}
          onLoad={autoHeight == true && autoGetHeight}></Img>
      </Div>
    );
  if (data.length == 2)
    return (
      <Row w={itemWidth} h={itemWidth * defaultRatio}>
        <Col onPress={() => expandImageViewer(images, 0)}>
          <Img
            w={itemWidth / 2}
            h={itemWidth * defaultRatio}
            uri={data[0]}></Img>
        </Col>
        <Col onPress={() => expandImageViewer(images, 1)}>
          <Img
            w={itemWidth / 2}
            h={itemWidth * defaultRatio}
            uri={data[1]}></Img>
        </Col>
      </Row>
    );
  if (data.length == 3)
    return (
      <Row w={itemWidth} h={itemWidth * defaultRatio}>
        <Col onPress={() => expandImageViewer(images, 0)}>
          <Img
            w={itemWidth / 2}
            h={itemWidth * defaultRatio}
            uri={data[0]}></Img>
        </Col>
        <Col>
          <Div onPress={() => expandImageViewer(images, 1)}>
            <Img
              w={itemWidth / 2}
              h={(itemWidth * defaultRatio) / 2}
              uri={data[1]}></Img>
          </Div>
          <Div onPress={() => expandImageViewer(images, 2)}>
            <Img
              w={itemWidth / 2}
              h={(itemWidth * defaultRatio) / 2}
              uri={data[2]}></Img>
          </Div>
        </Col>
      </Row>
    );
  return (
    <Row w={itemWidth} h={itemWidth * 0.7}>
      <Col>
        <Div onPress={() => expandImageViewer(images, 0)}>
          <Img
            w={itemWidth / 2}
            h={(itemWidth * defaultRatio) / 2}
            uri={data[0]}></Img>
        </Div>
        <Div onPress={() => expandImageViewer(images, 1)}>
          <Img
            w={itemWidth / 2}
            h={(itemWidth * defaultRatio) / 2}
            uri={data[1]}></Img>
        </Div>
      </Col>
      <Col>
        <Div onPress={() => expandImageViewer(images, 2)}>
          <Img
            w={itemWidth / 2}
            h={(itemWidth * defaultRatio) / 2}
            uri={data[2]}></Img>
        </Div>
        <Div onPress={() => expandImageViewer(images, 3)}>
          <Img
            w={itemWidth / 2}
            h={(itemWidth * defaultRatio) / 2}
            uri={data[3]}></Img>
        </Div>
      </Col>
    </Row>
  );
}
