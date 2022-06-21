import {combineReducers} from 'redux';
import {asyncReducer} from './asyncReducer';
import {appReducer} from './appReducer';

export type RootState = {
  app: ReturnType<typeof appReducer>;
  async: ReturnType<typeof asyncReducer>;
};

const rootReducer = combineReducers({
  async: asyncReducer,
  app: appReducer,
});

export default rootReducer;
