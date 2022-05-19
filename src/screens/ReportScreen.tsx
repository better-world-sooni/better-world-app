import {StatusBar} from 'native-base';
import React, {useEffect, useState} from 'react';
import {Div} from 'src/components/common/Div';
import Post from 'src/components/common/Post';
import apis from 'src/modules/apis';
import {HAS_NOTCH} from 'src/modules/constants';
import {
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
} from 'src/modules/viewComponents';
import {usePostPromiseFnWithToken} from 'src/redux/asyncReducer';
import useEdittableText from 'src/hooks/useEdittableText';
import {Row} from 'src/components/common/Row';
import {useNavigation} from '@react-navigation/native';
import {Col} from 'src/components/common/Col';
import {ChevronLeft} from 'react-native-feather';
import {Span} from 'src/components/common/Span';
import {ActivityIndicator} from 'react-native';

export enum ReportTypes {
  Post,
  Comment,
}

export default function ReportScreen({
  route: {
    params: {id, reportType},
  },
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [text, textHasChanged, handleChangeText] = useEdittableText('');
  const {goBack} = useNavigation();
  const postPromiseFnWithToken = usePostPromiseFnWithToken();
  const reportPost = async () => {
    if (text && !error && !success) {
      setLoading(true);
      const url =
        reportType == ReportTypes.Post
          ? apis.report.post.postId(id).url
          : apis.report.comment.commentId(id).url;
      const {data} = await postPromiseFnWithToken({
        url,
        body: {content: text},
      });
      setLoading(false);
      if (data.success) {
        setSuccess(true);
      } else {
        setError('업로드 중 문제가 발생하였습니다.');
      }
      return;
    }
    setError('신고 사유는 필수 항목입니다.');
  };
  useEffect(() => {
    setError('');
  }, [textHasChanged]);

  return (
    <KeyboardAvoidingView behavior="padding" flex={1} bgWhite relative>
      <Div h={HAS_NOTCH ? 44 : 20} />
      <Row pl={10} pr15 itemsCenter py8>
        <Col auto mr5 onPress={goBack}>
          <ChevronLeft width={20} height={20} color="black" strokeWidth={3} />
        </Col>
        <Col auto>
          <Span fontSize={15} medium>
            게시물 신고하기
          </Span>
        </Col>
        <Col />
        <Col auto onPress={reportPost}>
          {loading ? (
            <ActivityIndicator></ActivityIndicator>
          ) : (
            <Span info bold fontSize={16}>
              신고
            </Span>
          )}
        </Col>
      </Row>
      <ScrollView>
        {error ? (
          <Div px15 mt10>
            <Span notice danger>
              {error}
            </Span>
          </Div>
        ) : null}
        <Div px15 py10>
          <TextInput
            value={text}
            placeholder={'신고 사유를 적어주세요.'}
            fontSize={16}
            multiline
            bold
            onChangeText={handleChangeText}></TextInput>
        </Div>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
