#!venv/bin/python

from flask import Flask, request, render_template, redirect, jsonify, session
#from flask.ext.sqlalchemy import SQLAlchemy
import os.path, time
basedir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__)
app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,4325'


from tinydb import TinyDB, where
dbUsers = TinyDB(os.path.join(basedir,'dbUsers.json'))
UsersTable = dbUsers.table('Users')
FeedbackTable = dbUsers.table('TLXQuestions')

dbExperiments = TinyDB(os.path.join(basedir,'dbExperiments.json'))
ExperimentsTable = dbExperiments.table('Experiments')

dbEvents = TinyDB(os.path.join(basedir,'dbEvents.json'))
EventsTable = dbEvents.table('Events')

dbLogs = TinyDB(os.path.join(basedir,'dbLogs.json'))
PeriodicLogsTable = dbLogs.table('Logging')

dbExperimentParameters = TinyDB(os.path.join(basedir,'dbExperimentParameters.json'))
ParametersTable = dbExperimentParameters.table('Parameters')
UserTracking = dbExperimentParameters.table('TrackUsers')



#the index pate is the agreement
@app.route('/', methods = ['GET','POST'])
def index():
    if request.method == 'GET':
	    #user_agent = request.headers.get('User-Agent')
	    return render_template('agreement.html')
        #return'<h1>Hello World</h1><p>Your browser is %s</p>' % user_agent
    else:
        #number = -100
        #Check if a user exists, if so increment UserID
        if not UserTracking.search(where('UserID')):
            number = 1
            UserTracking.insert({'UserID': 1})
        #if no user's exist yet, initialize one
        else:
            record = UserTracking.get(where('UserID'))
            number = record['UserID'] + 1
            UserTracking.update({'UserID': number + 1 }, where('UserID'))
        session['userID'] = number
        fullName = request.form['name']
        idNumber = request.form['idnumber']
        address = request.form['address']
        fullName1 = request.form['name1']
        date1=request.form['date']
        signature = request.form['agree']
        print fullName + idNumber + address + fullName1 + date1 + signature
        #session['userID'] = number 
        session['fullName'] = request.form['name']
        session['idnumber'] = request.form['idnumber']
        session['address']=request.form['address']
        session['name1']=request.form['name1']
        session['date']=request.form['date']
        session['agree']=request.form['agree']
        return redirect('/questions')
    
@app.route('/questions', methods = ['GET','POST'])
def user():
    if request.method == 'GET':
        return render_template("questions.html", title = 'questions')  
        
    else:
        turkNickName = request.form['turkNickName']
        age = request.form['age']
        country = request.form['country']
        gender = request.form['gender']
        salaryRange = request.form['salaryRange']
        
        
        session['turkNickName'] = request.form['turkNickName']
        session['age'] = request.form['age']
        session['country'] = request.form['country']
        session['gender'] = request.form['gender']
        session['salaryRange'] = request.form['salaryRange']
        session['stageNumber'] = 1
        
        
        UsersTable.insert({'userID':session['userID'], 'turkNickName':turkNickName, 'age':age, 'country':country, \
        'gender':gender, 'salaryRange':salaryRange, 'fullName':session['fullName'],\
         'idnumber':session['idnumber'], 'address':session['address'],\
          'name1':session['name1'], 'date':session['date'],'agree':session['agree']  })
          
          
        return redirect('/stations')
    
