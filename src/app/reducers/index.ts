import { combineReducers, Reducer } from 'redux';

import { ScreenState, screen } from './screen';

export interface AppState {
    screen: ScreenState
}

export const rootReducer = combineReducers<AppState>({ screen });