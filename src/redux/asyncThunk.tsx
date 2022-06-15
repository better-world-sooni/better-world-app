import elapsed from '@f/elapsed-time';
import {asyncActions} from './asyncReducer';

export enum FetchType {
  Normal,
  Reload,
  Paginate,
}

export const asyncThunk =
  ({
    key,
    promiseFn,
    args,
    successHandler,
    errHandler,
    fetchType = FetchType.Normal,
    concatKey = null,
  }) =>
  async dispatch => {
    const time = elapsed();
    try {
      if (fetchType == FetchType.Paginate) {
        dispatch(asyncActions.fetchPaginate({key: key, args: args}));
      } else if (fetchType == FetchType.Reload) {
        dispatch(asyncActions.fetchReload({key: key, args: args}));
      } else {
        dispatch(asyncActions.fetchEvery({key: key, args: args}));
      }
      const ret = await promiseFn(args);
      const {ok, data, status} = ret;
      if (ok && (data.success === undefined || data.success)) {
        const elapsedTime = time();
        const successFn =
          fetchType == FetchType.Paginate
            ? asyncActions.successConcat
            : asyncActions.success;
        dispatch(
          successFn({
            key: key,
            data: data,
            concatKey,
            status: status,
            elapsedTime: elapsedTime,
          }),
        );
        if (successHandler) {
          await successHandler({
            success: true,
            error: null,
            data: data,
            status: status,
            dispatch,
          });
        }
      } else {
        const err = new Error();
        err.message = data;
        err.name = status;
        throw err;
      }
    } catch (error) {
      const elapsedTime = time();
      dispatch(
        asyncActions.error({
          key: key,
          error: error.message,
          status: error.name,
          elapsedTime: elapsedTime,
        }),
      );
      if (errHandler) {
        await errHandler({
          success: false,
          error: error.message,
          status: error.name,
          data: null,
          dispatch,
        });
      }
    }
  };
