import {useNavigation, useRoute} from '@react-navigation/native';
import {createSlice} from '@reduxjs/toolkit';
import _ from 'lodash';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';
import {asyncThunk} from './asyncThunk';

const getPromiseFn = async args => {
  const {url, token} = args;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && {Authorization: 'Bearer ' + token}),
    },
  });
  const json = await res.json();
  return {ok: res.ok, data: json, status: res.status};
};

const postPromiseFn = async args => {
  const {url, body, token} = args;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && {Authorization: 'Bearer ' + token}),
    },
    ...(body && {body: JSON.stringify(body)}),
  });
  const json = await res.json();
  return {ok: res.ok, data: json, status: res.status};
};

const keyWithScope = (key, scope?) => {
  return scope ? `${scope}/${key}` : key;
};

const getKeyByApi = (api, scope?) => {
  if (typeof api === 'function') {
    return keyWithScope(api._apiKey, scope);
  } else if (typeof api === 'object') {
    return keyWithScope(api.key, scope);
  } else if (typeof api === 'string') {
    return keyWithScope(api, scope);
  }
};

export const useApiResetAll = () => {
  const dispatch = useDispatch();
  return () => dispatch(asyncActions.reset());
};

export const useApiReset = (api, scope?) => {
  const key = getKeyByApi(api, scope);
  const dispatch = useDispatch();
  return () => dispatch(asyncActions.resetByKey({key}));
};

export const useApiResetByScope = scope => {
  const dispatch = useDispatch();
  return () => dispatch(asyncActions.resetByScope({scope}));
};

export const useApiGET = (props = {}) => {
  const {scope, token} = props as any;
  const {userToken} = useSelector(
    (root: RootState) => ({userToken: root.app.session.token}),
    shallowEqual,
  );
  const finalToken = token ? token : userToken;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  return (api, successHandler?, errHandler?) => {
    const key = getKeyByApi(api, scope);
    dispatch(
      asyncThunk({
        key: key,
        args: {url: api.url, ...(finalToken && {token: finalToken})},
        promiseFn: getPromiseFn,
        successHandler,
        errHandler,
        navigation,
      }),
    );
  };
};

export const useApiGETWithToken = (props = {}) => {
  const {scope} = props as any;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const route = useRoute();
  return (api, token, successHandler?, errHandler?) => {
    const key = getKeyByApi(api, scope);
    dispatch(
      asyncThunk({
        key: key,
        args: {url: api.url, ...(token && {token: token})},
        promiseFn: getPromiseFn,
        successHandler,
        errHandler,
        navigation,
      }),
    );
  };
};

export const useReloadGET = (props = {}) => {
  const {scope, token} = props as any;
  // const {userToken} = useSelector(
  //   (root: RootState) => ({userToken: root.app.session.token}),
  //   shallowEqual,
  // );
  const userToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1c2VyX2lkIjo5Mjc5OCwiZXhwIjoxNjU3ODI2NDQ5MDAwfQ.jvMcDNNw3Hh2Po6FbHcmuHFHILVyuyTMh_MufrkkQF08w_GRWfttTgPa-x3-i5hh_NqggOeGqO-amA7qJeMi0lkttL3NXlCoRKN_9eKD2rei0ecTwnn0wSEqegnNrF4Wv1EH7u7N0D4xlnKdrr5w4m6cEFkJm_wxbdp0sY627kMD_r8WnxN0VktjSKbMG3XAS4qRxrZxIb0-ZGtAvcDWEaAAw5EgJgVruwOrgcSgNoDb8TaZy7c6SbW0MjSLi5oopVuc6eL00tU7hZkqIDIMjiPkwW4MRBjF1SNs0qAGAHR8PaLq61hLEUxJ7xITMDXZwDVoGkFQ9ME6mgEcneM_Cg"
  const finalToken = token ? token : userToken;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  return (api, successHandler?, errHandler?) => {
    const key = getKeyByApi(api, scope);
    dispatch(
      asyncThunk({
        key: key,
        args: {url: api.url, ...(finalToken && {token: finalToken})},
        promiseFn: getPromiseFn,
        successHandler,
        errHandler,
        navigation,
        reload: true,
      }),
    );
  };
};

