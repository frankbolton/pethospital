from flask import Flask,request ,render_template, session
from transitions import Machine
app = Flask(__name__)

app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/987s'
states = ['start', 'experiment', 'tlx','questions','end']

transitions=[
        ['advance','start','experiment'],
        ['advance', 'experiment','tlx'],
        ['advance', 'tlx', 'questions'],
        ['advance', 'questions', 'end'],
]


#machine = Machine(states = states, transitions=transitions, initial='start')


@app.route('/', methods=['GET', 'POST'])
def home():
    if request.method == 'POST':
        print('foo')
        session['show_eeg'] = request.form['show_eeg']
        session['id'] = request.form['id']
        session['machine'].advance()
        return(redirect('/second'))
    else:
        session['machine'] = Machine(states = states, transitions=transitions, initial='start')
        return(render_template("index.html"))

@app.route('/second')
def sec():
        return(session['machine'].state)



 


        
    


#transitions=[
#        ['trigger':'advance','source':'start','dest':'experiment'],
#        ['trigger':'advance','source':'experiment','dest':'tlx'],
#        ['trigger':'advance', 'source':'tlx', 'dest':'questions'],
#        ['trigger':'advance', 'source':'questions', 'dest':'end'],
#]
#    def __init__(self, name):
#        self.name = name
#        self.machine = Machine(model=self, states = PethospitalUser.states, \
    #transitions=PethospitalUser.transitions,   initial='start',)
#    def getName(self):
#        return self.name

#    def getState(self):
#        return Machine
#user = PethospitalUser('one')

