import React from 'react';
import {Div} from 'src/components/common/Div';
import FullPost from 'src/components/common/FullPost';
import NotFound from 'src/components/error/NotFound';
import PostLoading from 'src/components/loading/PostLoading';
import apis from 'src/modules/apis';
import {HAS_NOTCH} from 'src/modules/constants';
import {KeyboardAvoidingView} from 'src/modules/viewComponents';
import {useApiSelector} from 'src/redux/asyncReducer';
import {Platform} from 'react-native';

export default function PostScreen({
  route: {
    params: {postId, autoFocus = false},
  },
}) {
  console.log("postscreen", postId, autoFocus)
  const {
    data: postRes,
    isLoading: postLoad,
    error,
  } = useApiSelector(apis.post.postId._(postId));

  if (postLoad) return <PostLoading />;

  if (!postRes && error)
    return <NotFound text={'해당 게시물은 지워졌습니다.'} />;

  return (
    <>
      <KeyboardAvoidingView flex={1} bgWhite relative behavior={Platform.OS === "ios" ? "padding" : "height"}>
        {postRes?.post ? (
          <FullPost autoFocus={autoFocus} post={postRes?.post}></FullPost>
        ) : null}
      </KeyboardAvoidingView>
      <Div h={HAS_NOTCH ? 27 : 12} bgWhite />
    </>
  );
}
