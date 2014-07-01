#!venv/bin/python

from flask import Flask, request, render_template, redirect
#from flask.ext.sqlalchemy import SQLAlchemy
import os.path
basedir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__)

#app.config['SQLALCHEMY_DATABASE_URI'] =\
'sqlite:///' + os.path.join(basedir, 'data.sqlite')
#app.config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] = True
#db = SQLAlchemy(app)

from tinydb import TinyDB, where
db = TinyDB(os.path.join(basedir,'db.json'))
UsersTable = db.table('Users')
ExperimentsTable = db.table('Experiments')
EventsTable = db.table('Events')
PeriodicLogsTable = db.table('Logging')



#the index pate is the agreement
@app.route('/', methods = ['GET','POST'])
def index():
    if request.method == 'GET':
	    user_agent = request.headers.get('User-Agent')
	    return render_template('agreement.html')
        #return'<h1>Hello World</h1><p>Your browser is %s</p>' % user_agent
    else:
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
    
    stationSetup = 'station=[];station[1] = new myStation(60,1,0,4,"Station1",120,50, gameScore,logging); '
    stationSetup += 'station[2] = new myStation(60,1,0,4,"Station2",120,400, gameScore,logging); '
    stationSetup += 'station[3] = new myStation(60,1,0,4,"Station3",120,750, gameScore,logging); '
    #stationSetup += 'station[4] = new myStation(60,1,0,4,"Station4",550, 50, gameScore,logging); '
       
    
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
    
    
if __name__ == '__main__':
	app.run(debug=True)
