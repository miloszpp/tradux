import { Action } from 'redux';

import { Actions, AuthenticateAction } from '../actions';

export interface ControlState {
    username: string | null;
    isLogged: boolean;
}

const initialState = {
    username: null,
    isLogged: false
};

export function control(state = initialState, action: Action) {
    switch (action.type) {
        case Actions.authenticate:
            const authenticateAction = <AuthenticateAction>action;
            return {
                username: authenticateAction.username,
                isLogged: true
            };
        default:
            return state;
    }
}