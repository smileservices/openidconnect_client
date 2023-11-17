import React, {useEffect, useReducer, useState} from "react"
import {FileUploadField} from "./file_upload";
import {GET} from "../requests";
import {debug, makeId, transformObjectToListIfEmpty} from "../utils";


const REQUEST_STATE = {
    data: false,
    waiting: false,
    error: false,
    success: false,
}

const requestReducer = (state, action) => {
    switch (action.type) {
        case "START":
            return {
                waiting: true,
                error: false,
                success: false,
                data: false
            }
        case "SUCCESS":
            return {
                waiting: false,
                error: false,
                success: true,
                data: action.payload,
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

const STATE = {
    open: false,
    error: false,
    selected: false,
    files: false
}

const reducer = (state, action) => {
    switch (action.type) {
        case "OPEN":
            return {
                ...state,
                open: true
            }
        case "SELECT":
            return {
                ...state,
                selected: action.payload,
                error: false,
                open: false
            }
        case "ERROR":
            return {
                ...state,
                error: action.payload
            }
        case "DESELECT":
            return {
                ...state,
                selected: false
            }
        default:
            return state;
    }
}

export default function FileSelectComponent({
                                                name,
                                                label,
                                                smallText,
                                                selected,
                                                error,
                                                filesUrl,
                                                uploadUrl,
                                                selectCallback
                                            }) {
    // a component that shows an image gallery, and has an action for clicking on one.
    // can upload

    const [state, dispatch] = useReducer(reducer, {...STATE, selected: selected, error: error});
    const [picsReq, picsReqDispatch] = useReducer(requestReducer, REQUEST_STATE);

    const infoIcon = smallText ? <span className="icon-holder-info" data-tooltip={smallText}>&#xe90c;</span> : '';
    const labelOutput = label ? <label htmlFor={name}>{label}{infoIcon}</label> : '';

    debug("FileSelectComponent: state")
    debug(state)

    useEffect(() => {
        GET(filesUrl, picsReqDispatch);
    }, []);

    useEffect(() => {
        if (!state.selected) dispatch({type: "ERROR", payload: "Please select a profile image."});
    }, [state.selected])

    function deleteFile(file) {
        dispatch({type: "DELETE", payload: file.id});
        GET(filesUrl, picsReqDispatch);
    }

    function handleUpload() {
        GET(filesUrl, picsReqDispatch);
    }

    function selectFile(file) {
        dispatch({type: "SELECT", payload: file});
        selectCallback(file);
    }

    function displayFile(file) {
        const isImage = ["jpg", "jpeg", "png", "svg", "bmp"].includes(file.url.split('.').pop());
        const fileName = file.url.split('/').pop();
        return (<div key={makeId(3)} className="file-container">
            {isImage ? <img src={file.url} key={makeId(3)}/> : fileName}
        </div>)
    }

    if (!state.open) return (
        <div className="image-select">
            {state.selected && !state.error ?
                displayFile(state.selected) :
                <div className="invalid-feedback">{state.error}</div>
            }
            <div className="label-group">
                <label htmlFor={name}>{label}</label>
                <p className="secondary">{smallText}</p>
                <button className="btn primary" onClick={e => dispatch({type: "OPEN"})}>Change Image</button>
            </div>
        </div>
    )

    return (<FileUploadField
        name={name}
        labelText={label}
        uploadUrl={uploadUrl}
        existingFiles={transformObjectToListIfEmpty(picsReq.data)}
        uploadCallback={handleUpload}
        deleteCallback={(file) => deleteFile(file)}
        selectCallback={selectFile}
        error={state.errors}
    />)
}