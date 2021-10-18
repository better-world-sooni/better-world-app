import {combineReducers} from 'redux';
import {asyncReducer} from './asyncReducer';
import {appReducer} from './appReducer';
import { routeReducer } from './routeReducer';
import {userInfoReducer} from './userInfoReducer';
import { metasunganReducer } from './metasunganReducer';
import { chatReducer } from './chatReducer';
import { feedReducer } from './feedReducer';

export type RootState = {
  app: ReturnType<typeof appReducer>;
  async: ReturnType<typeof asyncReducer>;
  route: ReturnType<typeof routeReducer>;
  userInfo: ReturnType<typeof asyncReducer>;
  metasungan: ReturnType<typeof metasunganReducer>;
  chat: ReturnType<typeof chatReducer>;
  feed: ReturnType<typeof feedReducer>;
};

const rootReducer = combineReducers({
  async: asyncReducer,
  app: appReducer,
  route: routeReducer,
  userInfo: userInfoReducer,
  metasungan: metasunganReducer,
  chat: chatReducer,
  feed: feedReducer,
});

export default rootReducer;
