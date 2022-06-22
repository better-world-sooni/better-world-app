import React from 'react';
import {shallowEqual, useSelector} from 'react-redux';
import {IMAGES} from 'src/modules/images';
import {RootState} from 'src/redux/rootReducer';
import {Col} from './common/Col';
import {Div} from './common/Div';
import {Img} from './common/Img';
import {Row} from './common/Row';
import {resizeImageUri} from 'src/modules/uriUtils';

const ChatRoomAvatars = ({
  firstUserAvatar = null,
  secondUserAvatar = null,
  thirdUserAvatar = null,
  fourthUserAvatar = null,
}) => {
  const {currentUser} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );

  const avatarArr = [
    firstUserAvatar,
    secondUserAvatar,
    thirdUserAvatar,
    fourthUserAvatar,
  ].filter(item => {
    return item;
  });

  const avatarArrLength = avatarArr.length;
  if (avatarArrLength == 0) {
    return (
      <Img
        source={IMAGES.placeholder}
        w50
        h50
        rounded10></Img>
    );
  }
  return <Img uri={resizeImageUri(avatarArr[0], 200, 200)} w50 h50></Img>;

};

export default React.memo(ChatRoomAvatars);
