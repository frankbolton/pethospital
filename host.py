from flask import Flask, render_template, request, redirect
app = Flask(__name__, static_url_path='/static')


#to run FLASK_APP=host.py flask run


@app.route("/")
def hello():
    return "hello world"
    

@app.route("/experiment", methods=['GET', 'POST'])
def experiment():
    if request.method == 'POST':
        print('inside post')
        #do some post action.... save the logs to the database and continue with experiment flow
        print request.form['logs']
        return redirect('/')

    else:
        print('inside else')
        return render_template("pethospital.html")

