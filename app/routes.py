# from flask import render_template, flash, redirect, url_for, request
from flask import render_template
from app import app_var

import sys

@app_var.route('/', methods=['GET', 'POST'])
@app_var.route('/index', methods=['GET', 'POST'])
@app_var.route('/index.html', methods=['GET', 'POST'])
def index():
    return render_template('index.html')

@app_var.errorhandler(404)
def not_found_error(error):
    return render_template('404.html'), 404
