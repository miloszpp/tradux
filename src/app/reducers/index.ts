import { combineReducers, Reducer } from 'redux';

import { ScreenState } from '../../common/reducers/screen';

import { screen } from './screen';
import { ControlState, control } from './control';

export interface AppState {
    screen: ScreenState,
    control: ControlState
}

export const rootReducer = combineReducers<AppState>({ screen, control });