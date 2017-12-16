from flask import Flask, render_template, request, redirect, url_for
from tinydb import TinyDB
import os.path

app = Flask(__name__, static_url_path='/static')
basedir = os.path.abspath(os.path.dirname(__file__))

#to run on linux
# activate venv:    source venv/bin/activate
# add program to the environment variable and then run
#  FLASK_APP=host.py flask run
#
#To run in windows 10:
# activate venv:    venv/scripts/activate
# set up environment variable:  set FLASK_APP=host.py
# optional debug:               set FLASK_DEBUG=1
# run the application           flask.run


#setup the database connections
dbEvents = TinyDB(os.path.join(basedir,'dbEvents.json'))
EventsTable = dbEvents.table('Events')




@app.route("/", methods=['GET', 'POST'])
def hello():
    if request.method == 'POST':
        print('inside post')
        #print(request.form.RegisterUser)
        return redirect(url_for('experiment'))
    else:
        #return "hello world"
        return render_template("index.html")

@app.route("/experiment", methods=['GET', 'POST'])
def experiment():
    if request.method == 'POST':
        print('inside post')
        #do some post action.... save the logs to the database and continue with experiment flow
        print(request.form['logs'])
        return redirect('/')

    else:
        print('inside else')
        return render_template("pethospital.html")


@app.route("/logging", methods = ['POST'])
def logging():
    if request.method == 'POST':
        print('logging request made')
        data = request.form
        EventsTable.insert(data)
        #print(data)
        return redirect('/')
        


@app.route("/test", methods = ['GET'])
def test():
    if request.method == 'GET':
        return render_template("test.html")