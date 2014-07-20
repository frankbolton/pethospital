#!venv/bin/python

from flask import Flask, request, render_template, redirect, jsonify
#from flask.ext.sqlalchemy import SQLAlchemy
import os.path
basedir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__)

#app.config['SQLALCHEMY_DATABASE_URI'] =\
'sqlite:///' + os.path.join(basedir, 'data.sqlite')
#app.config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] = True
#db = SQLAlchemy(app)

from tinydb import TinyDB, where
dbUsers = TinyDB(os.path.join(basedir,'dbUsers.json'))
UsersTable = dbUsers.table('Users')

dbExperiments = TinyDB(os.path.join(basedir,'dbExperiments.json'))
ExperimentsTable = dbExperiments.table('Experiments')

dbEvents = TinyDB(os.path.join(basedir,'dbEvents.json'))
EventsTable = dbEvents.table('Events')

dbLogs = TinyDB(os.path.join(basedir,'dbLogs.json'))
PeriodicLogsTable = dbLogs.table('Logging')



#the index pate is the agreement
@app.route('/', methods = ['GET','POST'])
def index():
    if request.method == 'GET':
	    #user_agent = request.headers.get('User-Agent')
	    return render_template('agreement.html')
        #return'<h1>Hello World</h1><p>Your browser is %s</p>' % user_agent
    else:
        
        #session['userid'] = myUser.id
        fullName = request.form['name']
        idNumber = request.form['idnumber']
        address = request.form['address']
        fullName1 = request.form['name1']
        date1=request.form['date']
        signature = request.form['agree']
        print fullName + idNumber + address + fullName1 + date1 + signature
        return redirect('/questions')
    
@app.route('/questions', methods = ['GET','POST'])
def user():
    if request.method == 'GET':
        return render_template("questions.html", title = 'questions')  
        
    else:
        turkNickName = request.form['turkNickName']
        age = request.form['age']
        country = request.form['country']
        sex = request.form['sex']
        salaryRange = request.form['salaryRange']
        UsersTable.insert({'turkNickName':turkNickName, 'age':age, 'country':country, 'sex':sex, 'salaryRange':salaryRange })
        return redirect('/stations')
    
@app.route('/stations')
def stations():
    time = 180
    gameduration = "gameduration = "+ str(time)
    print "test"
    print gameduration
    
    #config = [{"Station1": 100,100,1,0,4,"Station1",120,50}, {'Station2':100,1,0,4,"Station2",120,400}]
    #need to transfer the station config to the html page. These are the example points:
    
    stationSetup = 'station[1] = new myStation(60,1,0,4,"Station1",120,50, gameScore,logging); '
    stationSetup += 'station[2] = new myStation(60,1,0,4,"Station2",120,400, gameScore,logging); '
    stationSetup += 'station[3] = new myStation(60,1,0,4,"Station3",120,750, gameScore,logging); '
    stationSetup += 'station[4] = new myStation(60,1,0,4,"Station4",550, 50, gameScore,logging); '
       
    
    return render_template('stations.html', gameduration = gameduration, stationSetup=stationSetup)

    
    #4 sets of logging functions- user, experiment, event and periodic
@app.route('/userLog', methods = ['POST']) 
def userLogging():
    logData = request.get_json()
    UsersTable.insert(logData)
    return('successful user insert?')

@app.route('/experimentLog', methods = ['POST']) 
def experimentLogging():
    logData = request.get_json()
    ExperimentsTable.insert(logData)
    return('successful insert?')    
    
@app.route('/eventLog', methods = ['POST']) 
def eventLogging():
    logData = request.get_json()
    EventsTable.insert(logData)
    return('successful insert?')
    
@app.route('/periodicLog', methods = ['POST']) 
def periodicLogging():
    logData = request.get_json()
    PeriodicLogsTable.insert(logData)
    return('successful insert?')    
    
@app.route('/log', methods = ['POST'])
def logging():
    mydata = request.get_json()
    print mydata['score']
    print mydata['secondsLeft']
    
    
    return 'This is the log page' 
    
    
@app.route('/results')
def results():
    data = jsonify( PeriodicLogsTable.all())
    return data
    
if __name__ == '__main__':
	app.run(host= '0.0.0.0', port=4000, debug=True)
