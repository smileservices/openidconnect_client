from fastapi import FastAPI, Depends
from fastapi.security import OpenIdConnect
from fastapi.templating import Jinja2Templates

from fastapi.requests import Request
from starlette.config import Config
from fastapi.responses import HTMLResponse, RedirectResponse
import requests
import json
from typing import Annotated

from dotenv import dotenv_values

# TRUSTNET_OIDC_CONFIG = "http://localhost:8080/.well-known/openid-configuration"
# TRUSTNET_CLIENT_ID = "n2bw8ox5gv6efpp4qx2-uq3wiys25i5p"
# TRUSTNET_CLIENT_SECRET = "uwje-h75ps6f9nem57mm77pojsz@04co"
#
# TRUSTNET_AUTHORIZE_ENDPOINT = "http://localhost:8080/authorize"
TRUSTNET_ACCESS_TOKEN_ENDPOINT = "http://localhost:8080/token"
# TRUSTNET_PROFILE_ENDPOINT = "http://localhost:8088/user"
# TRUSTNET_PROFILE_ENDPOINT = "http://localhost:8088/user"
# redirect_url = "http://localhost:8081/auth/oidc"

app = FastAPI()
templates = Jinja2Templates(directory="frontend/html")
config = dotenv_values(".env")


@app.get("/")
async def setup(request: Request):
    return templates.TemplateResponse(
        "main.html",
        {**config, "request": request}
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
    response = requests.post(TRUSTNET_ACCESS_TOKEN_ENDPOINT, json=data, headers=headers)
    return templates.TemplateResponse(
        "token_response.html",
        {**config, "request": request, "token_response": json.dumps(response.json()), "code": code, "state": state}
    )
