import {combineReducers} from 'redux';
import {asyncReducer} from './asyncReducer';
import {appReducer} from './appReducer';
import {scheduleReducer} from './scheduleReducer';
import {userInfoReducer} from './userInfoReducer';

export type RootState = {
  app: ReturnType<typeof appReducer>;
  async: ReturnType<typeof asyncReducer>;
  schedule: ReturnType<typeof asyncReducer>;
  userInfo: ReturnType<typeof asyncReducer>;
};

const rootReducer = combineReducers({
  async: asyncReducer,
  app: appReducer,
  schedule: scheduleReducer,
  userInfo: userInfoReducer,
});

export default rootReducer;
