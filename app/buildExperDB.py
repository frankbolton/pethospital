from tinydb import TinyDB, where

import os.path, time, random
basedir = os.path.abspath(os.path.dirname(__file__))


#dbExperimentParameters = TinyDB(os.path.join(basedir,'dbExperimentParameters.json'))
#ParametersTable = dbExperimentParameters.table('Parameters')
#UserTracking = dbExperimentParameters.table('TrackUsers')

dbExperimentParameters = TinyDB(os.path.join(basedir,'dbExperimentParameters.json'))
ParametersTable = dbExperimentParameters.table('Parameters')
UserTracking = dbExperimentParameters.table('TrackUsers')

#start with a single group with a single subject.
ParametersTable.insert({'groupID': 1})