@app.route('/stations')
def stations():
    time = 180
    gameduration = "gameduration = "+ str(time)
    print "test"
    print gameduration
    #stationSetup =[]
    #config = [{"Station1": 100,100,1,0,4,"Station1",120,50}, {'Station2':100,1,0,4,"Station2",120,400}]
    #need to transfer the station config to the html page. These are the example points:
    
    stationSetup_1 = 'station[1] = new myStation(100,3,2,4,"Station1",120,20, gameScore,logging); ';
           
    stationSetup_2 = 'station[1] = new myStation(100,3,2,4,"Station1",120,20, gameScore,logging); station[2] = new myStation(40,3,2,4,"Station2",120,340, gameScore,logging); ';
           
    stationSetup_3 = 'station[1] = new myStation(100,3,2,4,"Station1",120,20, gameScore,logging); station[2] = new myStation(40,3,2,4,"Station2",120,340, gameScore,logging); station[3] = new myStation(70,3,2,4,"Station3",120,660, gameScore,logging); '
            
    stationSetup_4 = 'station[1] = new myStation(100,3,2,4,"Station1",120,20, gameScore,logging); station[2] = new myStation(40,3,2,4,"Station2",120,340, gameScore,logging); station[3] = new myStation(70,3,2,4,"Station3",120,660, gameScore,logging); station[4] = new myStation(20,3,2,4,"Station4",550, 20, gameScore,logging); '

    stationSetup_5 = 'station[1] = new myStation(100,3,2,4,"Station1",120,20, gameScore,logging); station[2] = new myStation(40,3,2,4,"Station2",120,340, gameScore,logging); station[3] = new myStation(70,3,2,4,"Station3",120,660, gameScore,logging); station[4] = new myStation(20,3,2,4,"Station4",550, 20, gameScore,logging); station[5] = new myStation(20,3,2,4,"Station5",550, 340, gameScore,logging); '
           
    stationSetup_6 ='station[1] = new myStation(100,3,2,4,"Station1",120,22, gameScore,logging); station[2] = new myStation(40,3,2,4,"Station2",120,340, gameScore,logging); station[3] = new myStation(70,3,2,4,"Station3",120,660, gameScore,logging); station[4] = new myStation(20,3,2,4,"Station4",550, 20, gameScore,logging); station[5] = new myStation(20,3,2,4,"Station5",550, 340, gameScore,logging); station[6] = new myStation(20,3,2,4,"Station6",550, 660, gameScore,logging); '
 
    if session['stageNumber'] == 1:
        stationSetup = stationSetup_1
    elif session['stageNumber'] == 2:
        stationSetup = stationSetup_2
    elif session['stageNumber'] == 3:
        stationSetup = stationSetup_3
    elif session['stageNumber'] == 4:
        stationSetup = stationSetup_4
    elif session['stageNumber'] == 5:
        stationSetup = stationSetup_5
    elif session['stageNumber'] == 6:
        stationSetup = stationSetup_6
    print session['stageNumber']
    return render_template('stations.html', gameduration = gameduration, stationSetup = stationSetup )

    
@app.route('/after_questions', methods =['GET', 'POST'])
def after_questions():
    if request.method == 'GET':
        return render_template("after.html")
    else:
        #record the feedback from the user.
        #FeedbackTable.insert({'Mental Demand':request.form['radio01.value'], 'Temporal Demand':request.form['radio02.value'], 'Performance':request.form['radio03.value'], 'Effort':request.form['radio04.value'], 'Frustration':request.form['radio05.value']})
        #FeedbackTable.insert(request.form['radio01'])
        #print request
        #print request.form
        radio01 = request.form['radio01']
        radio02 = request.form['radio02']
        radio03 = request.form['radio03']
        radio04 = request.form['radio04']
        radio05 = request.form['radio05']
  
        print radio01
        print radio02
        print radio03
        print radio04
        print radio05
        FeedbackTable.insert({'userID':session['userID'], 'turkNickName':session['turkNickName'],'StageNumber':session['stageNumber'],'Mental Demand':radio01, 'Temporal Demand':radio02, 'Performance':radio03, 'Effort':radio04, 'Frustration':radio05})
        #store some results
        if session['stageNumber']<6:
            session['stageNumber']+=1
            return redirect('/stations')
        else:
            return redirect('/end')
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
    logData["serverTime"] = time.asctime()
    EventsTable.insert(logData)
    return('successful insert' + str(logData))
    
@app.route('/periodicLog', methods = ['POST']) 
def periodicLogging():
    logData = request.get_json()
    PeriodicLogsTable.insert(logData)
    return('successful insert?')    
    
@app.route('/log', methods = ['POST'])
def logging():
    mydata = request.get_json()
    print mydata['fullName']
    print mydata['secondsLeft']
    
    
    return 'This is the log page' 
    
    
@app.route('/results')
def results():
    data = jsonify( PeriodicLogsTable.all())
    return data
    
@app.route('/showsession')
def showsession(): 
    return render_template('showSession.html', fullName = session['fullName'],idnumber = session['idnumber'], stageNumber= session['stageNumber'], userID=session['userID'])
    
@app.route('/end')
def end():
    session.pop('fullName', None)
    session.pop('idnumber', None)
    session.pop('address', None)    
    session.pop('name1', None)
    session.pop('date', None)
    session.pop('agree', None)    
	
    session.pop('turkNickName', None)
    session.pop('age', None)
    session.pop('date', None)    
    session.pop('sex', None)
    session.pop('salaryRange', None)
    session.pop('stageNumber', None)
    return('Experiment complete, thank you')
    
if __name__ == '__main__':
	app.run(host= '0.0.0.0', port=4000, debug=True)
