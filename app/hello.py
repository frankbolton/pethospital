#!/home/ubuntu/pethospital/venv/bin/python
portNumber = 5000
debug = True
myHost = '0.0.0.0'
#AMT = True
multipleDevices = False
basicPayment = "US$1"
bonusPayment = "US$1"


from flask import Response, json, Flask, request, render_template, redirect, jsonify, session

import os.path, time, random
basedir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__)
app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,4325'

from flask.ext.socketio import SocketIO, emit, join_room, leave_room, send

from tinydb import TinyDB, where
dbUsers = TinyDB(os.path.join(basedir,'dbUsers.json'))
UsersTable = dbUsers.table('Users')

dbCatch = TinyDB(os.path.join(basedir,'dbCatch.json'))
PageTracking = dbCatch.table('catch')

dbTLX = TinyDB(os.path.join(basedir,'dbTLX.json'))
FeedbackTable = dbTLX.table('TLXQuestions')

dbEvents = TinyDB(os.path.join(basedir,'dbEvents.json'))
EventsTable = dbEvents.table('Events')

db = TinyDB(os.path.join(basedir, 'dbExperimentConfiguration.json'))
stationsLearnTable = db.table('stationsLearn')
stationsExperimentTable = db.table('stationsExperiment')
interruptionsLearnTable = db.table('interruptionsLearn')
interruptionsExperimentTable = db.table('interruptionsExperiment')

#this database keeps track of the subjects ID that will be allocated next.
#------DO NOT REMOVE --------------------------------------------------------------
dbExperimentParameters = TinyDB(os.path.join(basedir,'dbExperimentParameters.json'))
ParametersTable = dbExperimentParameters.table('Parameters')
UserTracking = dbExperimentParameters.table('TrackUsers')
#------DO NOT REMOVE --------------------------------------------------------------

#order = [[0,1,2],[1,2,0],[2,0,1]]
order  = [[0,1],[1,0]]
#This is the set of times required in the experiment. 
def makeStation (parameter) :
    return 'this is my python function'

exptime = 5 # in minutes
learntime = 3 #in minutes


numberOfSessions = 2

numberOfGroups = 3 #this is used for setting up the random manipulation,  we have 2 groups with interruptions 

def trackingLog(path, method,uuid=''):
    print 'in tracker path: '+path+'. Method:'+method+'. Time:'+time.asctime()
    PageTracking.insert({'path':path, 'uuid':uuid,'method':method, 'time':time.asctime()})
    return

socketio = SocketIO(app)
rooms = {}
usrs = {}

def find_element_in_list(element,list_element):
    print element
    try:
        index_element=list_element.index(element)
        return index_element
    except ValueError:
        return -1
 #--------------------------------------------------------------------------------------
 #  Experiment paths
 #--------------------------------------------------------------------------------------



@app.route('/sockets')
def socketindex():
    print('INDEX')
    return render_template('index.html')

#the index pate is the agreement... It's the first page that the participant encounters
@app.route('/', methods = ['GET','POST'])
def index():  
    if request.method == 'GET':
        trackingLog('/',request.method)
        return render_template('agreement.html', exptime = exptime, learntime=learntime,\
        numberOfSessions=numberOfSessions, totalTime = learntime + numberOfSessions * (exptime+1),\
        basicPay = basicPayment, bonusPay = bonusPayment)
    else:
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
        trackingLog('/',request.method,session['userID'])
        return redirect('/questions')
    
#the questions page.... The second page that the participant encounters
@app.route('/questions', methods = ['GET','POST'])
def user():
    trackingLog('/questions',request.method, session['userID'])
    if request.method == 'GET':
        return render_template("questions.html", title = 'questions')
    else:
        turkNickName = request.form['turkNickName']
        age = request.form['age']
        country = request.form['country']
        gender = request.form['gender']
        touch = request.form['touch']
        
        
        session['turkNickName'] = request.form['turkNickName']
        session['age'] = request.form['age']
        session['country'] = request.form['country']
        session['gender'] = request.form['gender']
        session['stageNumber'] = 0
        
        #After the questions have been filled in, we can add the user to a condition
        group = random.randrange(0,(numberOfGroups),1) #produces random numbers from 0 to numberOfGroups - 1
        session['group'] = group
        
        UsersTable.insert({'userID':session['userID'], 'turkNickName':turkNickName, 'age':age, 'country':country, \
        'gender':gender, 'touch':touch, 'serverTime':time.asctime(), 'browsertype':request.form['browserType'], \
        'numberOfSessions':numberOfSessions,'exptime':exptime, 'learntime':learntime, 'group':group})
          
          
        return redirect('/instructions')

