from app import db


class User(db.Model):
    __tablename__ = 'users'
    #this records the periodic logs from the browser
    id = db.Column(db.Integer, primary_key = True)
    turkWorkerID = db.Column(db.String(64), index = True)
    ageRangeStr = db.Column(db.String(64))
    ageLowEnd = db.Column(db.SmallInteger)
    ageHighEnd = db.Column(db.SmallInteger)
    salaryRangeStr = db.Column(db.String(64))
    salaryLowEnd = db.Column(db.SmallInteger)
    salaryHighEnd = db.Column(db.SmallInteger)
    country = db.Column(db.String(64))
    sex = db.Column(db.Boolean)
    
    def __repr__(self):
        return '<User %r>' % (self.turkNickName)

        
class Experiment(db.Model):
    __tablename__ = 'experiments' 
    id = db.Column(db.Integer, primary_key = True)
    userId = db.Column(db.Integer, db.ForeignKey('User.id'))
    gameEndScore =db.Column(db.SmallInteger)
    viewCost = db.Column(db.SmallInteger)
    scoreIncrement = db.Column(db.SmallInteger) 
    stationHealth = db.Column(db.SmallInteger)
    stationVisibility = db.Column(db.Boolean)
   
   
   
   
 class ButtonEvent(db.Model):
    __tablename__ = 'buttonevents' 
    id = db.Column(db.Integer, primary_key = True)
    userId = db.Column(db.Integer, db.ForeignKey('User.id'))
    experimentID = db.Column(db.Integer)
    

    timestamp = db.Column(db.DateTime)

    #learn / experiment
    def __repr__(self):
        return '<Result %r>' % (self.id
    
   