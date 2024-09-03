import { Dispatch } from "react";
import { ChatDBProps } from "../types/rtdb";
import { ProviderProps, TeamDocProps } from "types/firestore";

export const UPDATE_CHAT = "UPDATE_CHAT";

type DispatchProps<T> = {
    type: string;
    data: T;
};

export function updateChat(data: ChatDBProps[]) {
    return function x(dispatch: Dispatch<DispatchProps<ChatDBProps[]>>) {
        dispatch({
            type: UPDATE_CHAT,
            data,
        });
    };
}

export const UPDATE_NEW_CHAT = "UPDATE_NEW_CHAT";

export function updateNewChat(data: boolean) {
    return function x(dispatch: Dispatch<DispatchProps<boolean>>) {
        dispatch({
            type: UPDATE_NEW_CHAT,
            data,
        });
    };
}

export const SELECT_ITEM = "SELECT_ITEM";

export function selectItem(data: ProviderProps) {
    return function x(dispatch: Dispatch<DispatchProps<ProviderProps>>) {
        dispatch({
            type: SELECT_ITEM,
            data,
        });
    };
}

export const SELECT_TEAM = "SELECT_TEAM";

export function selectTeam(data: TeamDocProps) {
    return function x(dispatch: Dispatch<DispatchProps<TeamDocProps>>) {
        dispatch({
            type: SELECT_TEAM,
            data,
        });
    };
}
