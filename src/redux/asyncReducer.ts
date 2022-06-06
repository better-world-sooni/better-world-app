import {useNavigation, useRoute} from '@react-navigation/native';
import {createSlice} from '@reduxjs/toolkit';
import _ from 'lodash';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';
import {asyncThunk, FetchType} from './asyncThunk';


export const usePutPromiseFnWithToken = () => {
  const {userToken} = useSelector(
    (root: RootState) => ({userToken: root.app.session.token}),
    shallowEqual,
  );
  return async(args) => putPromiseFn({...args, token: userToken})
};
export const usePostPromiseFnWithToken = () => {
  const {userToken} = useSelector(
    (root: RootState) => ({userToken: root.app.session.token}),
    shallowEqual,
  );
  return async(args) => postPromiseFn({...args, token: userToken})
};
export const useDeletePromiseFnWithToken = () => {
  const {userToken} = useSelector(
    (root: RootState) => ({userToken: root.app.session.token}),
    shallowEqual,
  );
  return async(args) => deletePromiseFn({...args, token: userToken})
};

export const useGetPromiseFnWithToken = () => {
  const {userToken} = useSelector(
    (root: RootState) => ({userToken: root.app.session.token}),
    shallowEqual,
  );
  return async(args) => await getPromiseFn({...args, token: userToken})
};



export const usePromiseFnWithToken = () => {
  const {userToken} = useSelector(
    (root: RootState) => ({userToken: root.app.session.token}),
    shallowEqual,
  );
  return async(args) => promiseFn({...args, token: userToken,})
};

export const getPromiseFn = async args => {
  return await promiseFn({...args, method: "GET"})
};

export const postPromiseFn = async args => {
  return await promiseFn({...args, method: "POST"})
};

export const deletePromiseFn = async args => {
  return await promiseFn({...args, method: "DELETE"})
};

export const patchPromiseFn = async args => {
  return await promiseFn({...args, method: "PATCH"})
};

export const putPromiseFn = async args => {
  return await promiseFn({...args, method: "PUT"})
};

export const promiseFn = async ({url, body, token, method}) => {
  const res = await fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && {Authorization: 'Bearer ' + token}),
    },
    ...(body && {body: JSON.stringify(body)}),
  });
  const json = await res.json();
  return {ok: res.ok, data: json, status: res.status};
}

export const promiseFnPure = async args => {
  const {url, body, method, headers} = args;
  const res = await fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body,
  });
  return res
}

const keyWithScope = (key, scope?) => {
  return scope ? `${scope}/${key}` : key;
};

export const getKeyByApi = (api, scope?) => {
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

export const useApiGETWithToken = (props = {}) => {
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

export const useApiGET = (props = {}) => {
  const {scope} = props as any;
  const dispatch = useDispatch();
  const navigation = useNavigation();
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

export const useApiGETAsync = (props = {}) => {
  const {scope} = props as any;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  return async (api, token, successHandler?, errHandler?) => {
    const key = getKeyByApi(api, scope);
    await dispatch(await asyncThunk({
      key: key,
      args: {url: api.url, ...(token && {token: token})},
      promiseFn: getPromiseFn,
      successHandler,
      errHandler,
      navigation,
    }))
  };
};

export const useReloadGETWithToken = (props = {}) => {
  const {scope, token} = props as any;
  const { userToken } = useSelector(
    (root: RootState) => ({ userToken: root.app.session.token }),
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
        args: { url: api.url, ...(finalToken && { token: finalToken }) },
        promiseFn: getPromiseFn,
        successHandler,
        errHandler,
        navigation,
        fetchType: FetchType.Reload,
      }),
    );
  };
};
export const usePaginateGETWithToken = (props = {}) => {
  const {scope, token} = props as any;
  const { userToken } = useSelector(
    (root: RootState) => ({ userToken: root.app.session.token }),
    shallowEqual,
  );
  const finalToken = token ? token : userToken;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  return (api, concatKey, successHandler?, errHandler?) => {
    const key = getKeyByApi(api, scope);
    dispatch(
      asyncThunk({
        key: key,
        args: { url: api.url, ...(finalToken && { token: finalToken }) },
        promiseFn: getPromiseFn,
        concatKey,
        successHandler,
        errHandler,
        navigation,
        fetchType: FetchType.Paginate,
      }),
    );
  };
};

export const useApiPOSTWithToken = (props = {}) => {
  const {scope, token} = props as any;
  const { userToken } = useSelector(
    (root: RootState) => ({ userToken: root.app.session.token }),
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
      }),
    );
  };
};

export const useApiPUTWithToken = (props = {}) => {
  const {scope, token} = props as any;
  const { userToken } = useSelector(
    (root: RootState) => ({ userToken: root.app.session.token }),
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
        promiseFn: putPromiseFn,
        successHandler,
        errHandler,
        navigation,
      }),
    );
  };
};

export const useReloadPOSTWithToken = (props = {}) => {
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
        fetchType: FetchType.Reload,
      }),
    );
  };
};

export const useApiSelector = (api, scope?) => {
  const newKey = getKeyByApi(api, scope);
  const {data, isLoading, error, page, isPaginating, isNotPaginatable} = useSelector(
    (root: RootState) => ({
      data: root.async[newKey]?.data,
      isLoading: root.async[newKey]?.isLoading,
      isPaginating: root.async[newKey]?.isPaginating,
      error: root.async[newKey]?.error,
      page: root.async[newKey]?.page,
      isNotPaginatable: root.async[newKey]?.isNotPaginatable
    }),
    shallowEqual,
  );
  return {
    data,
    isLoading,
    isPaginating,
    error,
    page,
    isNotPaginatable
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
        page: 1,
        error: null,
        isNotPaginatable: false,
      };
    },
    fetchReload(state, action) {
      const {key} = action.payload;
      state[key].isLoading = true
      state[key].startedAt = new Date().toString()
      state[key].page = 1
      state[key].error = null
      state[key].isNotPaginatable = false
    },
    fetchPaginate(state, action) {
      const {key} = action.payload;
      state[key].isPaginating = true
      state[key].startedAt = new Date().toString()
      state[key].error = null
      state[key].isNotPaginatable = false
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
    successConcat(state, action) {
      const {key, data, status, elapsedTime, concatKey} = action.payload;
      const prevPage = state[key] && state[key].page;
      const isNotPaginatable = (data[concatKey]?.length || 0) == 0
      state[key] = {
        ...state[key],
        status: status,
        isLoading: false,
        isPaginating: false,
        finishedAt: new Date().toString(),
        elapsedTime: elapsedTime,
        page: prevPage ? prevPage + 1 : 1,
        isNotPaginatable,
        error: null,
      };
      if(!isNotPaginatable) state[key].data[concatKey] = [...state[key].data[concatKey],...(data[concatKey])]
    },
    error(state, action) {
      const {key, error, status, elapsedTime} = action.payload;
      state[key] = {
        ...state[key],
        data: null,
        status: status,
        isLoading: false,
        isPaginating: false,
        finishedAt: new Date().toString(),
        elapsedTime: elapsedTime,
        error: error,
      };
    },
  },
});

export const asyncReducer = asyncSlice.reducer;
export const asyncActions = asyncSlice.actions;
