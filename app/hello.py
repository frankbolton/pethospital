#!/home/ubuntu/pethospital/venv/bin/python


#! ../venv/bin/python

from flask import Flask, request, render_template, redirect, jsonify, session
#from flask.ext.sqlalchemy import SQLAlchemy
import os.path, time
basedir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__)
app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,4325'


from tinydb import TinyDB, where
dbUsers = TinyDB(os.path.join(basedir,'dbUsers.json'))
#dbUsers = TinyDB('dbUsers.json')
UsersTable = dbUsers.table('Users')


dbTLX = TinyDB(os.path.join(basedir,'dbTLX.json'))
FeedbackTable = dbTLX.table('TLXQuestions')

dbEvents = TinyDB(os.path.join(basedir,'dbEvents.json'))
EventsTable = dbEvents.table('Events')

#this database keeps track of the subjects ID that will be allocated next.
#------DO NOT REMOVE --------------------------------------------------------------
dbExperimentParameters = TinyDB(os.path.join(basedir,'dbExperimentParameters.json'))
ParametersTable = dbExperimentParameters.table('Parameters')
UserTracking = dbExperimentParameters.table('TrackUsers')
#------DO NOT REMOVE --------------------------------------------------------------


order = [[0,1,2],[1,2,0],[2,0,1]]



#the index pate is the agreement... It's the first page that the participant encounters
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
            number = 0
            UserTracking.insert({'UserID': 0})
        #if no user's exist yet, initialize one
        else:
            record = UserTracking.get(where('UserID'))
            number = record['UserID'] + 1
            UserTracking.update({'UserID': number }, where('UserID'))
        session['userID'] = number
        #session['subjectOrder'] = order[number-1]
        return redirect('/questions')
    
    
#the questions page.... The second page that the participant encounters
@app.route('/questions', methods = ['GET','POST'])
def user():
    if request.method == 'GET':
        return render_template("questions.html", title = 'questions')  
        
    else:
        turkNickName = request.form['turkNickName']
        age = request.form['age']
        country = request.form['country']
        gender = request.form['gender']
        touch = request.form['touch']
        print "touch - "
        print touch
        
        session['turkNickName'] = request.form['turkNickName']
        session['age'] = request.form['age']
        session['country'] = request.form['country']
        session['gender'] = request.form['gender']
        session['stageNumber'] = 0
        
        
        UsersTable.insert({'userID':session['userID'], 'turkNickName':turkNickName, 'age':age, 'country':country, \
        'gender':gender, 'touch':touch, 'serverTime':time.asctime() })
          
          
        return redirect('/instructions')

@app.route('/instructions', methods = ['GET', 'POST'])
def instructions():
    if request.method =='GET':
        return render_template("instructions.html")
    else:
        return redirect('/stations_learn')
        
#this is the trial block
@app.route('/stations_learn')
def stationsLearn():        
    if request.method =='GET':
        session['score']=-1
        time = 300
        gameduration = "gameduration = "+ str(time)
        print "test"
        print gameduration
        #arguments: [0] health level at the start, [1] station decrease rate (%/s),
        #arguments_cont: [2] noise added, [3], viewing_cost, [4] stationID, [5] topOffset, [6] leftOffset          
        #stationSetup_2 = 'station[1] = new myStation(50,3,2,4,"Station 1",60,35, gameScore,logging); station[2] = new #myStation(100,5,2,4,"Station 2",60,340, gameScore,logging); ';
        
        #stationSetup_4 = 'station[1] = new myStation(100,5,2,4,"Station 1",60,35, gameScore,logging); station[2] = new 
        #myStation(50,3,2,4,"Station 2",60,340, gameScore,logging); station[3] = new myStation(50,5,2,4,"Station 3",60,645, #gameScore,logging); station[4] = new myStation(100,3,2,4,"Station 4",410, 35, gameScore,logging); '
        identifier = 'Kitty Cat '
        stationSetup_6 ='station[1] = new myStation(100,5,2,4,"'+identifier+'1",60,35, gameScore,logging); station[2] = new myStation(100,5,2,4,"'+identifier+'2",60,340, gameScore,logging); station[3] = new myStation(50,3,2,4,"'+identifier+'3",60,645, gameScore,logging); station[4] = new myStation(100,3,2,4,"'+identifier+'4",410, 35, gameScore,logging); station[5] = new myStation(50,5,2,4,"'+identifier+'5",410, 340, gameScore,logging); station[6] = new myStation(50,3,2,4,"'+identifier+'6",410, 645, gameScore,logging); '
        #print "userid mod 30 = " + str(session['userID']%3)
        #presenationOrder = order[session['userID']%3]
        #print presenationOrder
        #i = session['stageNumber'] 
        #if presenationOrder[i] == 0: 
        #    stationSetup = stationSetup_2
        #elif presenationOrder[i] == 1:
        #    stationSetup = stationSetup_4
        #elif presenationOrder[i] == 2:
        #    stationSetup = stationSetup_6
        #session['stationSetup'] = stationSetup
        #print session['stageNumber']
        return render_template('stations.html', gameduration = gameduration, stationSetup =  stationSetup_6 , trainingMode = 1)
    else:
        return redirect('/after_learn')

@app.route('/after_learn', methods = ['GET', 'POST'])
def after_learn():
    if request.method == 'GET':
        return render_template('after_learn.html')
    else:
        return redirect('/stations')
        
        
