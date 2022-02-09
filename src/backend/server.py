# DO NOT DELETE THIS FILE!

# This is the master file which will be called by uvicorn manager.
# It has the topmost directory structure, so it can call all lower subdirectory scripts and functions
from typing import Optional, List, Dict
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from functions import _get_infections, _get_culprits, _get_antibiotics

app = FastAPI()

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/help")
def get_help():
    return "Help on the way! Nothing written so far though. :("



# Below is a sample endpoint for classification
# Note: There can be any number of endpoints available, with any HTTP request type (GET, POST, PUT, DELETE)

# Let's suppose we are creating a text classification model, with string as input and list of strings as output
# It is wise to create request and response models in advance.
# typing library helps with creating typing hints with NO code functionality alterations
class Request(BaseModel):
    query: str
class Response(BaseModel):
    data: List[str] # Is this okay?

class CulpritsRequest(BaseModel):
    query: str
class CulpritsResponse(BaseModel):
    culprits: Dict[str, int]

@app.get("/list_infections", response_model=Response)
def get_infections():
    return Response(data=_get_infections())

@app.get("/list_antibiotics", response_model=Response)
def get_infections():
    return Response(data=_get_antibiotics())

@app.post("/get_culprits", response_model=CulpritsResponse)
def get_culprits(request: CulpritsRequest):
    try:
        culprits = _get_culprits(request.query)
    except IndexError:
        raise HTTPException(status_code=404, detail="Searchable item not found within the collection. \
            Check to see if the variables passed are correct. The parameter 'query' passed should equal \
            to one of the names returned from /list_infections endpoint.")
    return CulpritsResponse(culprits=culprits)

@app.post("/classify", response_model=Response)
def classify(request: Request):
    query = request.query

    # Perform logic on the string within the function.
    labels = [query] * 5 # Spam output for example

    # Output the response as specified in the response model
    return Response(labels=labels)