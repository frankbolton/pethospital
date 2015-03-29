from xlrd import open_workbook
from tinydb import TinyDB, where
import os.path

wb = open_workbook('experiment_setup.xlsx')
a = wb.sheet_by_name('stationsLearn')
b = wb.sheet_by_name('stationsExperiment')

basedir = os.path.abspath(os.path.dirname(__file__))
db = TinyDB(os.path.join(basedir, 'app/dbExperimentConfiguration.json'))
stationsLearnTable = db.table('stationsLearn')
stationsExperimentTable = db.table('stationsExperiment')






#_____________________________________________________
#
#  THIS IS THE STATIONS_LEARN SECTION
#
#_____________________________________________________

# Clear the old data from the learning table
stationsLearnTable.purge()

labels = []
for col in range(a.ncols):
    labels.append(a.cell(0,col).value)
for row in range(a.nrows):
    data = {}
    for col in range(a.ncols):
        #values.append(a.cell(row,col).value)
        data[labels[col]]=a.cell(row,col).value
    if row>0:
        stationsLearnTable.insert(data)
#print labels

#stationsLearnTable.insert(data)


#_____________________________________________________
#
#  THIS IS THE STATIONS_EXPERIMENT SECTION
#
#_____________________________________________________

# Clear the old data from the experiment table
stationsExperimentTable.purge()

labels = []
for col in range(b.ncols):
    labels.append(b.cell(0,col).value)
for row in range(b.nrows):
    data = {}
    for col in range(b.ncols):
        #values.append(a.cell(row,col).value)
        data[labels[col]]=b.cell(row,col).value
    if row>0:
        stationsExperimentTable.insert(data)
print labels