import React, {useEffect, useState} from 'react';
import {Div} from 'src/components/common/Div';
import apis from 'src/modules/apis';
import {
  KeyboardAvoidingView,
  TextInput,
} from 'src/components/common/ViewComponents';
import {usePostPromiseFnWithToken} from 'src/redux/asyncReducer';
import useEdittableText from 'src/hooks/useEdittableText';
import {Row} from 'src/components/common/Row';
import {useNavigation} from '@react-navigation/native';
import {Col} from 'src/components/common/Col';
import {ChevronLeft} from 'react-native-feather';
import {Span} from 'src/components/common/Span';
import {ActivityIndicator, Platform} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {Colors, DEVICE_WIDTH} from 'src/modules/styles';
import {CustomBlurView} from 'src/components/common/CustomBlurView';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

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
  const [text, textHasChanged, handleChangeText] = useEdittableText('');
  const {goBack} = useNavigation();
  const postPromiseFnWithToken = usePostPromiseFnWithToken();
  const reportPost = async () => {
    if (text && !error) {
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
        goBack();
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

  const translationY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => {
    translationY.value = event.contentOffset.y;
  });
  const notchHeight = useSafeAreaInsets().top;
  const headerHeight = notchHeight + 50;
  const headerStyles = useAnimatedStyle(() => {
    return {
      width: DEVICE_WIDTH,
      height: headerHeight,
      opacity: Math.min(translationY.value / 50, 1),
    };
  });
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      flex={1}
      bgWhite
      relative>
      <Div h={headerHeight} zIndex={100} borderBottom={0.5} borderGray200>
        <Div zIndex={100} absolute w={DEVICE_WIDTH} top={notchHeight + 5}>
          <Row itemsCenter py5 h40 px8>
            <Col itemsStart>
              <Div auto rounded100 onPress={goBack}>
                <ChevronLeft
                  width={30}
                  height={30}
                  color={Colors.black}
                  strokeWidth={2}
                />
              </Div>
            </Col>
            <Col auto onPress={goBack}>
              <Span bold fontSize={17}>
                게시물 신고하기
              </Span>
            </Col>
            <Col itemsEnd pr7>
              <Div auto onPress={reportPost}>
                {loading ? (
                  <ActivityIndicator></ActivityIndicator>
                ) : (
                  <Span info bold fontSize={16}>
                    신고
                  </Span>
                )}
              </Div>
            </Col>
          </Row>
        </Div>
      </Div>
      <Animated.ScrollView
        automaticallyAdjustContentInsets
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}>
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
      </Animated.ScrollView>
    </KeyboardAvoidingView>
  );
}
