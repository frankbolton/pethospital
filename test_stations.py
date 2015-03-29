from tinydb import TinyDB, where
import os.path


basedir = os.path.abspath(os.path.dirname(__file__))
db = TinyDB(os.path.join(basedir, 'app/dbExperimentConfiguration.json'))

#stationsExperimentTable = db.table('stationsLearn')
stationsExperimentTable = db.table('stationsExperiment')


foo = stationsExperimentTable.all()
blockNumbersVerbose = []
for station in foo:
	blockNumbersVerbose.append(station['block_number'])
blockNumbers = list(set(blockNumbersVerbose))	
	
blocks = [{} for iter in blockNumbers]
#for iter in blockNumbers:
#	blocks[iter] = stationsExperimentTable.search(where('block_number')==iter)
		
	#a[0] = learnStationTable.search(where('block_number')==1)
	#a[1] = learnStationTable.search(where('block_number')==3)

for ix in range(len(blocks)):
	print ix
	blocks[ix] = stationsExperimentTable.search(where('block_number')==blockNumbers[ix])   



#goal - generate this
stationSetup_3 ='station[1] = new myStation(100,5,2,4,"'+identifier+'1",60,35, gameScore,logging); station[2] = new myStation(100,5,2,4,"'+identifier+'2",60,340, gameScore,logging); station[3] = new myStation(50,3,2,4,"'+identifier+'3",60,645, gameScore,logging);'
        