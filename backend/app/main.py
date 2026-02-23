
from fastapi import FastAPI
from api.v1.api import api_router_v1
from db import base, session
from fastapi.middleware.cors import CORSMiddleware
from models import user
base.Base.metadata.create_all(bind=session.engine)

app = FastAPI(title="CreatorStop")

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router=api_router_v1, prefix="/api/v1",tags=["auth"])
