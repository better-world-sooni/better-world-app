import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {Switch} from 'react-native';
import {ChevronLeft, UserX} from 'react-native-feather';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import {ScrollView} from 'src/components/common/ViewComponents';
import {useGotoConfirmationModal, useGotoSignIn} from 'src/hooks/useGoto';
import apis from 'src/modules/apis';
import {Colors} from 'src/modules/styles';
import {useLogout} from 'src/redux/appReducer';
import {
  useApiPATCHWithToken,
  useApiSelector,
  useDeletePromiseFnWithToken,
} from 'src/redux/asyncReducer';

export default function NftSettingScreen() {
  const {data: pushNotificationSetting, isLoading: refreshing} = useApiSelector(
    apis.pushNotificationSetting._(),
  );
  const pushNotificationEnabled =
    !pushNotificationSetting?.push_notification_setting?.is_disabled_globally;
  const {goBack} = useNavigation();
  const patchPromiseFnWithToken = useApiPATCHWithToken();
  const gotoConfirmation = useGotoConfirmationModal();
  const gotoSignIn = useGotoSignIn();
  const logout = useLogout(gotoSignIn);
  const deletePromiseFn = useDeletePromiseFnWithToken();
  const destroyUser = async () => {
    await deletePromiseFn({url: apis.nft._().url});
    logout();
  };
  const handlePressDestroyUser = async () => {
    await gotoConfirmation({
      onConfirm: destroyUser,
      text: `해당 NFT 계정이 제거 되고 로그인 화면으로 이동합니다. NFT 소유권은 서비스의 범위가 아니기 때문에 유지되지만 삭제된 데이터는 복구할 수 없습니다. 진행하시겠습니까?`,
    });
  };
  const handleSwitchPushNotification = async bool => {
    const body = {
      property: 'is_disabled_globally',
      value: !bool,
    };
    patchPromiseFnWithToken(apis.pushNotificationSetting._(), body);
  };
  const notchHeight = useSafeAreaInsets().top;
  return (
    <Div flex={1} bgWhite>
      <Div h={notchHeight}></Div>
      <Div bgWhite h={50} justifyCenter borderBottom={0.5} borderGray200>
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
          <Col auto>
            <Span bold fontSize={19}>
              설정
            </Span>
          </Col>
          <Col itemsEnd></Col>
        </Row>
      </Div>
      <ScrollView bgWhite>
        <Row px15 py12 itemsCenter borderBottom={0.5} borderGray200>
          <Col auto m5>
            <Span fontSize={16} bold>
              알림
            </Span>
          </Col>
          <Col></Col>
          <Col auto>
            <Switch
              value={pushNotificationEnabled}
              onValueChange={handleSwitchPushNotification}
              style={{transform: [{scaleX: 0.8}, {scaleY: 0.8}]}}
            />
          </Col>
        </Row>
        <Row
          px15
          py12
          itemsCenter
          borderBottom={0.5}
          borderGray200
          onPress={handlePressDestroyUser}>
          <Col auto m5>
            <Span fontSize={16} bold danger>
              계정 제거
            </Span>
          </Col>
          <Col auto ml8>
            <UserX
              width={18}
              height={18}
              color={Colors.danger.DEFAULT}
              strokeWidth={2}
            />
          </Col>
          <Col></Col>
        </Row>
      </ScrollView>
    </Div>
  );
}
