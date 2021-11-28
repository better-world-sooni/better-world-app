import React from 'react';
import {shallowEqual, useSelector} from 'react-redux';
import {IMAGES} from 'src/modules/images';
import {RootState} from 'src/redux/rootReducer';
import {Col} from './common/Col';
import {Div} from './common/Div';
import {Img} from './common/Img';
import {Row} from './common/Row';

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
        source={
          IMAGES.characters[currentUser.avatar] || IMAGES.imageProfileNull
        }
        w50
        h50
        rounded10></Img>
    );
  }
  if (avatarArrLength == 1) {
    return <Img source={IMAGES.characters[avatarArr[0]]} w50 h50></Img>;
  }
  if (avatarArrLength == 2) {
    return (
      <Div w50 h50 itemsCenter justifyCenter>
        <Row>
          <Col auto>
            <Img source={IMAGES.characters[avatarArr[0]]} h25 w25></Img>
          </Col>
          <Col auto>
            <Img source={IMAGES.characters[avatarArr[1]]} h25 w25></Img>
          </Col>
        </Row>
      </Div>
    );
  }
  if (avatarArrLength == 3) {
    return (
      <Div w50 h50 itemsCenter justifyCenter>
        <Row>
          <Col auto>
            <Img source={IMAGES.characters[avatarArr[0]]} h25 w25></Img>
          </Col>
          <Col auto>
            <Img source={IMAGES.characters[avatarArr[1]]} h25 w25></Img>
          </Col>
        </Row>
        <Row justifyCenter>
          <Img source={IMAGES.characters[avatarArr[2]]} h25 w25></Img>
        </Row>
      </Div>
    );
  }
  return (
    <Div w50 h50 itemsCenter justifyCenter>
      <Row>
        <Col auto>
          <Img source={IMAGES.characters[avatarArr[0]]} h25 w25></Img>
        </Col>
        <Col auto>
          <Img source={IMAGES.characters[avatarArr[1]]} h25 w25></Img>
        </Col>
      </Row>
      <Row>
        <Col auto>
          <Img source={IMAGES.characters[avatarArr[2]]} h25 w25></Img>
        </Col>
        <Col auto>
          <Img source={IMAGES.characters[avatarArr[3]]} h25 w25></Img>
        </Col>
      </Row>
    </Div>
  );
};

export default React.memo(ChatRoomAvatars);
