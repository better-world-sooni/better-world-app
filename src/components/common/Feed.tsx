import React from 'react';
import {FlatList} from 'src/components/common/ViewComponents';
import Post from './Post';

export default function Feed({feed}) {
  return (
    <FlatList
      data={feed}
      renderItem={({item}) => <Post post={item} />}></FlatList>
  );
}
