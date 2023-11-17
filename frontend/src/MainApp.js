import ReactDOM from "react-dom";
import {useEffect, useReducer} from "react";
import {Input} from "./reusables/forms/form_elements";
import {REQUEST_STATE, requestReducer} from "./reusables/forms/forms";
import {GET} from "./reusables/requests";
import Alert from "./reusables/Alert";
import JSONPretty from 'react-json-pretty';

var JSONTHEME = require('react-json-pretty/dist/1337');

const SCOPE = "openid trust reviews social_accounts";

const STATE = {
    client_details: {
        provider: PROVIDER,
        client_id: CLIENT_ID,
        response_type: "code",
        scope: SCOPE
        // state: null,
        // nonce: null,
    },
    oidc_config: null,
    authorization_url: null
}

const SET_CLIENT_DETAILS = "set_client_details";
const SET_OIDC_CONFIG = "set_oidc_config";
const AUTHORIZATION_URL = "make_auth_url";

const REDIRECT_URL = encodeURIComponent(REDIRECT_URI);
const REDUCER = (state, action) => {

    switch (action.type) {
        case SET_CLIENT_DETAILS:
            return {
                ...state,
                client_details: {
                    ...state.client_details,
                    [action.payload.name]: action.payload.value
                },
            }
        case SET_OIDC_CONFIG:
            return {
                ...state,
                oidc_config: action.payload
            }
        case AUTHORIZATION_URL:
            const auth_url = state.oidc_config.authorization_endpoint +
                "?client_id=" + state.client_details.client_id +
                "&response_type=" + state.client_details.response_type +
                "&redirect_uri=" + REDIRECT_URL +
                "&scope=" + encodeURIComponent(state.client_details.scope)
            return {
                ...state, authorization_url: auth_url
            }
    }
}

function MainApp() {
    const [state, dispatch] = useReducer(REDUCER, STATE);
    const [configRequest, setConfigRequest] = useReducer(requestReducer, REQUEST_STATE);

    useEffect(() => {
        GET(PROVIDER, setConfigRequest)
    }, [])

    const handleOIDCUrl = (e) => {
        dispatch({
            type: SET_CLIENT_DETAILS,
            payload: {name: e.target.name, value: e.target.value},
        });
    }

    const handleChange = (e) => {
        dispatch({
            type: SET_CLIENT_DETAILS,
            payload: {name: e.target.name, value: e.target.value},
        });
        if (state.oidc_config) {
            dispatch({type: AUTHORIZATION_URL});
        }
    };

    useEffect(() => {
        if (configRequest.success) {
            dispatch({type: SET_OIDC_CONFIG, payload: configRequest.data});
            dispatch({type: AUTHORIZATION_URL});
        }
    }, [configRequest])


    return <div className="card-content">
        <h2>Set up OIDC details</h2>
        <form action="">
            <Input
                name="provider"
                label="Provider URL"
                inputProps={{
                    value: PROVIDER,
                    type: 'text',
                    disabled: true,
                    required: true,
                    placeholder: "ex: http://provider.app/.well-known/openid-configuration",
                    onChange: handleOIDCUrl
                }}
                error={state.errors ? state.errors.provider : false}
            />
            <div className="form-group">
                <label>OIDC Server Configuration</label>
                {state.oidc_config ?
                    <JSONPretty className="json-pretty" data={state.oidc_config} theme={JSONTHEME}></JSONPretty> :
                    <Alert type="info" text="Write Provider URL to the OIDC configuration" hideable={false}/>
                }
            </div>
            <Input
                name="client_id"
                label="Client ID"
                inputProps={{
                    value: state.client_details.client_id,
                    type: 'text',
                    disabled: false,
                    required: true,
                    placeholder: "the Client ID of your registered client",
                    onChange: handleChange
                }}
                error={state.errors ? state.errors.client_id : false}
            />
            <Input
                name="response_type"
                label="Response type"
                inputProps={{
                    value: state.client_details.response_type,
                    type: 'text',
                    disabled: true,
                    required: true,
                    onChange: handleChange
                }}
                error={state.errors ? state.errors.response_type : false}
            />
            <Input
                name="scope"
                label="Scope"
                inputProps={{
                    value: state.client_details.scope,
                    type: 'text',
                    disabled: false,
                    required: true,
                    placeholder: "ex: openid trust reviews",
                    onChange: handleChange
                }}
                error={state.errors ? state.errors.scope : false}
            />

            <div className="form-group">
                <label>Authorization URL</label>
                {state.authorization_url ?
                    // <span className="url">{state.authorization_url}</span> :
                    <JSONPretty className="json-pretty" data={state.authorization_url} theme={JSONTHEME}></JSONPretty> :
                    <Alert type="info" text="Write Provider URL to the OIDC configuration" hideable={false}/>
                }
            </div>
            <div className="buttons-container">
                <button type="submit" className="btn" onClick={e => {
                    e.preventDefault();
                    window.location = state.authorization_url;
                }}>Authorize
                </button>
            </div>
        </form>
    </div>
}

ReactDOM.render(<MainApp/>, document.getElementById('main-app'));
