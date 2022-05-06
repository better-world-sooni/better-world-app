import {StatusBar} from 'native-base';
import React, {useEffect, useState} from 'react';
import {shallowEqual, useSelector} from 'react-redux';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {Img} from 'src/components/common/Img';
import Post from 'src/components/common/Post';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import {TextField} from 'src/components/TextField';
import Colors from 'src/constants/Colors';
import apis from 'src/modules/apis';
import {HAS_NOTCH} from 'src/modules/constants';
import {getNftProfileImage} from 'src/modules/nftUtils';
import {varStyle} from 'src/modules/styles';
import {TextInput} from 'src/modules/viewComponents';
import {
  useApiPOSTWithToken,
  useApiSelector,
  usePostPromiseFnWithToken,
} from 'src/redux/asyncReducer';
import {RootState} from 'src/redux/rootReducer';

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
