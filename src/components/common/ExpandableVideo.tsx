import React, {useRef} from 'react';
import {Div} from './Div';
import Video from 'react-native-video';

export default function ExpandableVideo({url, width, height}) {
  const ref = useRef(null);
  const handlePress = () => {
    ref?.current?.presentFullscreenPlayer();
  };
  return (
    <Div
      onPress={handlePress}
      rounded10
      borderGray200
      border={0.5}
      overflowHidden>
      <Video
        ref={ref}
        source={{uri: url}}
        style={{width, height}}
        muted
        repeat
      />
    </Div>
  );
}
