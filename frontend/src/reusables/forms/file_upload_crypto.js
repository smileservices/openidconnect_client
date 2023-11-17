import {useReducer, useState} from "react";
import {useDropzone} from "react-dropzone";
import {makeId} from "../utils";
import Waiting from "../Waiting";
import {REQUEST_STATE, requestReducer} from "./forms";
import {DELETE, UPLOAD} from "../requests";
import {debug} from "../utils";

/*
* FILE UPLOAD FIELD
*
* Standalone form field that handles uploading files
*
* Actions:
* It receives existing files and handles delete on them, then triggers callback
* It handles upload of new files and triggers callback when it's uploaded
*
* GUI Interface:
* - upload area where user drag/drop files
* - files list with handles that trigger delete
*
* */


export function FileUploadEncryptedField(
    {
        name, //str name of the formfield (must match the form state field)
        uploadUrl, //str the url where the upload will be made
        labelText, //str label of the formfield
        uploadCallback,
        deleteCallback,
        existingFiles,
        error, //str error text
        selectCallback=(f)=>{}
    }
) {
    const [request, dispatchRequest] = useReducer(requestReducer, REQUEST_STATE);
    const [deleteReq, dispatchDeleteReq] = useReducer(requestReducer, REQUEST_STATE);
    const [files, setFiles] = useState([]);

    const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
        accept: {},
        onDropAccepted: (acceptedFiles, e) => {
            console.log("accepted file", acceptedFiles);
            setFiles(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
        }
    });

    const displayFileThumb = file => {
        let fileUrl = "";
        let fileName = "";
        debug("displayFileThumb");
        debug(file);
        if (file.id) {
            // file is saved and has path
            fileUrl = file.url;
            fileName = fileUrl.split("/").pop();
        } else {
            // file is selected for upload
            fileName = file.name;
            fileUrl = file.preview;
        }
        const fileType = fileName.split(".").pop();
        if (["jpg", "jpeg", "png", "svg", "bmp"].includes(fileType)) {
            return (<img onClick={e=>selectCallback(file)} src={fileUrl} key={makeId(3)}/>);
        }
        return <span onClick={e=>selectCallback(file)}>fileName</span>;
    }


    function uploadAction(e) {
        e.preventDefault();
        UPLOAD(
            uploadUrl,
            files,
            dispatchRequest,
            (files) => {
                uploadCallback(files);
                setFiles([]);
            }
        );
    }


    function deleteAction(file) {
        DELETE(
            '/file?id=' + file.id,
            dispatchDeleteReq,
            () => {
                deleteCallback(file);
            }
        )
    }

    function existingFile(file) {
        return (
            <div key={makeId(3)} className="file-container">
                <div className="toolbar">
                    <a className="delete" onClick={() => deleteAction(file)}><span
                        className="icon-cancel"></span></a>
                </div>
                {displayFileThumb(file)}
            </div>
        )
    }

    function loadedFile(file) {
        return (
            <div key={makeId(3)} className="file-container">
                {displayFileThumb(file)}
            </div>
        )
    }


    return (
        <div className="form-group image-upload">
            <label htmlFor={name}>{labelText}</label>

            <div className="dropzone-input">
                <div className="thumbs-container">
                    {existingFiles.length === 0 ?
                        "Nothing uploaded" :
                        existingFiles.map(i => existingFile(i))
                    }
                </div>

                <div className="upload-area">
                    {request.waiting ? <div className="overlay-waiting"><Waiting text="Uploading"/></div> : ""}
                    {deleteReq.waiting ? <div className="overlay-waiting"><Waiting text="Deleting"/></div> : ""}

                    <div {...getRootProps({className: 'dropzone'})} id={name}>
                        <input {...getInputProps()} />
                        <p>Drag 'n' drop some files here, or click to select files</p>
                        {files.length === 0 ?
                            <p>Nothing selected for upload.</p> :
                            <p>{files.length} files selected for upload. Press Upload button.</p>
                        }
                    </div>

                    <div className="thumbs-container">
                        {files.length > 0 ? files.map(f => loadedFile(f)) : ""}
                    </div>
                    {files.length > 0 ?
                        <div className="buttons-container">
                            <button className="btn secondary" onClick={() => setFiles([])}>Reset</button>
                            <button className="btn secondary" onClick={uploadAction}>Upload</button>
                        </div>
                        : ""}
                </div>
                {error ? (<div className="invalid-feedback">{error}</div>) : ''}
            </div>
        </div>
    );
}