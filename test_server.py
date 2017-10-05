portNumber = 5000
debug = True
myHost = '0.0.0.0'

from flask import Flask, render_template
app = Flask(__name__)


@app.route('/')
def index():
    return('hello')

@app.route('/a')
def indextoo():
    return(render_template('pets_test.html'))
    #return('foo');