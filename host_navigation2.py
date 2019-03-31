from flask import Flask,request ,render_template, session,redirect


app = Flask(__name__)
app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/987s'
STATE_START = 1
STATE_FIRST = 2
STATE_SECOND = 3

def next_page(session_state):
    print(session.get('state'))
    if session_state==STATE_START:
        return {'/first',STATE_FIRST}
    elif session_state==STATE_FIRST:
        return {'/second',STATE_SECOND}

@app.route('/', methods=['GET', 'POST'])
def home():
    if request.method == 'POST':
        print('inside of / post')
        session['id'] = request.form['id']
        session['state'] = next_page(0)
        return redirect("/")
    else:
        print('inside of Get /')
        print(session.get('state'))
        

        if(session.get('state')==None):
            print('inside of Get / state doesnt exist')
            return(render_template("index.html"))
        else:
            print('inside of Get / state exists')
            url = next_page(session['state'])
            return(redirect(url))
            


@app.route('/first', methods=['GET'])
def first():
    return(render_template('first.html'))

@app.route('/second', methods=['GET'])
def second():
    
    return('second')


