import React from 'react';
import Hyperlink from 'react-native-hyperlink';
import {Colors} from 'src/modules/styles';
import {Linking} from 'react-native';

const AutolinkTextWrapper = function ({children}) {
  const handlePressLink = (url, _text) => {
    Linking.openURL(url);
  };
  return (
    <Hyperlink
      linkStyle={{color: Colors.info.DEFAULT}}
      onPress={handlePressLink}>
      {children}
    </Hyperlink>
  );
};

export default AutolinkTextWrapper;
