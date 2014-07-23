from tinydb import TinyDB, where


dbExperimentParameters = TinyDB(os.path.join(basedir,'dbExperimentParameters.json'))
ParametersTable = dbLogs.table('Parameters')

#start with a single group with a single subject.
ParametersTable.insert({groupID: 1})
