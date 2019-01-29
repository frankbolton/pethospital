from flask import Flask, render_template, request, redirect, url_for, session, escape, jsonify
from tinydb import TinyDB
import json
import os.path
nl = True

if (nl):
    import NeurosteerLogin as nlf

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
# run the application           flask run


#setup the database connections
dbEvents = TinyDB(os.path.join(basedir,'dbEvents.json'))
EventsTable = dbEvents.table('Events')

dbPeridic = TinyDB(os.path.join(basedir,'dbPeriodic.json'))
PeriodicEventsTable = dbPeridic.table('Periodic')

dbHighLevelResults = TinyDB(os.path.join(basedir,'dbHighLevel.json'))
DemographicsTable = dbHighLevelResults.table('Demographics')
SessionSummaryTable = dbHighLevelResults.table('SessionSummary')
PostExperimentSurveyTable = dbHighLevelResults.table('PostExperiment')

dbTLX = TinyDB(os.path.join(basedir,'dbTLX.json'))
TLXTable = dbTLX.table('TLXQuestions')

creds =''
bluetooth =''
if (nl):
    [creds, bluetooth] = nlf.login()

@app.route("/", methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        #print('inside post')
        print(request.form)
        DemographicsTable.insert(request.form)
        print("gender " + request.form['gender'])
        print("id " + request.form['id'])
        print("age " + request.form['age'])
        session['show_eeg'] = request.form['show_eeg']
        print("show_eeg " + session['show_eeg'])
        session['id'] = request.form['id']
        return redirect("/")
    else:
        #return "hello world"
        if(session.get('id')):
            return render_template("index.html", id=session['id'])
        else:
        #have an issue with the feedback of the user ID.
            return render_template("index.html")

@app.route("/postQuestions", methods=['GET', 'POST'])
def postQuestions():
    if request.method == 'POST':
        PostExperimentSurveyTable.insert(request.form)
        return redirect("/")
    else:
        return render_template("postExperimentQuestions.html", id=session['id'])
        
@app.route("/experiment/<count>")
def experiment(count=None):
    if 'id' in session:
        uid = escape(session['id'])
        # run for 2 minutes
        text = "Start" + count + " "+session['id']
        session['count'] = count

        if (nl):
            nlf.logEvent(creds, bluetooth, text)
        return render_template("pethospital.html", count=count, id=uid,  creds=creds, bluetooth=bluetooth, show_eeg=session['show_eeg'])
    return redirect(url_for('index'))


@app.route("/TLXquestions", methods=['GET', 'POST'])
def TLXquestions():
    if request.method == 'POST':
        print("in tlx questions POST")
        JSON_sent = request.get_json()
        JSON_sent['id']=session['id']
        JSON_sent['count']=session['count']
        TLXTable.insert(JSON_sent)
        #if (a.get("Mental Demand")!=0):
        #    FeedbackTable.insert({'id':session['id'],  \
            # 'turkNickName':session['turkNickName'], \
            #'stageNumber':session['stageNumber'], 'score':session['score'], \
        #    'Temporal Demand':a.get('Temporal Demand'), 'Performance':a.get('Performance'), \
        #    'Effort':a.get('Effort'), 'Frustration':a.get('Frustration'),\
        #    'Physical Demand':a.get('Physical Demand'), 'Mental Demand':a.get('Mental Demand'),\
            #'TLXStartTime':session['TLXStartTime'], 'TLXEndTime':time.asctime(),\
            #'stationSetup':session['stationSetup'], 'stationCount':session['stationCount'], \
            #'SessionStartTime':session['SessionStartTime'], 'gameDuration':exptime*60 \
        #    })
        #return jsonify(JSON_sent)
        return redirect('/')
    else:
        return render_template("after_tlx.html")


@app.route("/logging", methods = ['POST'])
def logging():
    if request.method == 'POST':
        print('logging request made')
        text = "End "+session['id']
        if (nl):
            nlf.logEvent(creds, bluetooth, text)
        content = request.get_json()
        data = content['data']
        for s in data:
            EventsTable.insert(s)
        return redirect('/')

@app.route("/logPeriodic", methods = ['POST'])
def loggingPeriodic():
    if request.method == 'POST':
        print('Peridoc request made')
        text = "End "+session['id']
        content = request.get_json()
        data = content['data']
        for s in data:
            PeriodicEventsTable.insert(s)
        return ""


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

@app.route("/message")
def message():
    return render_template('messageView.html')

@app.route("/ns_logger", methods = ['POST'])
def logger():
    print(request.form['msg'])
    if (nl):
            nlf.logEvent(creds, bluetooth, request.form['msg'])
    return('',204)


@app.route('/ajax-route', methods=['POST'])
def ajax_route():
    try:
        JSON_sent = request.get_json()
        print(JSON_sent)
        # handle your JSON_sent here
        # Pass JSON_received to the frontend
        JSON_received = JSON_sent
        return jsonify(JSON_received)
    except Exception as e:
        print("AJAX excepted " + str(e))
        return str(e)

@app.route('/accessResults')
def accessResults():
    return render_template('resultsLinks.html')

@app.route('/readEventsLog')
def readEventsLog():
    return json.dumps(EventsTable.all())

@app.route('/readPeriodicLog')
def readPeriodicLog():
    return json.dumps(PeriodicEventsTable.all())

@app.route('/readDemographics')
def readDemographics():
    return json.dumps(DemographicsTable.all())


@app.route('/readSessionSummary')
def readSessionSummary():
    return json.dumps(SessionSummaryTable.all())

@app.route('/readTLXResponses')
def readTLXResponses():
    return json.dumps(TLXTable.all())

@app.route('/readPostQuestions')
def readPostQuestions():
    return json.dumps(PostExperimentSurveyTable.all())
