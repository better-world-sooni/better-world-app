import React from 'react';
import Post from './Post';

export default function Feed({feed}) {
  return feed.map(post => {
    return <Post key={post.id} post={post} />;
  });
}
