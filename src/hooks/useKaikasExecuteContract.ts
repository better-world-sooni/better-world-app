import { useState } from 'react';
import { Linking } from 'react-native';
import { bappName } from 'src/modules/klip';
import { largeBump } from 'src/utils/hapticFeedBackUtils';
import { kaikasApp2AppRequestUrl } from 'src/utils/uriUtils';

const SERVER_URL = "https://api.kaikas.io/api/v1/k"

const prepare = {
  executeContract: ({
    bappName,
    from = null,
    to,
    value,
    abi,
    params,
    successLink = null,
    failLink = null,
  }) => {
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
        type: "execute_contract",
        transaction: {
          from: from,
          to: to,
          value: value,
          abi: abi,
          params: params,
        },
      }),
    }).then((res) => res.json());
  }
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

export default function useKaikasExecuteContract(){
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [prepareResult, setPrepareResult] = useState<PrepareResult>(null)

    async function requestExecuteContract({
      to,
      value,
      abi,
      params,
    }){
        setError('')
        console.log({ bappName, to,
          value,
          abi,
          params })
        const prepareRes = await prepare.executeContract({ bappName, to,
          value,
          abi,
          params }) as PrepareResult
          setPrepareResult(prepareRes)
          console.log(JSON.stringify(prepareRes))
        Linking.openURL(kaikasApp2AppRequestUrl(prepareRes.request_key))
    }
    
    async function checkResultAndCallback({callback}){
        if(loading) return;
        largeBump()
        setError('')
        setLoading(true)
        try {
            const authResult = await getResultExecuteContract()
            if(authResult){
              await callback(authResult)
            }
        } catch (e) {
            setError("메세지를 서명하는 도중 문제가 발생하였습니다.")
        }
        setLoading(false)
    }


    async function getResultExecuteContract(){
        const res = await getResult(prepareResult.request_key)
        if (res.status == "completed") {
            return res.result
        }
        if (res.status == "requested") {
            setError("카이카스 지갑에 클레이 전송을 요청하였지만 아직 수락하지 않았습니다.")
            return null;
        }
        setPrepareResult(null)
        return null;

    }

    return {error, loading, prepareResult, requestExecuteContract, checkResultAndCallback}
}