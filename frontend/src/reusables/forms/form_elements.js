import React, {useState, useEffect, Fragment} from 'react';
import Select from 'react-select';
import Creatable, {makeCreatableSelect} from 'react-select/creatable';
import Waiting from "../Waiting";
import {makeId} from "../utils";

const InfoHint = ({text}) => text ? <span className="icon-holder-info" data-tooltip={text}>&#xe90c;</span> : ''

export const ConfirmComponent = ({buttonText, questionText, handleConfirm}) => {
    const [ask, setAsk] = useState(false);

    if (ask) return (
        <div>{questionText}
            <a className="btn btn-link" onClick={e => {
                e.preventDefault();
                handleConfirm();
            }}>yes</a>
            <a className="btn btn-link" onClick={e => {
                e.preventDefault();
                setAsk(false);
            }}>cancel</a>
        </div>
    )
    return (
        <a className="btn btn-link" onClick={e => {
            e.preventDefault();
            setAsk(true);
        }}>{buttonText}</a>
    )
}

function handleInputClass(error) {
    if (error) {
        return "form-control is-invalid";
    } else if (error === 'valid') {
        return "form-control is-valid";
    } else {
        return "form-control";
    }
}

function handleSelectClass(error) {
    if (error) {
        return "form-control_invalid";
    } else if (error === 'valid') {
        return "form-control_valid";
    } else {
        return "form-control";
    }
}

export const Input = ({name, label, inputProps, smallText, error}) => {
    const labelOutput = label ? <label htmlFor={name}>{label}<InfoHint text={smallText}/></label> : '';
    return (
        <div className="form-group">
            {labelOutput}
            <input {...inputProps} id={name} name={name} aria-describedby={name + 'help'}
                   className={handleInputClass(error)}/>
            {error
                ? (<div className="invalid-feedback">{error}</div>)
                : ''
            }
        </div>
    )
}

export const CustomURLInput = ({rootUrl, locked, name, label, inputProps, smallText, error}) => {
    const labelOutput = label ? <label htmlFor={name}>{label}<InfoHint text={smallText}/></label> : '';
    return (
        <div className="form-group">
            {labelOutput}
            <div className="url-input-container">
                {locked ?
                    <div className="url-input">
                        {rootUrl}{inputProps.value}
                    </div> :
                    <div className="url-input">
                        {rootUrl}<input {...inputProps} id={name} name={name} aria-describedby={name + 'help'}
                                        className={handleInputClass(error)}/>
                    </div>
                }
            </div>
            {error
                ? (<div className="invalid-feedback">{error}</div>)
                : ''
            }
        </div>
    )
}

export const Textarea = ({name, label, inputProps, smallText, error}) => {
    const labelOutput = label ? <label htmlFor={name}>{label}<InfoHint text={smallText}/></label> : '';
    return (
        <div className="form-group">
            {labelOutput}
            <textarea id={name} name={name} cols="30" rows="5"
                      aria-describedby={name + 'help'}
                      className={handleInputClass(error)}
                      {...inputProps}
            />
            {error
                ? (<div className="invalid-feedback">{error}</div>)
                : ''
            }
        </div>
    )
}

export const Checkbox = ({name, label, inputProps, smallText, error}) => {
    const labelOutput = label ? <label htmlFor={name}>{label}<InfoHint text={smallText}/></label> : '';
    return (
        <div className="form-group-checkbox">
            <div className="checkbox-input">
                <input type="checkbox" id={name} name={name}
                       className={error ? 'invalid' : ''} {...inputProps}
                />
                <label htmlFor={name}>{label}</label>
                {hasInfoIcon}
            </div>
            {error
                ? (<div className="invalid-feedback">{error}</div>)
                : ''
            }
        </div>
    )
}

export const SelectVanilla = ({name, label, inputProps, smallText, error, Options}) => {
    return (
        <div className="form-group">
            {label
                ? (<label htmlFor={name}>{label}</label>)
                : ''
            }
            <select id={name} name={name}
                    aria-describedby={name + 'help'}
                    className={handleInputClass(error)}
                    {...inputProps}
            >
                {Options}
            </select>

            {smallText
                ? <small id={name + 'help'} className="form-text text-muted">{smallText}</small>
                : ''
            }
            {error
                ? (<div className="invalid-feedback">{error}</div>)
                : ''
            }
        </div>
    )
}

export const SelectReact = ({
                                name,
                                label,
                                smallText,
                                smallTextUnder,
                                error,
                                options,
                                value,
                                onChange,
                                props,
                                isLoading,
                                isDisabled
                            }) => {
    const labelOutput = label ? <label htmlFor={name}>{label}<InfoHint text={smallText}/></label> : '';
    return (
        <div className="form-group">
            {labelOutput}
            <Select isLoading={isLoading} isDisabled={isDisabled} options={options} value={value}
                    className="react-select" classNamePrefix={handleSelectClass(error)}
                    onChange={onChange} {...props}
            />
            {smallTextUnder ? smallTextUnder : ''}
            {error
                ? (<div className="invalid-feedback">{error}</div>)
                : ''
            }
        </div>
    )
}

export const SelectReactCreatable = ({
                                         name,
                                         label,
                                         smallText,
                                         error,
                                         options,
                                         value,
                                         onChange,
                                         props,
                                         isLoading,
                                         isDisabled
                                     }) => {
    const labelOutput = label ? <label htmlFor={name}>{label}<InfoHint text={smallText}/></label> : '';
    return (<div className="form-group">
        {labelOutput}
        <Creatable isLoading={isLoading} isDisabled={isDisabled} options={options} value={value}
                   className="react-select" classNamePrefix={handleSelectClass(error)}
                   onChange={onChange} {...props} />
        {error
            ? (<div className="invalid-feedback">{error}</div>)
            : ''
        }
    </div>)
}