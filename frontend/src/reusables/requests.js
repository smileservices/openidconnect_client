import {debug} from "./utils";

function prepareResponse(res) {
    if (res.ok) {
        return res.json();
    } else {
        const error = new Error(res.statusText);
        error.response = res;
        throw error;
    }
}

function handleFetchError(dispatchRequest, dispatchData = null) {
    return (error) => {

        debug("GET: error", 100);
        debug(error, 100);

        const isJson = error.response.headers.get('content-type')?.includes('application/json');
        if (isJson) {
            error.response.json().then(data => dispatchRequest({
                type: "ERROR",
                payload: error.message + ': ' + data.detail
            }));
        } else {
            dispatchRequest({
                type: "ERROR",
                payload: error.message + ': ' + error.response.statusText
            })
        }

        dispatchData ? dispatchData({type: "FORM_ERROR", payload: error}) : "";
    }
}

export function DummyPost(URL, data, dispatchRequest, dispatchData, successCallback) {
    // this is a function to be implemented and that would handle all parts of the post request
    // the signature should be the same for the standard forms and data
    dispatchRequest({type: "START"});
    setTimeout(() => {
        alert("Post happened, check out the console");
        console.log("form data posted to", URL, data);
        if (data.submit_error) {
            console.error("submit error!")
            dispatchRequest({type: "ERROR", payload: "Oh no, post error"});
            dispatchData({type: "FORM_ERROR", payload: {submit_error: "Just uncheck this"}});
        } else {
            console.info("submit success!")
            successCallback();
        }
    }, 2000);
}

export function GET(url, dispatchRequest, headers = {}) {
    dispatchRequest({type: "START"});
    fetch(url, {credentials: "include", headers: headers}).then(prepareResponse).then(
        data => {
            // console.log("GET: success");
            // console.log("GET", data);
            dispatchRequest({type: "SUCCESS", payload: data});
        }
    ).catch(handleFetchError(dispatchRequest));
}

export function POST(url, data, dispatchRequest, dispatchData = null, successCallback = null) {
    // this is a function to be implemented and that would handle all parts of the post request
    // the signature should be the same for the standard forms and data
    dispatchRequest({type: "START"});
    fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {"Content-Type": "application/json"},
        credentials: "include"
    }).then(prepareResponse).then(
        data => {
            debug("POST DATA SUCCESS:");
            debug(data);
            dispatchRequest({type: "SUCCESS", payload: data});
            successCallback ? successCallback(data) : "";
        }
    ).catch(handleFetchError(dispatchRequest, dispatchData))
}

export function PATCH(url, data, dispatchRequest, dispatchData, successCallback) {
    // this is a function to be implemented and that would handle all parts of the post request
    // the signature should be the same for the standard forms and data
    dispatchRequest({type: "START"});
    fetch(url, {
        method: "PATCH",
        body: JSON.stringify(data),
        credentials: "include",
        headers: {"Content-Type": "application/json"}
    }).then(prepareResponse).then(
        data => {
            debug("PATCH DATA SUCCESS:",);
            dispatchRequest({type: "SUCCESS", payload: data});
            successCallback(data);
        }
    ).catch(handleFetchError(dispatchRequest, dispatchData))
}

export function DELETE(url, dispatchRequest, successCallback) {
    // this is a function to be implemented and that would handle all parts of the post request
    // the signature should be the same for the standard forms and data
    dispatchRequest({type: "START"});
    fetch(url, {
        credentials: "include",
        method: "DELETE",
    }).then(prepareResponse).then(
        data => {
            dispatchRequest({type: "SUCCESS"});
            successCallback(data);
        }
    ).catch(handleFetchError(dispatchRequest))
}

export function UPLOAD(url, files, dispatchRequest, successCallback) {
    dispatchRequest({type: "START"});

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
        debug(`File ${i} size: ${files[i].size}`, 5);  // Debug the file size
    }

    fetch(url, {
        method: "POST",
        credentials: "include",
        body: formData, // send the FormData object
        // no need to explicitly set the "Content-Type" to "multipart/form-data"
        // fetch() will automatically set it and include the correct boundary
    }).then(prepareResponse).then(
        data => {
            debug("UPLOAD SUCCESS:");
            dispatchRequest({type: "SUCCESS"});
            successCallback(data);
        }
    ).catch(handleFetchError(dispatchRequest))
}