#the actual experiment.... This is the forth page that the subject encounters.        
@app.route('/stations')
def stations():
    session['score']=-1
    time = 300
    gameduration = "gameduration = "+ str(time)
    print "test"
    print gameduration
    #arguments: [0] health level at the start, [1] station decrease rate (%/s),
    #arguments_cont: [2] noise added, [3], viewing_cost, [4] stationID, [5] topOffset, [6] leftOffset   
    identifier = 'Kitty Cat '
    stationSetup_2 = 'station[1] = new myStation(50,3,2,4,"'+identifier+'1",60,35, gameScore,logging); station[2] = new myStation(100,5,2,4,"'+identifier+'2",60,340, gameScore,logging); ';
    
    stationSetup_4 = 'station[1] = new myStation(100,5,2,4,"'+identifier+'1",60,35, gameScore,logging); station[2] = new myStation(50,3,2,4,"'+identifier+'2",60,340, gameScore,logging); station[3] = new myStation(50,5,2,4,"'+identifier+'3",60,645, gameScore,logging); station[4] = new myStation(100,3,2,4,"'+identifier+'4",410, 35, gameScore,logging); '
    stationSetup_6 ='station[1] = new myStation(100,5,2,4,"'+identifier+'1",60,35, gameScore,logging); station[2] = new myStation(100,5,2,4,"'+identifier+'2",60,340, gameScore,logging); station[3] = new myStation(50,3,2,4,"'+identifier+'3",60,645, gameScore,logging); station[4] = new myStation(100,3,2,4,"'+identifier+'4",410, 35, gameScore,logging); station[5] = new myStation(50,5,2,4,"'+identifier+'5",410, 340, gameScore,logging); station[6] = new myStation(50,3,2,4,"'+identifier+'6",410, 645, gameScore,logging); '
    print "userid mod 30 = " + str(session['userID']%3)
    presenationOrder = order[session['userID']%3]
    print presenationOrder
    i = session['stageNumber'] 
    if presenationOrder[i] == 0: 
        stationSetup = stationSetup_2
    elif presenationOrder[i] == 1:
        stationSetup = stationSetup_4
    elif presenationOrder[i] == 2:
        stationSetup = stationSetup_6
    #elif session['stageNumber'] == 4:
    #    stationSetup = stationSetup_4
    #elif session['stageNumber'] == 5:
    #    stationSetup = stationSetup_5
    #elif session['stageNumber'] == 6:
    #    stationSetup = stationSetup_6
    session['stationSetup'] = stationSetup
    print session['stageNumber']
    return render_template('stations.html', gameduration = gameduration, stationSetup = stationSetup, trainingMode = 0)

    
@app.route('/after_questions', methods =['GET', 'POST'])
def after_questions():
    if request.method == 'GET':
    	session['TLXStartTime'] = time.asctime()
        return render_template("after_tlx.html")
    else:
        #record the feedback from the user.
        print "request: " + str(request)
        print "request form: " + str(request.form)
        print "request form todict: " + str(request.args.getlist)
        a = request.form
        print "a"
        print a
        if a.get('Mental Demand') == None:
            print "This is an empty string"
            
            
        else:
            print "Not an empty string"
            print a.get('Mental Demand')
            print "score"
            print session['score']            
            FeedbackTable.insert({'userID':session['userID'], 'turkNickName':session['turkNickName'], \
            'stageNumber':session['stageNumber'], 'score':session['score'], \
            'Temporal Demand':a.get('Temporal Demand'), 'Performance':a.get('Performance'), \
            'Effort':a.get('Effort'), 'Frustration':a.get('Frustration'),\
            'Physical Demand':a.get('Physical Demand'), 'Mental Demand':a.get('Mental Demand'),\
            'TLXStartTime':session['TLXStartTime'], 'TLXEndTime':time.asctime(),\
            'stationSetup':session['stationSetup']})
            
            print "userID"
            print session['userID']
            
        if session['stageNumber']<2:
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


    
@app.route('/eventLog', methods = ['POST']) 
def eventLogging():
    logData = request.get_json()
    session['score']=logData["score"]
    print session['score']
    logData["serverTime"] = time.asctime()
    logData["stageNumber"] = session['stageNumber']
    EventsTable.insert(logData)
    return('successful insert' + str(logData))
    

    
@app.route('/results')
def results():
    data = str(UsersTable.all())
    data += str(FeedbackTable.all())
    data += str(EventsTable.all())
    data += str(PeriodicLogsTable.all())
    data += str(ParametersTable.all())
    data += str(UserTracking.all())
    return data
    
@app.route('/showsession')
def showsession(): 
    return render_template('showSession.html',turkNickName = session['turkNickName'], \
    stageNumber= session['stageNumber'], userID=session['userID'], score=session['score'])

@app.route('/phone')
def phone(): 
    return render_template('phone.html')

    
@app.route('/end')
def end():

    endStr = "Experiment complete, thank you. Please enter the code into mechanical turk: \""\
    +session["turkNickName"]+str(session["userID"])+"\""
    session.pop('fullName', None)
    session.pop('idnumber', None)
    session.pop('address', None)    
    session.pop('name1', None)
    session.pop('date', None)
    session.pop('agree', None)
    session.pop("userID", None)
    session.pop('turkNickName', None)
    session.pop('age', None)
    session.pop('date', None)    
    session.pop('sex', None)
    session.pop('salaryRange', None)
    session.pop('stageNumber', None)
    return(endStr)
  

@app.route('/resultsTLX')
def resultsTLX():
    TLXdata = FeedbackTable.all()
    #print(TLXdata)
    #return render_template('Results_TLX.html', ajax = TLXdata)
    return jsonify(results = TLXdata)

@app.route('/resultsUsers')
def resultsUsers():
    userData = UsersTable.all()
    #return render_template('Results_users.html', ajax = userData)
    return jsonify(results = userData)
    
if __name__ == '__main__':
    app.run(host= '0.0.0.0', port=4000, debug=True)
