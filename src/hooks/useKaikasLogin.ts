import { CommonActions, useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Linking, Platform } from 'react-native';
import apis from 'src/modules/apis';
import { bappName, PLATFORM } from 'src/modules/klip';
import { NAV_NAMES } from 'src/modules/navNames';
import { useAutoLogin } from 'src/redux/appReducer';
import { postPromiseFn } from 'src/redux/asyncReducer';
import { openInfoPopup } from 'src/utils/bottomPopupUtils';
import { largeBump, smallBump } from 'src/utils/hapticFeedBackUtils';
import { kaikasApp2AppRequestUrl, klipApp2AppRequestUrl } from 'src/utils/uriUtils';
import { useGotoHome } from './useGoto';

const SERVER_URL = "https://api.kaikas.io/api/v1/k"

const prepare = {
  auth: ({ bappName, successLink = null, failLink = null }) => {
    return fetch(`${SERVER_URL}/prepare`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bapp: {
          name: bappName,
          callback: {
            success: successLink,
            fail: failLink,
          },
        },
        type: "auth",
      }),
    }).then((res) => res.json());
  },
}
const getResult = (requestKey) => {
  return fetch(`${SERVER_URL}/result/${requestKey}`, {
    method: "GET",
  }).then((res) => res.json());
};

type PrepareResult = {
    expiration_time: number;
    request_key: string;
    status: string;
}

export default function useKaikasLogin(){
    const autoLogin = useAutoLogin();
    const gotoHome = useGotoHome()
    const {goBack} = useNavigation()
    const navigation = useNavigation()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [prepareAuthResult, setPrepareAuthResult] = useState<PrepareResult>(null)

    async function requestAuth(){
        setError('')
        const prepareRes = await prepare.auth({ bappName }) as PrepareResult
        setPrepareAuthResult(prepareRes)
        Linking.openURL(kaikasApp2AppRequestUrl(prepareRes.request_key))
    }
    
    async function checkResultAndLogin(){
        if(loading) return;
        largeBump()
        setError('')
        setLoading(true)
        try {
            const authResult = await getResultAuth()
            if(authResult){
                const verificationResponse = await getVerification({klaytnAddress: authResult.klaytn_address})
                if (verificationResponse) {
                    await autoLogin(
                        verificationResponse.jwt,
                        props => {
                          if (props.data.user.main_nft) {
                            gotoHome()
                            return;
                          }
                          if (props.data.user.nfts.length == 0) {
                            goBack()
                            openInfoPopup("지원하는 NFT를 보유하고 계시지 않습니다.", true)
                            return;
                          }
                          navigation.dispatch(
                            CommonActions.reset({
                              index: 0,
                              routes: [{name: NAV_NAMES.Onboarding}],
                            }),
                          );
                        },
                        props => {
                          navigation.navigate(NAV_NAMES.SignIn as never);
                        },
                      );
                }
            }
        } catch (e) {
            setError("메세지를 서명하는 도중 문제가 발생하였습니다.")
        }
        setLoading(false)
    }

    async function getVerification({klaytnAddress}){
        const {data: verificationResponse} = await postPromiseFn({url: apis.auth.kaikas.app2app().url, body: {
            address: klaytnAddress,
            request_key: prepareAuthResult.request_key,
            platform: PLATFORM,
            locale: 'ko'
        }});
        if (verificationResponse.success) return verificationResponse
        return null
    }


    async function getResultAuth(){
        const res = await getResult(prepareAuthResult.request_key)
        if (res.status == "completed") {
            return res.result
        }
        if (res.status == "requested") {
            setError("카이카스 지갑에 주소를 요청하였지만 아직 수락하지 않았습니다.")
            return null;
        }
        setPrepareAuthResult(null)
        return null;
        
    }

    return {error, loading, prepareAuthResult, requestAuth, checkResultAndLogin}
}