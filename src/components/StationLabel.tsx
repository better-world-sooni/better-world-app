import React, {useCallback} from 'react';
import {Div} from './common/Div';
import {Span} from './common/Span';

const StationLabel = ({width, isOrigin, isDestination, stationName}) => {
  const color = useCallback((isOrigin, isDestination) => {
    isOrigin ? 'rgb(255,69,58)' : isDestination ? 'blue' : 'black';
  }, []);
  return (
    <Div textCenter itemsCenter w={width}>
      <Span medium fontSize={10} color={color(isOrigin, isDestination)}>
        {stationName}
      </Span>
    </Div>
  );
};

export default StationLabel;
