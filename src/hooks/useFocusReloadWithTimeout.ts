import { useApiSelector, useReloadGETWithToken } from "src/redux/asyncReducer";
import { useFocusEffect } from '@react-navigation/native';

export default function useFocusReloadWithTimeOut({reloadUriObject, cacheTimeoutInSeconds, onStart=null}){
    const {
        isLoading,
        isPaginating,
        finishedAt
    } = useApiSelector(reloadUriObject);
    const reloadGET = useReloadGETWithToken()
    useFocusEffect(
        () => {
            if(!isLoading && !isPaginating && (!finishedAt || new Date(finishedAt.getTime() + cacheTimeoutInSeconds *1000) < new Date())){
                onStart()
                reloadGET(reloadUriObject)
            }
          }
      );
}