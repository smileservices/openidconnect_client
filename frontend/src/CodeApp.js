import ReactDOM from "react-dom";
import {Fragment, useEffect, useReducer} from "react";
import {Input} from "./reusables/forms/form_elements";
import {REQUEST_STATE, requestReducer} from "./reusables/forms/forms";
import {GET, POST} from "./reusables/requests";
import Alert from "./reusables/Alert";
import JSONPretty from 'react-json-pretty';
import {getParameterByName} from "./reusables/utils";
import {KJUR} from 'jsrsasign';

var JSONTHEME = require('react-json-pretty/dist/1337');

const SCOPE = "openid trust reviews social_accounts";


const APP_STATE = {
    client_details: {
        provider: PROVIDER,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "code",
        scope: SCOPE,
        auth_code: getParameterByName("code"),
        // state: null,
        // nonce: null,
    },
    token_response: null,
    oidc_config: null,
    authorization_url: null
}

const SET_OIDC_CONFIG = "set_oidc_config";
const SET_DATA = "set_data";

const REDIRECT_URL = encodeURIComponent("http://localhost:8081/auth/oidc");
const REDUCER = (state, action) => {

    switch (action.type) {
        case SET_OIDC_CONFIG:
            return {
                ...state,
                oidc_config: action.payload
            }
        case SET_DATA:
            return {
                ...state,
                data: {...state.data, [action.payload.name]: action.payload.value}
            }
    }
}

