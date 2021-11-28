import React, {useCallback, useRef, useEffect} from 'react';
import {Alert, Dimensions, ScrollView} from 'react-native';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import APIS from 'src/modules/apis';
import {
  Direction,
  LINE2_Linked_List,
  shortenStations,
} from 'src/modules/constants';
import {stationArr} from 'src/modules/utils';
import {deletePromiseFn, postPromiseFn} from 'src/redux/asyncReducer';
import {RootState} from 'src/redux/rootReducer';
import {setSelectedTrain} from 'src/redux/routeReducer';
import ColoredTrainPath from './ColoredTrainPath';
import {Div} from './common/Div';
import PressableTrain from './PressableTrain';

const fifthOfWindow = Dimensions.get('window').width / 5;

const HorzontalStations = ({horizontalStations, trainPositions}) => {
  const {
    route: {origin, destination, direction, stations},
    selectedTrain,
    receiveStationPush,
  } = useSelector((root: RootState) => root.route, shallowEqual);
  const {token} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const scrollRef = useRef(null);
  const dispatch = useDispatch();
  const getTrainAtStation = useCallback(
    item => {
      return trainPositions?.[item.split('(')[0]];
    },
    [trainPositions],
  );
  const getIsRiding = useCallback(
    trainAtStation => {
      return trainAtStation?.trainNo === selectedTrain?.trainNo;
    },
    [selectedTrain],
  );
  const handlePressRide = (trainAtStation, isRiding) => {
    if (trainAtStation) {
      if (isRiding) {
        dispatch(setSelectedTrain(null));
        deletePromiseFn({
          url: APIS.route.notification().url,
          body: {},
          token: token,
        });
        Alert.alert('역알림이 취소 되었습니다.');
      } else {
        dispatch(setSelectedTrain(trainAtStation));
        if (receiveStationPush) {
          postPromiseFn({
            url: APIS.route.notification().url,
            body: {
              trainNo: trainAtStation?.trainNo,
              stations: [
                LINE2_Linked_List.get(destination)[
                  direction == Direction.INNER ? 'next' : 'prev'
                ].split('(')[0],
              ],
            },
            token: token,
          });
          Alert.alert('역알림이 설정 되었습니다.');
        }
      }
    }
  };
  useEffect(() => {
    if (selectedTrain) {
      horizontalStations.map((item, index) => {
        const trainAtStation = getTrainAtStation(item);
        const isRiding = getIsRiding(trainAtStation);
        if (isRiding) {
          const ridingOffset = index * fifthOfWindow;
          scrollRef.current.scrollTo({
            x: ridingOffset,
            y: ridingOffset,
            animated: true,
          });
        }
      });
    }
  }, []);
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      ref={scrollRef}>
      {horizontalStations.map((item, index) => {
        const trainAtStation = getTrainAtStation(item);
        const isRiding = getIsRiding(trainAtStation);
        const isOrigin = origin === item;
        const isDestination = destination === item;
        return (
          <Div key={index}>
            <PressableTrain
              width={fifthOfWindow}
              trainAtStation={trainAtStation}
              isRiding={isRiding}
              handlePressRide={handlePressRide}
            />
            <ColoredTrainPath
              width={fifthOfWindow}
              stationName={item}
              isOrigin={isOrigin}
              isDestination={isDestination}
            />
          </Div>
        );
      })}
    </ScrollView>
  );
};

export default React.memo(HorzontalStations);
