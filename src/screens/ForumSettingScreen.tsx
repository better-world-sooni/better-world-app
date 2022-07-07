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
import NumberPlease from 'react-native-number-please';

export default function ForumSettingScreen() {
  const {data, isLoading} = useApiSelector(apis.forum_setting._);
  const forumSetting = data?.forum_setting;
  const isAdmin = useIsAdmin();
  const {goBack} = useNavigation();
  const apiPUTWithToken = useApiPUTWithToken();
  const [guideline, guidelineHasChanged, handleChangeGuideline] =
    useEdittableText(forumSetting?.guideline);
  const [
    finalApprovalPercent,
    finalApprovalPercentHasChanged,
    handleChangeFinalApprovalPercent,
  ] = useEdittableText(forumSetting?.final_approval_percent);
  const [finalQuorum, finalQuorumHasChanged, handleChangeFinalQuorum] =
    useEdittableText(forumSetting?.final_quorum_percent);
  const [
    preliminaryApprovalPercent,
    preliminaryApprovalPercentHasChanged,
    handleChangePreliminaryApprovalPercent,
  ] = useEdittableText(forumSetting?.preliminary_approval_percent);
  const [
    preliminaryQuorum,
    preliminaryQuorumHasChanged,
    handleChangePreliminaryQuorum,
  ] = useEdittableText(forumSetting?.preliminary_quorum_percent);
  const placeholder = isLoading ? '불러오는 중' : '설정되지 않았습니다.';
  const percentagePickerOptions = [
    {id: 'percent', label: '%', min: 0, max: 100},
  ];
  const isSaveable =
    guidelineHasChanged ||
    finalApprovalPercentHasChanged ||
    finalQuorumHasChanged ||
    preliminaryApprovalPercentHasChanged ||
    preliminaryQuorumHasChanged;

  const save = () => {
    if (!isSaveable) return;
    const body = {
      guideline: guideline,
      preliminary_approval_percent: preliminaryApprovalPercent,
      preliminary_quorum_percent: preliminaryQuorum,
      final_approval_percent: finalApprovalPercent,
      final_quorum_percent: finalQuorum,
    };
    apiPUTWithToken(apis.forum_setting._(), body);
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
              포럼 설정
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
        <Div borderBottom={0.5} borderGray200 py16 px15>
          <Row py4 itemsCenter>
            <Col auto>
              <Span fontSize={19} bold>
                예비 제안 통과 기준{' '}
              </Span>
            </Col>
            <Col auto>
              <Span fontSize={12} gray700>
                {' '}
                모두 0을 초과할 시에 적용
              </Span>
            </Col>
          </Row>
          <Row py4 itemsCenter>
            <Col auto>
              <Span fontSize={16} gray700 bold>
                투표 찬성 / 투표 참여
              </Span>
            </Col>
            <Col auto w100>
              <NumberPlease
                digits={percentagePickerOptions}
                itemStyle={{
                  height: 40,
                  fontSize: 16,
                }}
                values={[{id: 'percent', value: preliminaryApprovalPercent}]}
                onChange={values => {
                  if (!isAdmin) return;
                  handleChangePreliminaryApprovalPercent(values[0].value);
                }}
              />
            </Col>
          </Row>
          <Row py4 itemsCenter>
            <Col auto>
              <Span fontSize={16} gray700 bold>
                투표 참여 / 전체
              </Span>
            </Col>
            <Col auto w100>
              <NumberPlease
                digits={percentagePickerOptions}
                itemStyle={{
                  height: 40,
                  fontSize: 16,
                }}
                values={[{id: 'percent', value: preliminaryQuorum}]}
                onChange={values => {
                  if (!isAdmin) return;
                  handleChangePreliminaryQuorum(values[0].value);
                }}
              />
            </Col>
          </Row>
        </Div>
        <Div borderBottom={0.5} borderGray200 py16 px15>
          <Row py4 itemsCenter>
            <Col auto>
              <Span fontSize={19} bold>
                파이널 제안 통과 기준{' '}
              </Span>
            </Col>
            <Col auto>
              <Span fontSize={12} gray700>
                {' '}
                모두 0을 초과할 시에 적용
              </Span>
            </Col>
          </Row>
          <Row py4 itemsCenter>
            <Col auto>
              <Span fontSize={16} gray700 bold>
                투표 찬성 / 투표 참여
              </Span>
            </Col>
            <Col auto w100>
              <NumberPlease
                digits={percentagePickerOptions}
                itemStyle={{
                  height: 40,
                  fontSize: 16,
                }}
                values={[{id: 'percent', value: finalApprovalPercent}]}
                onChange={values => {
                  if (!isAdmin) return;
                  handleChangeFinalApprovalPercent(values[0].value);
                }}
              />
            </Col>
          </Row>
          <Row py4 itemsCenter>
            <Col auto>
              <Span fontSize={16} gray700 bold>
                투표 참여 / 전체
              </Span>
            </Col>
            <Col auto w100>
              <NumberPlease
                digits={percentagePickerOptions}
                itemStyle={{
                  height: 40,
                  fontSize: 16,
                }}
                values={[{id: 'percent', value: finalQuorum}]}
                onChange={values => {
                  if (!isAdmin) return;
                  handleChangeFinalQuorum(values[0].value);
                }}
              />
            </Col>
          </Row>
        </Div>
        <Div h={50}></Div>
      </ScrollView>
    </>
  );
}