function CodeApp() {
    const [state, dispatch] = useReducer(REDUCER, APP_STATE);
    const [configRequest, setConfigRequest] = useReducer(requestReducer, REQUEST_STATE);
    const [userDataReq, setUserDataReq] = useReducer(requestReducer, REQUEST_STATE);
    const [reviewsReq, setReviewsReq] = useReducer(requestReducer, REQUEST_STATE);
    const [trustReq, setTrustReq] = useReducer(requestReducer, REQUEST_STATE);
    const [socialsReq, setSocialsReq] = useReducer(requestReducer, REQUEST_STATE);

    // console.log(TOKEN_RESPONSE.id_token);
    const decoded_id_token = KJUR.jws.JWS.parse(TOKEN_RESPONSE.id_token);
    const decoded_access_token = KJUR.jws.JWS.parse(TOKEN_RESPONSE.access_token);

    // console.log(decoded_id_token);

    useEffect(() => {
        GET(PROVIDER, setConfigRequest)
    }, [])

    useEffect(() => {
        if (configRequest.success) {
            dispatch({type: SET_OIDC_CONFIG, payload: configRequest.data});
        }
    }, [configRequest])

    const reqHeaders = {"Authorization": "Bearer " + TOKEN_RESPONSE.access_token};


    return <Fragment>
        <div className="card">
            <div className="card-content">
                <h2>The Token Endpoint</h2>
                <p>OpenId Connect about docs about <a
                    href="https://openid.net/specs/openid-connect-core-1_0.html#TokenRequest">getting
                    the access token</a></p>
                <div className="explain">
                    <h3>Getting the token</h3>
                    <p>The <strong>redirect_uri</strong> endpoint in the client backend takes
                        the <strong>code</strong> and
                        builds the request for the token endpoint:</p>
                    <JSONPretty className="json-pretty" data={{
                        "grant_type": "code",
                        "client_id": CLIENT_ID,
                        "client_secret": CLIENT_SECRET,
                        "redirect_uri": REDIRECT_URL,
                        "code": CODE,
                        "state": STATE
                    }} theme={JSONTHEME}></JSONPretty>
                    <p>The OIDC server checks the request params and responds:</p>
                    <JSONPretty className="json-pretty" data={TOKEN_RESPONSE} theme={JSONTHEME}></JSONPretty>
                </div>
                <div className="explain">
                    <h3>The token response</h3>
                    <p>The <a href="https://openid.net/specs/openid-connect-core-1_0.html#TokenResponse">response from
                        the
                        token
                        endpoint</a> has a signed JWT as ID token and a separate signed JWT as access token</p>
                    <p>The ID Token:</p>
                    <JSONPretty className="json-pretty" data={decoded_id_token} theme={JSONTHEME}></JSONPretty>
                    <p>The Access Token:</p>
                    <JSONPretty className="json-pretty" data={decoded_access_token} theme={JSONTHEME}></JSONPretty>
                </div>
                <div className="explain">
                    <h3>Veryfing the JWT signatures</h3>
                    <p>The OIDC standard specifies explicitly that <a
                        href="https://openid.net/specs/openid-connect-core-1_0.html#CodeIDToken">the client must verify
                        the
                        authenticity of the ID token signature</a>. This is in order to avoid man-in-the-middle attack.
                    </p>
                </div>
            </div>
        </div>
        {state.oidc_config ?
        <div className="card">
            <div className="card-content">
                <h2>Using the access account</h2>
                <p>The access token can be used for accessing the scoped endpoints:</p>
                <p>The endpoints url are all available in the oidc configuration response.</p>
                <JSONPretty className="json-pretty" data={{
                    userdata: "details about the user (persona)",
                    social_accounts: "the user's linked social accounts (persona)",
                    reviews: "the user's reviews (persona)",
                    trust: "the user's trust score (account)",
                }} theme={JSONTHEME}></JSONPretty>
                <div className="explain">
                    <h3>Setting up the requests header</h3>
                    <p>We can see in the token response that the access token is of Bearer type, which means that we
                        will use it inside an Authentication header.</p>
                </div>
                {userDataReq.data ?
                    <div className="explain">
                        <h3>Userdata</h3>
                        <JSONPretty className="json-pretty" data={userDataReq.data} theme={JSONTHEME}></JSONPretty>
                    </div> :
                    <div className="explain">
                        <button className="btn btn-secondary" onClick={() =>
                            GET(state.oidc_config.userinfo_endpoint, setUserDataReq, reqHeaders)
                        }>GET {state.oidc_config.userinfo_endpoint}</button>
                    </div>
                }
                <h3>Trustnet only endpoints</h3>
                {socialsReq.data ?
                    <div className="explain">
                        <h3>User Linked Social Accounts</h3>
                        <JSONPretty className="json-pretty" data={socialsReq.data} theme={JSONTHEME}></JSONPretty>
                    </div> :
                    <div className="explain">
                        <button className="btn btn-secondary" onClick={() =>
                            GET(state.oidc_config.user_socials_endpoint, setSocialsReq, reqHeaders)
                        }>GET {state.oidc_config.user_socials_endpoint}</button>
                    </div>
                }
                {reviewsReq.data ?
                    <div className="explain">
                        <h3>User Linked Reviews</h3>
                        <JSONPretty className="json-pretty" data={reviewsReq.data} theme={JSONTHEME}></JSONPretty>
                    </div> :
                    <div className="explain">
                        <button className="btn btn-secondary" onClick={() =>
                            GET(state.oidc_config.user_reviews_endpoint, setReviewsReq, reqHeaders)
                        }>GET {state.oidc_config.user_reviews_endpoint}</button>
                    </div>
                }
                {trustReq.data ?
                    <div className="explain">
                        <h3>User Trust Rating</h3>
                        <JSONPretty className="json-pretty" data={trustReq.data} theme={JSONTHEME}></JSONPretty>
                    </div> :
                    <div className="explain">
                        <button className="btn btn-secondary" onClick={() =>
                            GET(state.oidc_config.user_trust_endpoint, setTrustReq, reqHeaders)
                        }>GET {state.oidc_config.user_trust_endpoint}</button>
                    </div>
                }
            </div>
        </div> : ""}
    </Fragment>
}

ReactDOM.render(<CodeApp/>, document.getElementById('main-app'));
