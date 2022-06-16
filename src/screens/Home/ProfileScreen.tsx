import React from 'react';
import {StatusBar, Platform} from 'react-native';
import {Div} from 'src/components/common/Div';
import apis from 'src/modules/apis';
import NftProfile from 'src/components/common/NftProfile';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';

const ProfileScreen = ({route: {params}}) => {
  const {currentNft} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const pageableNftPostFn = (page?) => {
    return apis.post.list._(page);
  };

  return (
    <Div flex={1} bgWhite overflowHidden>
      <StatusBar barStyle="dark-content" backgroundColor='#283018'></StatusBar>
      <NftProfile
        qrScan
        nftCore={currentNft}
        enableBack={false}
        nftProfileApiObject={apis.nft._()}
        pageableNftPostFn={pageableNftPostFn}
      />
    </Div>
  );
};
export default ProfileScreen;
