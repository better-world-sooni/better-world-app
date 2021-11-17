import {faSubway} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import React, {useCallback} from 'react';
import {shallowEqual, useSelector} from 'react-redux';
import {
  LINE2_COLOR,
  LINE2_COLOR_LIGHT,
  TRAIN_STATE,
} from 'src/modules/constants';
import {RootState} from 'src/redux/rootReducer';
import {Col} from './common/Col';
import {Div} from './common/Div';
import {Row} from './common/Row';
import {Span} from './common/Span';

const PressableTrain = ({width, trainAtStation, isRiding, handlePressRide}) => {
  const {
    route: {stations},
    selectedTrain,
  } = useSelector((root: RootState) => root.route, shallowEqual);
  const ridingStatus = useCallback(
    (ifNotRiding, ifIsRiding, ifIsWaiting, isRiding) => {
      return isRiding
        ? stations
            .map(item => {
              return item.split('(')[0];
            })
            .includes(selectedTrain.statnNm)
          ? ifIsRiding
          : ifIsWaiting
        : ifNotRiding;
    },
    [stations, selectedTrain],
  );
  return (
    <Div
      justifyCenter
      itemsCenter
      h50
      px10
      onPress={() => handlePressRide(trainAtStation, isRiding)}
      w={width}>
      {trainAtStation && (
        <>
          <Span
            medium
            fontSize={10}
            color={ridingStatus('black', 'rgb(255,69,58)', 'blue', isRiding)}>
            {ridingStatus('탑승하기', '탑승중', '도착시 탑승', isRiding)}
          </Span>
          <Row justifyCenter itemsCenter>
            <Col auto>
              <FontAwesomeIcon
                icon={faSubway}
                color={isRiding ? LINE2_COLOR : LINE2_COLOR_LIGHT}
                size={18}></FontAwesomeIcon>
            </Col>
            <Col auto ml5>
              <Span
                fontSize={8}
                color={isRiding ? LINE2_COLOR : LINE2_COLOR_LIGHT}>
                {`${TRAIN_STATE[trainAtStation.trainSttus] || '출발'}(${
                  trainAtStation.statnTnm
                })`}
              </Span>
            </Col>
          </Row>
        </>
      )}
    </Div>
  );
};

export default React.memo(PressableTrain);
