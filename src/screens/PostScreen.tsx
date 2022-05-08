import {StatusBar} from 'native-base';
import React from 'react';
import {Div} from 'src/components/common/Div';
import Post from 'src/components/common/Post';
import apis from 'src/modules/apis';
import {HAS_NOTCH} from 'src/modules/constants';
import {useApiSelector} from 'src/redux/asyncReducer';

export default function PostScreen({
  route: {
    params: {postId},
  },
}) {
  const {data: postRes, isLoading: postLoad} = useApiSelector(
    apis.post.postId._(postId),
  );

  return (
    <Div flex bgWhite relative>
      <StatusBar animated={true} barStyle={'dark-content'} />
      <Div h={HAS_NOTCH ? 44 : 20} />
      {postRes?.post ? <Post post={postRes?.post} full></Post> : null}
    </Div>
  );
}
