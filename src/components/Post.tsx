import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Alert} from 'react-native';
import {shallowEqual, useSelector} from 'react-redux';
import APIS from 'src/modules/apis';
import {
  MAIN_LINE2,
  MY_ROUTE,
  PLACE,
  REPORT,
  SUNGAN,
} from 'src/modules/constants';
import {isOkay} from 'src/modules/utils';
import {deletePromiseFn} from 'src/redux/asyncReducer';
import {RootState} from 'src/redux/rootReducer';
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
  const {token} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const {
    feed: {globalFiter},
  } = useSelector((root: RootState) => root, shallowEqual);
  const {stations} = useSelector(
    (root: RootState) => root.route.route,
    shallowEqual,
  );
  const [deleted, setDeleted] = useState(false);
  const deletePostUrl = useMemo(() => {
    if (type == SUNGAN) {
      return APIS.post.sungan.id(postId).url;
    }
    if (type == PLACE) {
      return APIS.post.place.id(postId).url;
    }
    return APIS.post.place.id(postId).url;
  }, [postId, type]);
  const deletePost = useCallback(async () => {
    const res = await deletePromiseFn({
      url: deletePostUrl,
      body: {},
      token: token,
    });
    if (isOkay(res)) {
      setDeleted(true);
      Alert.alert('포스트를 성공적으로 지웠습니다.');
    } else {
      Alert.alert('포스트를 지우는데 문제가 발생하였습니다.');
    }
  }, [deletePostUrl, token]);

  useEffect(() => {
    setDeleted(false);
  }, [postId, type]);

  if (deleted) {
    return null;
  }
  if (type == REPORT) {
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
        deletePost={deletePost}
      />
    );
  }
  if (globalFiter == MY_ROUTE) {
    if (!(stationName in stations)) {
      return null;
    }
  }
  if (globalFiter !== MAIN_LINE2) {
    if (stationName !== globalFiter) {
      return null;
    }
  }
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
        deletePost={deletePost}
      />
    );
  }
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
      deletePost={deletePost}
    />
  );
};

export default React.memo(Post);
