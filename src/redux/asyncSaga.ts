/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  select,
  call,
  put,
  takeEvery,
  takeLatest,
  takeLeading,
  delay,
} from 'redux-saga/effects';
import {asyncActions} from './asyncReducer';
import elapsed from '@f/elapsed-time';
import {RootState} from 'src/redux/rootReducer';

function* asyncSaga(action) {
  const {
    key,
    promiseFn,
    args,
    successHandler,
    errHandler,
    navigation,
    dispatch,
  } = action.payload;
  const time = elapsed();
  const token = yield select((root: RootState) => root.app.session.token);
  try {
    const ret = yield call(promiseFn, {token, ...args});
    console.log(ret);
    const {ok, data, status} = ret;
    if (ok && (data.success === undefined || data.success)) {
      const elapsedTime = time();
      yield put(
        asyncActions.success({
          key: key,
          data: data,
          status: status,
          elapsedTime: elapsedTime,
        }),
      );
      if (successHandler) {
        console.log('success callback');
        yield call(successHandler, {
          success: true,
          error: null,
          data: data,
          status: status,
          navigation,
          dispatch,
        });
      }
    } else {
      const err = new Error();
      err.data = data;
      err.status = status;
      throw err;
    }
  } catch (error) {
    const elapsedTime = time();
    yield put(
      asyncActions.error({
        key: key,
        error: error.data,
        status: error.status,
        elapsedTime: elapsedTime,
      }),
    );
    if (errHandler) {
      console.log('error callback');
      yield call(errHandler, {
        success: false,
        error: error.data,
        status: error.status,
        data: null,
        navigation,
        dispatch,
      });
    }
  }
}

export function* watchFetch() {
  yield takeEvery(asyncActions.fetchEvery.type, asyncSaga);
}
export function* watchReload() {
  yield takeEvery(asyncActions.fetchReload.type, asyncSaga);
}
