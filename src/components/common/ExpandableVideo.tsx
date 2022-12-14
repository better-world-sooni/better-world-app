import React, {useRef, useState} from 'react';
import {Div} from './Div';
import Video from 'react-native-video';
import {Colors} from 'src/modules/styles';
import {Volume2, VolumeX} from 'react-native-feather';

export default function ExpandableVideo({url, width, height}) {
  const ref = useRef(null);
  const [muted, setMuted] = useState(true);
  const handlePress = () => {
    setMuted(prev => !prev);
  };
  return (
    <Div
      onPress={handlePress}
      rounded10
      borderGray200
      border={0.5}
      overflowHidden
      relative>
      <Video
        ref={ref}
        source={{uri: url}}
        style={{width, height}}
        repeat
        muted={muted}
        resizeMode="cover"
      />
      <Div bg={'rgba(0,0,0,0.3)'} absolute bottom10 right10 rounded100 p6>
        {muted ? (
          <Volume2
            color={Colors.white}
            strokeWidth={1.2}
            height={18}
            width={18}
          />
        ) : (
          <VolumeX
            color={Colors.white}
            strokeWidth={1.2}
            height={18}
            width={18}
          />
        )}
      </Div>
    </Div>
  );
}
