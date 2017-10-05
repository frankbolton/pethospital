from xlrd import open_workbook
from tinydb import TinyDB, where
import os.path

wb = open_workbook('experiment_setup.xlsx')
a = wb.sheet_by_name('stationsLearn')
b = wb.sheet_by_name('stationsExperiment')
#c = wb.sheet_by_name('interruptionsLearn')
d = wb.sheet_by_name('interruptionsExperiment')

basedir = os.path.abspath(os.path.dirname(__file__))
db = TinyDB(os.path.join(basedir, 'dbExperimentConfiguration.json'))
stationsLearnTable = db.table('stationsLearn')
stationsExperimentTable = db.table('stationsExperiment')
#interruptionsLearnTable = db.table('interruptionsLearn')
interruptionsExperimentTable = db.table('interruptionsExperiment')






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
#print labels


#_____________________________________________________
#
#  THIS IS THE INTERRUPTIONS_LEARN SECTION
#	NOTE-NO INTERRUPTIONS IN LEARN SECTION AT THE MOMENT
#_____________________________________________________

#interruptionsLearnTable.purge()
#labels = []
#for col in range(c.ncols):
#    labels.append(c.cell(0,col).value)
#for row in range(c.nrows):
#    data = {}
#    for col in range(c.ncols):
#        #values.append(a.cell(row,col).value)
#        data[labels[col]]=c.cell(row,col).value
#    if row>0:
#        interruptionsLearnTable.insert(data)
#print labels
#_____________________________________________________
#
#  THIS IS THE INTERRUPTIONS_EXPERIMENT SECTION
#
#_____________________________________________________

interruptionsExperimentTable.purge()
labels = []
for col in range(d.ncols):
    labels.append(d.cell(0,col).value)
for row in range(d.nrows):
    data = {}
    for col in range(d.ncols):
        #values.append(a.cell(row,col).value)
        data[labels[col]]=d.cell(row,col).value
    if row>0:
        interruptionsExperimentTable.insert(data)

#print labels



