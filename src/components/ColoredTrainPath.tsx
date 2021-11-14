import React, {useCallback} from 'react';
import {shallowEqual, useSelector} from 'react-redux';
import {
  GRAY_COLOR,
  LINE2_COLOR,
  LINE2_COLOR_LIGHT,
} from 'src/modules/constants';
import {RootState} from 'src/redux/rootReducer';
import {Col} from './common/Col';
import {Div} from './common/Div';
import {Row} from './common/Row';
import {Span} from './common/Span';

const ColoredTrainPath = ({width, stationName, isOrigin, isDestination}) => {
  const {
    route: {stations},
  } = useSelector((root: RootState) => root.route, shallowEqual);
  const leftHalfBg = useCallback(
    (item, isOrigin, isDestination) => {
      if (stations.length > 0) {
        if (isOrigin) return GRAY_COLOR;
        else if (isDestination) return LINE2_COLOR;
        else if (stations.includes(item)) return LINE2_COLOR;
        else return GRAY_COLOR;
      } else {
        return LINE2_COLOR_LIGHT;
      }
    },
    [stations],
  );
  const rightHalfBg = useCallback(
    (item, isOrigin, isDestination) => {
      if (stations.length > 0) {
        if (isOrigin) return LINE2_COLOR;
        if (isDestination) return GRAY_COLOR;
        if (stations.includes(item)) return LINE2_COLOR;
        return GRAY_COLOR;
      } else {
        return LINE2_COLOR_LIGHT;
      }
    },
    [stations],
  );
  const color = useCallback((isOrigin, isDestination) => {
    isOrigin ? 'rgb(255,69,58)' : isDestination ? 'blue' : 'black';
  }, []);
  return (
    <>
      <Div relative mb10 justifyCenter itemsCenter textCenter h10 w={width}>
        <Row absolute w={width} h={10}>
          <Col bg={leftHalfBg(stationName, isOrigin, isDestination)} mr1></Col>
          <Col bg={rightHalfBg(stationName, isOrigin, isDestination)} ml1></Col>
        </Row>
      </Div>
      <Div textCenter itemsCenter w={width}>
        <Span medium fontSize={10} color={color(isOrigin, isDestination)}>
          {stationName}
        </Span>
      </Div>
    </>
  );
};

export default ColoredTrainPath;
