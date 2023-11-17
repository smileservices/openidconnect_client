import React, {createContext, useReducer, useContext, useEffect} from 'react';
import {REQUEST_STATE, requestReducer} from "./forms/forms";
import {GET} from "./requests";
import {createCookie} from "./utils";

const STRING_SEPARATOR = "&&^&&";


const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export function AuthProvider({children, redirectToAuth = false}) {
    const [authReq, dispatchAuthReq] = useReducer(requestReducer, REQUEST_STATE);

    useEffect(() => {
        GET(AUTH_URL + "/status", dispatchAuthReq)
    }, []);


    useEffect(() => {
        if (authReq.error && redirectToAuth) location.href = AUTH_URL + "?next=" + location.href;
    }, [authReq])

    return (
        <AuthContext.Provider value={authReq}>
            {children}
        </AuthContext.Provider>
    );
}
