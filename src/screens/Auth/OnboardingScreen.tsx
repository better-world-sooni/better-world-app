import React, {useRef} from 'react';
import {Div} from 'src/components/common/Div';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {HAS_NOTCH} from 'src/modules/constants';
import {RootState} from 'src/redux/rootReducer';
import CustomHeaderWebView from 'src/components/CustomHeaderWebView';
import {urls} from 'src/modules/urls';
import {useChangeAccount} from 'src/redux/appReducer';
import {CommonActions} from '@react-navigation/native';
import {NAV_NAMES} from 'src/modules/navNames';
import apis from 'src/modules/apis';
import {getKeyByApi} from 'src/redux/asyncReducer';

const OnboardingScreen = ({navigation}) => {
  const {currentUser} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const changeAccount = useChangeAccount();
  const goToHome = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: NAV_NAMES.Home}],
      }),
    );
  };
  const onboardingUri = urls.onboarding.index();
  const handleBwwMessage = message => {
    if (
      message.action == 'http' &&
      message.params.urlObject?.key == getKeyByApi(apis.auth.jwt) &&
      message.result.success
    ) {
      changeAccount(message.result.jwt, goToHome);
    }
  };

  return (
    <Div flex>
      <CustomHeaderWebView
        uri={onboardingUri}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        onbwwMessage={handleBwwMessage}
      />
    </Div>
  );
};

export default OnboardingScreen;
