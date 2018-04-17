from flask import Flask, render_template, request, redirect, url_for, session, escape
from tinydb import TinyDB
import os.path

app = Flask(__name__, static_url_path='/static')
basedir = os.path.abspath(os.path.dirname(__file__))

app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/987s'

#to run on linux
# activate venv:    source venv/bin/activate
# add program to the environment variable and then run
#  FLASK_APP=host.py flask run
#  FLASK_APP=host.py  FLASK_DEBUG=1 flask run



#To run in windows 10:
# activate venv:    venv/scripts/activate
# set up environment variable:  set FLASK_APP=host.py
# optional debug:               set FLASK_DEBUG=1
# run the application           flask.run


#setup the database connections
dbEvents = TinyDB(os.path.join(basedir,'dbEvents.json'))
EventsTable = dbEvents.table('Events')
dbHighLevelResults = TinyDB(os.path.join(basedir,'HighLevel.json'))
DemographicsTable = dbHighLevelResults.table('Demographics')
SessionSummaryTable = dbHighLevelResults.table('SessionSummary')



@app.route("/", methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        #print('inside post')
        print(request.form)
        DemographicsTable.insert(request.form)
        print("gender " + request.form['gender'])
        print("id " + request.form['id'])
        print("age " + request.form['age'])
        session['id'] = request.form['id']
        return redirect("/")
    else:
        #return "hello world"
        return render_template("index.html")

@app.route("/experiment/<count>")
def experiment(count=None):
    if 'id' in session:
        uid = escape(session['id'])
        # run for 2 minutes
        return render_template("pethospital.html", count=count, id=uid, duration = 60*2)
    return redirect(url_for('index'))


@app.route("/logging", methods = ['POST'])
def logging():
    if request.method == 'POST':
        print('logging request made')
        data = request.form
        EventsTable.insert(data)
        return redirect('/')
        
@app.route('/summary', methods = ['POST'])
def summary():
    print ('Inside /summary')
    if request.method == 'POST':
        print ('Inside /summary - POST')
        content = request.json
        print(type(content))
        SessionSummaryTable.insert(content)
        return ('', 204)

@app.route("/test", methods = ['GET'])
def test():
    if request.method == 'GET':
        return render_template("test.html")


@app.route("/end")
def end():
    session.pop('id', None)
    return redirect(url_for('index'))

