import React from 'react';
import {Div} from 'src/components/common/Div';
import apis from 'src/modules/apis';
import NftProfile from 'src/components/common/NftProfile';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';
import {useGotoNewPost} from 'src/hooks/useGoto';
import {PostOwnerType, PostType} from '../NewPostScreen';
import {Img} from 'src/components/common/Img';
import {ICONS} from 'src/modules/icons';

const ProfileScreen = () => {
  const {currentNft} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const pageableNftPostFn = (page?) => {
    return apis.post.list._(page);
  };
  const gotoNewProposal = useGotoNewPost({postOwnerType: PostOwnerType.Nft});
  return (
    <Div flex={1} bgWhite overflowHidden>
      <NftProfile
        qrScan
        nftCore={currentNft}
        enableBack={false}
        nftProfileApiObject={apis.nft._()}
        pageableNftPostFn={pageableNftPostFn}
      />
      <Div
        rounded100
        bgWhite
        absolute
        w54
        h54
        p12
        bottom15
        right15
        itemsCenter
        justifyCenter
        onPress={() => gotoNewProposal(null, null, null, PostType.Proposal)}
        style={{
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 4,
        }}>
        <Img source={ICONS.lightBulb} h22 w22 />
      </Div>
    </Div>
  );
};
export default ProfileScreen;
