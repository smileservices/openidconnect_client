from fastapi import FastAPI, Depends
from fastapi.security import OpenIdConnect
from fastapi.templating import Jinja2Templates

from fastapi.requests import Request
from starlette.config import Config
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi import HTTPException
import requests
import json
from typing import Annotated

from dotenv import dotenv_values

# TRUSTNET_OIDC_CONFIG = "http://localhost:8080/.well-known/openid-configuration"
# TRUSTNET_CLIENT_ID = "n2bw8ox5gv6efpp4qx2-uq3wiys25i5p"
# TRUSTNET_CLIENT_SECRET = "uwje-h75ps6f9nem57mm77pojsz@04co"
#
# TRUSTNET_AUTHORIZE_ENDPOINT = "http://localhost:8080/authorize"
# TRUSTNET_ACCESS_TOKEN_ENDPOINT = "http://localhost:8080/token"
# TRUSTNET_PROFILE_ENDPOINT = "http://localhost:8088/user"
# TRUSTNET_PROFILE_ENDPOINT = "http://localhost:8088/user"
# redirect_url = "http://localhost:8081/auth/oidc"

app = FastAPI()
templates = Jinja2Templates(directory="frontend/html")
config = dotenv_values(".env")


@app.get("/")
async def setup(request: Request):
    provider_req = requests.get(config.get("provider"))
    return templates.TemplateResponse(
        "main.html",
        {**config, "provider_config": provider_req.json(), "request": request}
    )


@app.get("/auth/oidc")
async def handle_code(
        request: Request,
        code: str,
        state: None | str = None
):
    data = {
        "grant_type": "code",
        "client_id": config.get('client_id'),
        "client_secret": config.get('client_secret'),
        "redirect_uri": config.get('redirect_uri'),
        "code": code,
        "state": state if state else None
    }
    headers = {"Accept": "application/json"}
    provider_config = requests.get(config.get("provider")).json()
    response = requests.post(provider_config["token_endpoint"], json=data, headers=headers)
    response_data = response.json()
    if response.status_code != 200:
        return templates.TemplateResponse(
            "error.html",
            {
                **config,
                "provider_config": provider_config,
                "request": request, "error": response_data["detail"]
            }
        )
    auth_header = f'{response_data["token_type"]} {response_data["access_token"]}'
    response_userdata = requests.get(provider_config["userinfo_endpoint"],
                                     headers={"authorization": auth_header}).json()
    response_user_socials = requests.get(provider_config["user_socials_endpoint"],
                                         headers={"authorization": auth_header}).json()
    response_user_reviews = requests.get(provider_config["user_reviews_endpoint"],
                                         headers={"authorization": auth_header}).json()
    response_user_trust = requests.get(provider_config["user_trust_endpoint"],
                                       headers={"authorization": auth_header}).json()
    return templates.TemplateResponse(
        "token_response.html",
        {
            **config,
            "provider_config": provider_config,
            "request": request,
            "token_response": response,
            "userdata_response": response_userdata,
            "user_socials_response": response_user_socials,
            "user_reviews_response": response_user_reviews,
            "user_trust_response": response_user_trust,
            "code": code,
            "state": state
        }
    )
