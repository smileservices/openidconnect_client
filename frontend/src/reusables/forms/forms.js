import Waiting from "../Waiting";
import Alert from "../Alert";
import React from "react";
import {makeId} from "../utils";

export const REQUEST_STATE = {
    data: false,
    waiting: false,
    error: false,
    success: false,
}

export const requestReducer = (state, action) => {
    // console.log("REQ REDUCER", action)
    switch (action.type) {
        case "START":
            return {
                waiting: true,
                error: false,
                success: false,
                data: false
            }
        case "SUCCESS":
            if (action.payload) {
                return {
                    waiting: false,
                    error: false,
                    success: action.payload.detail ? action.payload.detail : true,
                    data: action.payload,
                }
            } else {
                return {
                    waiting: false,
                    error: false,
                    success: true,
                    data: true,
                }
            }
        case "ERROR":
            return {
                waiting: false,
                success: false,
                error: action.payload,
                data: false
            }
        default:
            return state;
    }
}

export function buildAlert(error) {
    if (!error) {
        return "";
    }
    const alertText = error;
    return (<Alert
        key={makeId()}
        text={alertText} type="danger"
        hideable={false}
    />)
}

export function buildSuccess(success) {
    if (!success) {
        return "";
    }
    const alertText = success;
    return (<Alert
        key={makeId()}
        text={alertText} type="success"
        hideable={false}
    />)
}

export function FormElement({
                                callback,
                                formState,
                                buttonText = false,
                                cancel = false,
                                className = "",
                                extraButtons = [],
                                children
                            }) {

    const cancelAction = (e) => {
        e.preventDefault();
        cancel();
    }
    return (
        <form onSubmit={e => {
            e.preventDefault();
            e.stopPropagation();
            callback();
            // window.scrollTo({ top: 0,
            // behavior: 'smooth' });
        }} className={className}>
            {formState.waiting ? <div className="overlay-waiting"><Waiting text="Posting..."/></div> : ""}
            {children}
            {buildAlert(formState.error)}
            {buildSuccess(formState.success)}
            <div className="buttons-container">
                {extraButtons.map(b => b)}
                {cancel ? <button type="submit" className="btn secondary" onClick={cancelAction}>Cancel</button> : ''}
                <button type="submit" className="btn">{buttonText ? buttonText : 'Submit'}</button>
            </div>
        </form>
    )
}