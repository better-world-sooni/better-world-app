import {combineReducers} from 'redux';
import {asyncReducer} from './asyncReducer';
import {appReducer} from './appReducer';
import { pathReducer } from './pathReducer';
import {userInfoReducer} from './userInfoReducer';

export type RootState = {
  app: ReturnType<typeof appReducer>;
  async: ReturnType<typeof asyncReducer>;
  path: ReturnType<typeof pathReducer>;
  userInfo: ReturnType<typeof asyncReducer>;
};

const rootReducer = combineReducers({
  async: asyncReducer,
  app: appReducer,
  path: pathReducer,
  userInfo: userInfoReducer,
});

export default rootReducer;
