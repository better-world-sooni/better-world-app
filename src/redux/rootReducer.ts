import {combineReducers} from 'redux';
import {asyncReducer} from './asyncReducer';
import {appReducer} from './appReducer';
import { routeReducer } from './routeReducer';
import { metasunganReducer } from './metasunganReducer';
import { chatReducer } from './chatReducer';
import { feedReducer } from './feedReducer';

export type RootState = {
  app: ReturnType<typeof appReducer>;
  async: ReturnType<typeof asyncReducer>;
  route: ReturnType<typeof routeReducer>;
  metasungan: ReturnType<typeof metasunganReducer>;
  chat: ReturnType<typeof chatReducer>;
  feed: ReturnType<typeof feedReducer>;
};

const rootReducer = combineReducers({
  async: asyncReducer,
  app: appReducer,
  route: routeReducer,
  metasungan: metasunganReducer,
  chat: chatReducer,
  feed: feedReducer,
});

export default rootReducer;
