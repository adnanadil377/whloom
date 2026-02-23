from fastapi import APIRouter

from api.v1.enpoints import auth

api_router_v1 = APIRouter()

# Combine all the routers here
api_router_v1.include_router(auth.router, prefix="/auth", tags=["auth"])