import {combineReducers} from 'redux';
import {asyncReducer} from './asyncReducer';
import {appReducer} from './appReducer';
import { pathReducer } from './pathReducer';
import {userInfoReducer} from './userInfoReducer';
import { metasunganReducer } from './metasunganReducer';
import { chatReducer } from './chatReducer';
import { feedReducer } from './feedReducer';

export type RootState = {
  app: ReturnType<typeof appReducer>;
  async: ReturnType<typeof asyncReducer>;
  path: ReturnType<typeof pathReducer>;
  userInfo: ReturnType<typeof asyncReducer>;
  metasungan: ReturnType<typeof metasunganReducer>;
  chat: ReturnType<typeof chatReducer>;
  feed: ReturnType<typeof feedReducer>;
};

const rootReducer = combineReducers({
  async: asyncReducer,
  app: appReducer,
  path: pathReducer,
  userInfo: userInfoReducer,
  metasungan: metasunganReducer,
  chat: chatReducer,
  feed: feedReducer,
});

export default rootReducer;
