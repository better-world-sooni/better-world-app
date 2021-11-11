import elapsed from '@f/elapsed-time';
import {asyncActions} from './asyncReducer';

export const asyncThunk =
  ({
    key,
    promiseFn,
    args,
    successHandler,
    errHandler,
    navigation,
    reload = false,
  }) =>
  async dispatch => {
    const time = elapsed();
    try {
      if (reload) {
        dispatch(asyncActions.fetchReload({key: key, args: args}));
      } else {
        dispatch(asyncActions.fetchEvery({key: key, args: args}));
      }
      const ret = await promiseFn(args);
      const {ok, data, status} = ret;
      if (ok && (data.success === undefined || data.success)) {
        const elapsedTime = time();
        dispatch(
          asyncActions.success({
            key: key,
            data: data,
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
            navigation,
            dispatch,
          });
        }
      } else {
        const err = new Error();
        console.log("Error HEREE")
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
          navigation,
          dispatch,
        });
      }
    }
  };
