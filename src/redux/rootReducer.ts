import {combineReducers} from 'redux';
import {asyncReducer} from './asyncReducer';
import {appReducer} from './appReducer';
import { popupReducer } from './popupReducer';
import { wsReducer } from './wsReducer';

export type RootState = {
  app: ReturnType<typeof appReducer>;
  async: ReturnType<typeof asyncReducer>;
  popup: ReturnType<typeof popupReducer>;
  ws: ReturnType<typeof wsReducer>;
};

const rootReducer = combineReducers({
  async: asyncReducer,
  app: appReducer,
  popup: popupReducer,
  ws: wsReducer,
});

export default rootReducer;
