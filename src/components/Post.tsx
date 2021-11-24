import React, {useCallback} from 'react';
import {Alert} from 'react-native';
import {shallowEqual, useSelector} from 'react-redux';
import APIS from 'src/modules/apis';
import {REPORT, SUNGAN} from 'src/modules/constants';
import {isOkay} from 'src/modules/utils';
import {deletePromiseFn, useReloadGET} from 'src/redux/asyncReducer';
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
  const apiGET = useReloadGET();
  const deleteSungan = useCallback(async () => {
    const res = await deletePromiseFn({
      url: APIS.post.sungan.id(postId).url,
      body: {},
      token: token,
    });
    if (isOkay(res)) {
      apiGET(APIS.post.sungan.my());
      Alert.alert('포스트를 성공적으로 지웠습니다.');
    } else {
      Alert.alert('포스트를 지우는데 문제가 발생하였습니다.');
    }
  }, [postId, type]);
  const deletePlace = useCallback(async () => {
    const res = await deletePromiseFn({
      url: APIS.post.place.id(postId).url,
      body: {},
      token: token,
    });
    if (isOkay(res)) {
      apiGET(APIS.post.sungan.my());
      Alert.alert('포스트를 성공적으로 지웠습니다.');
    } else {
      Alert.alert('포스트를 지우는데 문제가 발생하였습니다.');
    }
  }, [postId, type]);
  const deleteReport = useCallback(async () => {
    const res = await deletePromiseFn({
      url: APIS.post.place.id(postId).url,
      body: {},
      token: token,
    });
    if (isOkay(res)) {
      apiGET(APIS.post.sungan.my());
      Alert.alert('포스트를 성공적으로 지웠습니다.');
    } else {
      Alert.alert('포스트를 지우는데 문제가 발생하였습니다.');
    }
  }, [postId, type]);
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
        deletePost={deleteSungan}
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
        deletePost={deleteReport}
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
        deletePost={deletePlace}
      />
    );
  }
};

export default React.memo(Post);
