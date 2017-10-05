from xlrd import open_workbook
from tinydb import TinyDB, where
import os.path

wb = open_workbook('experiment_setup.xlsx')
a = wb.sheet_by_name('stations')
#b = wb.sheet_by_name('stationsExperiment')
#c = wb.sheet_by_name('interruptionsLearn')
#d = wb.sheet_by_name('interruptionsExperiment')

basedir = os.path.abspath(os.path.dirname(__file__))
db = TinyDB(os.path.join(basedir, 'dbExperimentConfiguration.json'))
stationsTable = db.table('stations')






#_____________________________________________________
#
#  THIS IS THE STATIONS_LEARN SECTION
#
#_____________________________________________________

# Clear the old data from the learning table
stationsTable.purge()

labels = []
for col in range(a.ncols):
    labels.append(a.cell(0,col).value)
for row in range(a.nrows):
    data = {}
    for col in range(a.ncols):
        #values.append(a.cell(row,col).value)
        data[labels[col]]=a.cell(row,col).value
    if row>0:
        stationsTable.insert(data)
