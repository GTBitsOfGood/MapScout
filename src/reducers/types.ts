import { TeamDocProps, ProviderProps } from "../types/firestore";
import { ChatDBProps } from "../types/rtdb";
import {} from "redux-firestore";

export type InitialState = {
    selected: ProviderProps | null;
    team: TeamDocProps;
    chatHistory: ChatDBProps[];
    newChat: boolean;
};

export type Store = {
    item: InitialState;
    firebase: any; //Unfortunately react-redux-firebase just uses a ton of any/object
    firestore: any; //Unfortunately redux-firestore just uses a ton of any/object
};
