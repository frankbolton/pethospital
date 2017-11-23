from flask import Flask, render_template, request, redirect
app = Flask(__name__, static_url_path='/static')


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




@app.route("/")
def hello():
    #return "hello world"
    return render_template("uploadTest.html")

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
        print(data)
        return redirect('/')
        