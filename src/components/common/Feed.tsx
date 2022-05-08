import React from 'react';
import {FlatList} from 'src/modules/viewComponents';
import Post from './Post';

export default function Feed({feed}) {
  return (
    <FlatList
      data={feed}
      renderItem={({item}) => <Post post={item} />}></FlatList>
  );
  return feed.map(post => {
    return <Post key={post.id} post={post} />;
  });
}