export const useApiPOST = (props = {}) => {
  const {scope, token} = props as any;
  // const {userToken} = useSelector(
  //   (root: RootState) => ({userToken: root.app.session.token}),
  //   shallowEqual,
  // );
  const userToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1c2VyX2lkIjo5Mjc5OCwiZXhwIjoxNjU3ODI2NDQ5MDAwfQ.jvMcDNNw3Hh2Po6FbHcmuHFHILVyuyTMh_MufrkkQF08w_GRWfttTgPa-x3-i5hh_NqggOeGqO-amA7qJeMi0lkttL3NXlCoRKN_9eKD2rei0ecTwnn0wSEqegnNrF4Wv1EH7u7N0D4xlnKdrr5w4m6cEFkJm_wxbdp0sY627kMD_r8WnxN0VktjSKbMG3XAS4qRxrZxIb0-ZGtAvcDWEaAAw5EgJgVruwOrgcSgNoDb8TaZy7c6SbW0MjSLi5oopVuc6eL00tU7hZkqIDIMjiPkwW4MRBjF1SNs0qAGAHR8PaLq61hLEUxJ7xITMDXZwDVoGkFQ9ME6mgEcneM_Cg"
  const finalToken = token ? token : userToken;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  return (api, body?, successHandler?, errHandler?) => {
    const key = getKeyByApi(api, scope);
    dispatch(
      asyncThunk({
        key: key,
        args: {
          url: api.url,
          ...(body && {body}),
          ...(finalToken && {token: finalToken}),
        },
        promiseFn: postPromiseFn,
        successHandler,
        errHandler,
        navigation,
      }),
    );
  };
};

export const useReloadPOST = (props = {}) => {
  const {scope, token} = props as any;
  const {userToken} = useSelector(
    (root: RootState) => ({userToken: root.app.session.token}),
    shallowEqual,
  );
  const finalToken = token ? token : userToken;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  return (api, body?, successHandler?, errHandler?) => {
    const key = getKeyByApi(api, scope);
    dispatch(
      asyncThunk({
        key: key,
        args: {
          url: api.url,
          ...(body && {body}),
          ...(finalToken && {token: finalToken}),
        },
        promiseFn: postPromiseFn,
        successHandler,
        errHandler,
        navigation,
        reload: true,
      }),
    );
  };
};

export const useApiSelector = (api, scope?) => {
  const newKey = getKeyByApi(api, scope);
  const {data, isLoading, error} = useSelector(
    (root: RootState) => ({
      data: root.async[newKey]?.data,
      isLoading: root.async[newKey]?.isLoading,
      error: root.async[newKey]?.error,
    }),
    shallowEqual,
  );
  return {
    data,
    isLoading,
    error,
  };
};

const asyncSlice = createSlice({
  name: 'async',
  initialState: {},
  reducers: {
    reset() {
      return {};
    },
    resetByKey(state, action) {
      const {key} = action.payload;
      state[key] = {};
    },
    resetByScope(state, action) {
      const {scope} = action.payload;
      Object.keys(state).map(key => {
        if (_.startsWith(key, `/${scope}`)) {
          state[key] = {};
        }
      });
    },
    fetchEvery(state, action) {
      const {key, args} = action.payload;
      state[key] = {
        args: args,
        data: null,
        isLoading: true,
        startedAt: new Date().toString(),
        finishedAt: null,
        elapedTime: 0,
        error: null,
      };
    },
    fetchReload(state, action) {
      const {key, args} = action.payload;
      const prevData = state[key] && state[key].data;
      state[key] = {
        args: args,
        data: null,
        ...(prevData && {data: prevData}),
        isLoading: true,
        startedAt: new Date().toString(),
        finishedAt: null,
        elapedTime: 0,
        error: null,
      };
    },
    success(state, action) {
      const {key, data, status, elapsedTime} = action.payload;
      state[key] = {
        ...state[key],
        data: data,
        status: status,
        isLoading: false,
        finishedAt: new Date().toString(),
        elapsedTime: elapsedTime,
        error: null,
      };
    },
    error(state, action) {
      const {key, error, status, elapsedTime} = action.payload;
      state[key] = {
        ...state[key],
        data: null,
        status: status,
        isLoading: false,
        finishedAt: new Date().toString(),
        elapsedTime: elapsedTime,
        error: error,
      };
    },
  },
});

export const asyncReducer = asyncSlice.reducer;
export const asyncActions = asyncSlice.actions;
