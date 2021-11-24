import React from 'react';
import {REPORT, SUNGAN} from 'src/modules/constants';
import Place from './Place';
import Report from './Report';
import Sungan from './Sungan';

const Post = ({
  type,
  didLike,
  postId,
  vehicleIdNum,
  stationName,
  emoji,
  userName,
  userProfileImgUrl,
  createdAt,
  likeCnt,
  place,
  text,
  mine = false,
  userNameBC,
  userProfileImgUrlBC,
  contentBC,
}) => {
  if (type == SUNGAN) {
    return (
      <Sungan
        didLike={didLike}
        postId={postId}
        stationName={stationName}
        emoji={emoji}
        userName={userName}
        userProfileImgUrl={userProfileImgUrl}
        createdAt={createdAt}
        likeCnt={likeCnt}
        text={text}
        mine={mine}
        userNameBC={userNameBC}
        userProfileImgUrlBC={userProfileImgUrlBC}
        contentBC={contentBC}
      />
    );
  } else if (type == REPORT) {
    return (
      <Report
        vehicleIdNum={vehicleIdNum}
        didLike={didLike}
        postId={postId}
        userName={userName}
        userProfileImgUrl={userProfileImgUrl}
        createdAt={createdAt}
        likeCnt={likeCnt}
        text={text}
        mine={mine}
        userNameBC={userNameBC}
        userProfileImgUrlBC={userProfileImgUrlBC}
        contentBC={contentBC}
      />
    );
  } else {
    return (
      <Place
        didLike={didLike}
        postId={postId}
        stationName={stationName}
        emoji={emoji}
        userName={userName}
        userProfileImgUrl={userProfileImgUrl}
        createdAt={createdAt}
        likeCnt={likeCnt}
        text={text}
        place={place}
        mine={mine}
        userNameBC={userNameBC}
        userProfileImgUrlBC={userProfileImgUrlBC}
        contentBC={contentBC}
      />
    );
  }
};

export default React.memo(Post);
