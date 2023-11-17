FROM python:3.10.0-alpine

WORKDIR /oidc_client/
COPY requirements.txt ./

RUN python3 -m pip install -r requirements.txt