@app.route('/instructions', methods = ['GET', 'POST'])
def instructions():
    trackingLog('/instructions',request.method, session['userID'])
    if request.method =='GET':
        #if AMT:        
        #    return render_template("instructions_turk.html", exptime = exptime, learntime=learntime,\
        # numberOfSessions=numberOfSessions, totalTime = learntime + numberOfSessions * (exptime+1))
        #else:
        return render_template("instructions.html", exptime = exptime, learntime=learntime,\
         numberOfSessions=numberOfSessions, totalTime = learntime + numberOfSessions * (exptime+1))
    else:
        return redirect('/stations_learn')
        
#this is the trial block
@app.route('/stations_learn')
def stationsLearn():        
    trackingLog('/stations_learn',request.method, session['userID'])
    if request.method =='GET':
        session['score']=-1
        gameduration = "gameduration = "+ str(learntime*60)
        print "test"
        print gameduration
        #No interruptions during training block.         
        data = stationsLearnTable.all()
        iTimes = []
        iMessageVal = []
        interruptions = []
        return render_template('stations.html', gameduration = gameduration, stations = json.dumps(data),  trainingMode = 1, turkNickName=str(session['turkNickName']), iTimes=iTimes, iMessageVal=iMessageVal, interruptions=json.dumps(interruptions), multipleDevices=multipleDevices)
    #There is no condition for Post here as Station.html generates a confirm and redirects, so there are no post requests.

@app.route('/after_learn', methods = ['GET', 'POST'])
def after_learn():
    trackingLog('/after_learn',request.method, session['userID'])    
    if request.method == 'GET':
        if multipleDevices:
            return render_template('after_learn.html', uid = session['turkNickName'])
        else:
            return render_template('after_learn_tabbed.html', uid = session['turkNickName'] )
    else:
        return redirect('/stations')



@app.route('/stations_mobile')
def stations_mobile():
    try:
        return render_template('stationsDiv.html', uid = session['turkNickName'])
    except KeyError:
        print "else"
        return render_template('noSession.html')

        
#the actual experiment.... This is the forth page that the subject encounters.        
@app.route('/stations')
def stations():
    trackingLog('/stations',request.method, session['userID'])
    session['score']=-1
    gameduration = "gameduration = "+ str(exptime*60)
    #print "test"
    #print gameduration
    data = stationsExperimentTable.all()
    blockNumbersVerbose = []
    for station in data:
        blockNumbersVerbose.append(station['block_number'])
    blockNumbers = list(set(blockNumbersVerbose))
    blocks = [{} for iter in blockNumbers]
    for ix in range(len(blocks)):
        blocks[ix] = stationsExperimentTable.search(where('block_number')==blockNumbers[ix])   
        print blocks[ix]
        
    print "userid mod 30 = " + str(session['userID']%2)
    presenationOrder = order[session['userID']%2]
    print presenationOrder
    i = session['stageNumber'] 
    print i
    if presenationOrder[i] == 0: 
        session['stationCount'] = len(blocks[0])
        station = blocks[0]
        print 'present 2 stations first'
    elif presenationOrder[i] == 1:
        session['stationCount'] = len(blocks[1])
        station = blocks[1]
        print 'present 6 stations first'
    
    session['stationSetup'] = station
    print session['stageNumber']
    session['SessionStartTime'] = time.asctime()
    #iTimes = '[20000,40000,60000,80000,12000]'
    #iMessageVal = '[true, false, true, false, true]'
    
    #interruptions1 = interruptionsExperimentTable.all()
    #interruptions2 = interruptionsExperimentTable.search(where('group_number')==1)
    interruptions = interruptionsExperimentTable.search(where('group_number')==session['group'])
    
    print 'session: '
    print session['group']
    
    
    #print '____________________________________'
    
    print "just before render_template"
    #return render_template('stations.html', gameduration = gameduration, stations = json.dumps(station), trainingMode = 0, turkNickName=str(session['turkNickName']), iTimes=iTimes, iMessageVal=iMessageVal, interruptions=json.dumps(interruptions))
    return render_template('stations.html', gameduration = gameduration, stations = json.dumps(station), trainingMode = 0, turkNickName=str(session['turkNickName']), interruptions=json.dumps(interruptions), multipleDevices=multipleDevices)



