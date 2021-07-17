/* eslint-disable react-hooks/exhaustive-deps */
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useCallback, useState} from 'react';
import {useDispatch} from 'react-redux';
import APIS from 'src/modules/apis';
import {appActions} from 'src/redux/appReducer';
import {useApiGET, useApiPOST} from 'src/redux/asyncReducer';

export const useUpdateUser = initCallback => {
  const apiGET = useApiGET({scope: 'GET'});
  const dispatch = useDispatch();
  const update = (callback?) => {
    apiGET(APIS.profile.get(), ({data}) => {
      dispatch(appActions.updateUser({user: data.user}));
      if (callback) {
        callback(data);
      } else {
        initCallback(data);
      }
    });
  };
  useFocusEffect(
    useCallback(() => {
      update(initCallback);
    }, []),
  );
  return update;
};

export const useBetterApiPOST = (props = {scope: 'POST'}) => {
  const apiPOST = useApiPOST(props);
  return ({api, body, ...others}) => {
    const {
      setLoading,
      before,
      success: successHandler,
      error: errorHandler,
      after,
    } = others;
    if (setLoading) {
      setLoading(true);
    }
    if (before) {
      before();
    }
    apiPOST(
      api,
      body,
      async props => {
        const {data} = props;
        if (successHandler) {
          await successHandler(data);
        }
        if (after) {
          after();
        }
        if (setLoading) {
          setLoading(false);
        }
      },
      async props => {
        const {error} = props;
        if (errorHandler) {
          await errorHandler(error);
        }
        if (after) {
          after();
        }
        if (setLoading) {
          setLoading(false);
        }
      },
    );
  };
};

export const useBetterApiGET = (props = {scope: 'GET'}) => {
  const apiGET = useApiGET(props);
  return ({api, ...others}) => {
    const {
      setLoading,
      before,
      success: successHandler,
      error: errorHandler,
      after,
    } = others;
    if (setLoading) {
      setLoading(true);
    }
    if (before) {
      before();
    }
    apiGET(
      api,
      async props => {
        const {data} = props;
        if (successHandler) {
          await successHandler(data);
        }
        if (after) {
          after(props);
        }
        if (setLoading) {
          setLoading(false);
        }
      },
      async props => {
        const {error} = props;
        if (errorHandler) {
          await errorHandler(error);
        }
        if (after) {
          after(props);
        }
        if (setLoading) {
          setLoading(false);
        }
      },
    );
  };
};

export const useFocusOnce = (callback, deps = []) => {
  const [done, setDone] = useState(false);
  useFocusEffect(
    useCallback(() => {
      if (done) {
        return;
      }
      callback();
      setDone(true);
    }, [done, ...deps]),
  );
};

export const useGoBack = (onGoBack = null) => {
  const navigation = useNavigation();
  const [done, setDone] = useState(false);
  return () => {
    if (done) {
      return;
    }
    setDone(true);
    if (onGoBack) {
      onGoBack();
    }
    navigation.goBack();
  };
};
