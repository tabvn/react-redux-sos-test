export const UPDATE_REGISTER_INFO = 'user/update_register_info'

const initState = {
    registerInfo: {
        email: {
            value: 'toan@tabvn.com'
        },
        password: {
            value: 'abc123'
        },
        passwordConfirm: {
            value: 'abc123'
        },
    },
};

export default (state = initState, action = {}) => {

    switch (action.type) {

        case UPDATE_REGISTER_INFO:


            return {
                ...state,
                registerInfo: action.payload
            };


        default:
            return state;
    }
}


/**
 * Update user register information
 * @param data
 * @returns {function(*)}
 */
export const updateRegisterInfo = (data) => {

    return dispatch => {

        // we can query to the api if need, for now i just only update the store.
        dispatch({
            type: UPDATE_REGISTER_INFO,
            payload: data
        });
    }
}