@app.route('/after_questions', methods =['GET', 'POST'])
def after_questions():
    trackingLog('/after_questions',request.method, session['userID'])
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
            'stationSetup':session['stationSetup'], 'stationCount':session['stationCount'], \
            'SessionStartTime':session['SessionStartTime'], 'gameDuration':exptime*60 })
            
            print "userID"
            print session['userID']
            
        if session['stageNumber']<1:
            session['stageNumber']+=1
            if multipleDevices:
                return redirect('/stations')
            else:
                return redirect('/stations')
        else:
            return redirect('/end')
    #4 sets of logging functions- user, experiment, event and periodic
    
    
@app.route('/end')
def end():
    try:
        trackingLog('/end',request.method, session['userID'])
        endStr = "Experiment complete, thank you. Please enter the code into mechanical turk: \""\
        +session["turkNickName"]+str(session["userID"])+"\""
        
        endCode = session["turkNickName"]+str(session["userID"])
        print endCode
        session.clear()
        #return(endStr)    
        return render_template('expComplete.html', endCode = endCode)
    except KeyError:
        print "else"
        return render_template('noSession.html')
    
@app.route('/end3')
def end3():
    if request.method == 'GET':
        #trackingLog('/end',request.method, session['userID'])
        #endStr = "Experiment complete, thank you. Please enter the code into mechanical turk"
        #print endstr
        turkNickName = session['turkNickName']
        userID=session['userID'] 
        strlong = str(turkNickName)+str(userID)
        session.pop('fullName', None)
        session.pop('idnumber', None)
        session.pop('address', None)    
        session.pop('name1', None)
        session.pop('date', None)
        session.pop('agree', None)
        session.pop('userID', None)
        session.pop('turkNickName', None)
        session.pop('age', None)
        session.pop('date', None)    
        session.pop('sex', None)
        session.pop('salaryRange', None)
        session.pop('stageNumber', None)
        
    return render_template('expComplete.html', turkNickName = turkNickName, userID=userID, strlong = strlong)
  
 #--------------------------------------------------------------------------------------
 #  Results paths
 #--------------------------------------------------------------------------------------
#Functions excluded from experiment flow- these exist to allow data retrieval, debugging, etc.
 
  
#Logging functions that the research subject doesn't see
@app.route('/userLog', methods = ['POST']) 
def userLogging():
    trackingLog('/userLog',request.method, session['userID'])
    logData = request.get_json()
    UsersTable.insert(logData)
    return('successful user insert?')


#@app.route('/eventLog', methods = ['GET','POST'])
#def eventLogging():
#    if request.method == 'GET':
#        return ('test123456')
#        trackingLog('/eventLog',request.method, session['userID'])
#    else:
#        trackingLog('/eventLog',request.method, session['userID'])


@app.route('/eventLog/', methods = ['POST'])
def eventLogging():
    #if request.method == 'GET':
        #    console.log("get on event log")
        #logData = request.get_json()
        #    trackingLog('/eventLog',request.method, session['userID'])
        #return('You\'re trying to do get on a function that only deals with POST requests')
        #else:
    if request.method=='POST':
        print 'successful in post'
        logData = {}
        #trackingLog('/eventLog',request.method, session['userID'])
        #logData = request.get_json()
        #session['score']=logData["score"]
        #print session['score']
        logData["serverTime"] = time.asctime()
        logData["stageNumber"] = session['stageNumber']
        logData["userID"] = session['userID']
        logData["postData"] = request.json
        #logData["postData1"] = get_json(request.data)
        EventsTable.insert(logData)
        print logData
        return('successful run of post')



#Phone interface is still in development
@app.route('/phone')
def phone(): 
    return render_template('phone.html')

    

@app.route('/results')
def results():
    #data = jsonify(users = UsersTable.all())#str(UsersTable.all())
    #data += jsonify(feedback = FeedbackTable.all())#str(FeedbackTable.all())
    #data += str(EventsTable.all())
    #data += str(PeriodicLogsTable.all())
    #data += str(ParametersTable.all())
    #data += str(UserTracking.all())
    return jsonify(users = UsersTable.all())
    
@app.route('/showsession')
def showsession(): 
    return render_template('showSession.html',turkNickName = session['turkNickName'], \
    stageNumber= session['stageNumber'], userID=session['userID'], score=session['score'], group=session['group'])

