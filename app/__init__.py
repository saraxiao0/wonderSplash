from flask import Flask

app_var = Flask(__name__)

from app import routes
