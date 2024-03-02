from flask import Flask
from config import Config

app_var = Flask(__name__)
app_var.config.from_object(Config)

from app import routes
