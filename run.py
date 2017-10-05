from flask import Flask, render_template
app = Flask(__name__)

@app.route("/")
def index():
    return render_template('stations.html')



@app.route("/simple")
def simple():
    return render_template('simple.html')  
    