@app.route('/resultsTLX')
def resultsTLX():
    #TLXdata = FeedbackTable.all()
    #print(TLXdata)
    #return render_template('Results_TLX.html', ajax = TLXdata)
    #return jsonify(results = TLXdata)
    return jsonify(results = FeedbackTable.all())

@app.route('/resultsCatch')
def resultsCatch():
    CatchData = PageTracking.all()
    #print(TLXdata)
    #return render_template('Results_TLX.html', ajax = TLXdata)
    return jsonify(results = CatchData)

@app.route('/resultsUsers')
def resultsUsers():
    userData = UsersTable.all()
    #return render_template('Results_users.html', ajax = userData)
    return jsonify(results = userData)
    
@app.route('/resultsEvents')
def resultsEvents():
    Events = EventsTable.all()
    #return render_template('Results_users.html', ajax = userData)
    return jsonify(results = Events)    
 
 #--------------------------------------------------------------------------------------
 #  Socket paths
 #-------------------------------------------------------------------------------------- 
  
@app.route('/rooms')
def roomspage():
    return jsonify(results = rooms)
    
@socketio.on('connect', namespace='/a')
def test_connect(): #tested and works okay to get the phone and browser screens to show the UID questions
    print('Client connected')
    emit('serverConnect')#, {'data':' hello world'})
    
@socketio.on('identify', namespace='/a')
def identify_f(data):
    userID = data['uid']
    device = data['device']
    socketID = str(device)#data['socketid'] #request.namespace.socket.sessid
    
    print '_________________________'
    
    print 'compare different sources, 1 data socketid'+str(data['socketid'])+', 2: request sessid:'+request.namespace.socket.sessid
    print 'in identify, data: '+str(data)   
    print 'Uid: '+userID #data['uid']
    print 'socketID: '+ socketID#request.namespace.socket.sessid #+data['socketid']
    print 'Len(uid): '+str(len(data['uid']))
    print 'rooms: '
    print rooms
    print 'usrs'
    print usrs
    
    
    if data['uid'] in rooms: 
        print('in rooms already')
        #if find_element_in_list(request.namespace.socket.sessid, rooms[data['uid']])>-1:
        if find_element_in_list(socketID, rooms[data['uid']])>-1:  
            print 'after "if"'
            join_room(data['uid'])  #join_room() is part of flask socketio
            usrs[socketID] = data['uid']
            emit('joinedroom', data)
        elif len(rooms[data['uid']])>1: #this is for the third and subsequent connection to the room
            print 'after elseif'
            emit('failed', {'err':'already two connections'})
        else: #this is for the third and subsequent connection to the room
            print 'final else- this is where we have the second socket of the pair'
            join_room(data['uid'])  #join_room() is part of flask socketio
            rooms[data['uid']].append(socketID)#data['socketid'])
            usrs[socketID] = data['uid']
            emit('joinedroom', data)
       
    
    else: #this is for the first connection to the room
        print('not yet in rooms')
        join_room(data['uid'])  #join_room() is part of flask socketio
        #print socket.id
        #if data['uid'] not in rooms:
        #    rooms[data['uid']]=[]
        #rooms[data['uid']].append(data['socketid'])
        rooms[data['uid']] = [socketID]#[data['socketid']]
        usrs[socketID] = data['uid']
        emit('joinedroom', data)
        print 'socketio'+str(socketio)
        print 'rooms'+ str(rooms)


@socketio.on('msg', namespace='/a')
def msg(data):
    device = data['device']
    socketID = str(device)#data['socketid'] #request.namespace.socket.sessid
    print 'message received'
    print data
    print request.namespace
    print request
    print request.namespace.socket.sessid   
    print rooms[data['uid']]
    if find_element_in_list(socketID, rooms[data['uid']])>-1:
        print 'room :'
        emit('msg', data, broadcast=True, room=data['uid'])
    else:
        print 'computer sez no' 



        
@socketio.on('my event', namespace='/test')
def test_message(message):
    emit('my response', {'data': message['data']})

@socketio.on('my broadcast event', namespace='/test')
def test_message(message):
    emit('my response', {'data': message['data']}, broadcast=True)



@socketio.on('disconnect', namespace='/test')
def test_disconnect():
    print('Client disconnected')
        
#--------------------------------------------------------------------------------------
#   Run code 
#-------------------------------------------------------------------------------------- 
    
  
    
if __name__ == '__main__':
    #app.run(host= '0.0.0.0', port=portNumber, debug=debug)
    socketio.run(app, host=myHost, port=portNumber)
