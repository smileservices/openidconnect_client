export const formReducer = (state, action) => {

    switch (action.type) {
        case "CHANGE_INPUT":
            return {
                ...state,
                data: {
                    ...state.data,
                    [action.payload.name]: action.payload.value
                },
            }
        case "CHANGE_META":
            return {
                ...state,
                data: {
                    ...state.data,
                    meta: {...state.data.meta, [action.payload.name]: action.payload.value}
                },
            }
        case "CHANGE_INPUTS":
            let new_state = {...state.data};
            action.payload.map(attr => new_state[attr.name] = attr.value)
            return {
                ...state,
                data: new_state,
            }
        case "FORM_ERROR":
            return {
                ...state,
                errors: action.payload
            }
        case "CLEAR_ERRORS":
            return {
                ...state,
                errors: {}
            }
        default:
            return state;
    }
}