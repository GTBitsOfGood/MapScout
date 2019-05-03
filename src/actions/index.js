import fetch from 'isomorphic-fetch';
import config from '../config/client';

export const requestSearchSent = () => ({
    type: 'REQUEST_GET_PROVIDERS_SENT'
});

export const requestSearchFailed = (error) => ({
    type: 'REQUEST_GET_PROVIDERS_FAILED', error
});

export const requestSearchSuccess = (providers) => ({
    type: 'REQUEST_GET_PROVIDERS_SUCCESS', providers
});

export function requestProviders() {
    return function(dispatch) {
        dispatch(requestSearchSent());
        return fetch(`${config.endpoint}providers/`)
            .then(response => response.json()
                .then(json => ({
                    status: response.status,
                    json
                })))
            .then(({ status, json }) => {
                if (status >= 400) dispatch(requestSearchFailed());
                else dispatch(requestSearchSuccess(json))
            }, err => { dispatch(requestSearchFailed(err))  })
    }
}

export function testThing() {
    return function(dispatch) {
        dispatch(requestSearchSent());
        return fetch(`${config.endpoint}test`)
            .then(response => response.json()
                .then(json => ({
                    status: response.status,
                    json
                })))
            .then(({ status, json }) => {
                if (status >= 400) dispatch(requestSearchFailed());
                else dispatch(requestSearchSuccess(json))
            }, err => { dispatch(requestSearchFailed(err))  })
    }
}
