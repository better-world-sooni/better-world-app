import React from 'react';
import {shallowEqual, useSelector} from 'react-redux';
import {REPORT, SUNGAN} from 'src/modules/constants';
import {RootState} from 'src/redux/rootReducer';
import Place from './Place';
import Report from './Report';
import Sungan from './Sungan';

const MainPosts = ({mainPostsKeys, filterPostsByStation}) => {
  const {mainPosts} = useSelector((root: RootState) => root.feed, shallowEqual);
  return mainPostsKeys
    .filter(key => {
      return filterPostsByStation(mainPosts[key]);
    })
    .sort((a, b) => {
      return (
        new Date(mainPosts[b].post.createdAt).getTime() -
        new Date(mainPosts[a].post.createdAt).getTime()
      );
    })
    .map((key, index) => {
      const post = mainPosts[key];
      if (post.type == SUNGAN) {
        return <Sungan post={post} key={index} />;
      } else if (post.type == REPORT) {
        return <Report post={post} key={index} />;
      } else {
        return <Place post={post} key={index} />;
      }
    });
};

export default React.memo(MainPosts);
