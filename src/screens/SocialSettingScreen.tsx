import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {X} from 'react-native-feather';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import {ScrollView, TextInput} from 'src/components/common/ViewComponents';
import useEdittableText from 'src/hooks/useEdittableText';
import apis from 'src/modules/apis';
import {Colors} from 'src/modules/styles';
import {useApiPUTWithToken, useApiSelector} from 'src/redux/asyncReducer';
import {useIsAdmin} from 'src/utils/nftUtils';

export default function SocialSettingScreen() {
  const {data, isLoading} = useApiSelector(apis.social_setting._);
  const socialSetting = data?.social_setting;
  const isAdmin = useIsAdmin();
  const {goBack} = useNavigation();
  const apiPUTWithToken = useApiPUTWithToken();
  const [guideline, guidelineHasChanged, handleChangeGuideline] =
    useEdittableText(socialSetting?.guideline);
  const placeholder = isLoading ? '불러오는 중' : '설정되지 않았습니다.';
  const isSaveable = guidelineHasChanged;

  const save = () => {
    const body = {
      guideline: guideline,
    };
    apiPUTWithToken(apis.social_setting._(), body);
  };

  return (
    <>
      <Div bgWhite px15 h={50} justifyCenter borderBottom={0.5} borderGray200>
        <Row itemsCenter zIndex={100}>
          <Col itemsStart onPress={goBack}>
            <X width={30} height={30} color={Colors.black} strokeWidth={2} />
          </Col>
          <Col auto>
            <Span bold fontSize={19}>
              게시물 피드 설정
            </Span>
          </Col>
          <Col itemsEnd>
            {isAdmin && (
              <Span
                admin={isSaveable}
                adminSoft={!isSaveable}
                fontSize={16}
                onPress={save}
                bold>
                저장
              </Span>
            )}
          </Col>
        </Row>
      </Div>
      <ScrollView bgWhite bounces={false}>
        <Div borderBottom={0.5} borderGray200 py16 px15>
          <Row py4>
            <Span fontSize={19} bold>
              가이드라인
            </Span>
          </Row>
          <Row py4>
            {isAdmin ? (
              <TextInput
                value={guideline}
                placeholder={placeholder}
                fontSize={14}
                multiline
                bold
                onChangeText={handleChangeGuideline}></TextInput>
            ) : (
              <Span fontSize={14}>{guideline || placeholder}</Span>
            )}
          </Row>
        </Div>
        <Div h={50}></Div>
      </ScrollView>
    </>
  );
}
