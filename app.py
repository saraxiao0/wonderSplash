from flask import Flask, render_template

app_var = Flask(__name__)

@app_var.route('/', methods=['GET', 'POST'])
@app_var.route('/index', methods=['GET', 'POST'])
@app_var.route('/index.html', methods=['GET', 'POST'])
def index():
    return render_template('index.html')

@app_var.errorhandler(404)
def not_found_error(error):
    return render_template('404.html'), 404