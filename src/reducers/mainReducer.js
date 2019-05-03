
const initialState = {
    providers: [],
    inProgress: false,
    errorMessage: null,
};

const mainReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'REQUEST_GET_PROVIDERS_SENT':
            return Object.assign({}, state, {
                inProgress: true,
            });
        case 'REQUEST_GET_PROVIDERS_FAILED':
            return Object.assign({}, state, {
                inProgress: false,
                errorMessage: action.error,
            });
        case 'REQUEST_GET_PROVIDERS_SUCCESS':
            return Object.assign({}, state, {
                providers: action.providers,
                inProgress: false,
                errorMessage: null,
            });
        default:
            return state;
    }
};

export default mainReducer;
