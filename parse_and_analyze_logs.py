#!/usr/bin/env python2
# -*- coding: utf-8 -*-
"""
Created on Sat Aug  4 13:21:02 2018

@author: frankbolton
"""

import numpy as np
import pandas as pd
from tinydb import TinyDB, Query
import os.path
import matplotlib as mpl
import matplotlib.pyplot as plt


# Load the different tinyDB tables
#The events table logs the different user interaction steps (view, heal, hide)
dbEvents = TinyDB('dbEvents.json')
EventsTable = dbEvents.table('Events')
Q = Query()
#the periodic events table logs the health and score every second for the 
# different experiments
dbPeridic = TinyDB(os.path.join('dbPeriodic.json'))
PeriodicEventsTable = dbPeridic.table('Periodic')

#the High Level results show the 
dbHighLevelResults = TinyDB('dbHighLevel.json')
DemographicsTable = dbHighLevelResults.table('Demographics')
SessionSummaryTable = dbHighLevelResults.table('SessionSummary')

#the TLX table records the self-reported TLX scales from a questionairre 
# presented to each participant after each session
dbTLX = TinyDB('dbTLX.json')
TLXTable = dbTLX.table('TLXQuestions')




participantID = 9

#Currently there's a problem with by dbHighLevelResults data.
#Lets jump to trying to make sense of the data in dbPeriodic.

Events = pd.DataFrame(EventsTable.search(Q.participantID == participantID))

PeriodicEvents = pd.DataFrame(PeriodicEventsTable.search(Q.participantID == participantID))

#TLX table has different id and the value is recorded as string
TLX = pd.DataFrame(TLXTable.search(Q.id == str(participantID)))

Demographics = pd.DataFrame(DemographicsTable.search(Q.id == str(participantID)))
SessionInfo = pd.DataFrame(SessionSummaryTable.all())


PeriodicEvents2 = PeriodicEvents.loc[PeriodicEvents['stationCount']==2]
PeriodicEvents4 = PeriodicEvents.loc[PeriodicEvents['stationCount']==4]
PeriodicEvents6 = PeriodicEvents.loc[PeriodicEvents['stationCount']==6]



x = np.arange(0,PeriodicEvents2.shape[0])
plt.plot(x,PeriodicEvents2.score, label="2 pets")
plt.plot(x,PeriodicEvents4.score, label="4 pets")
plt.plot(x,PeriodicEvents6.score, label="6 pets")
plt.xlabel("time [s]")
plt.ylabel("score")
plt.legend()
plt.show()

plt.plot(x, PeriodicEvents2.pet1)
plt.plot(x, PeriodicEvents2.pet2)
plt.xlabel("time [s]")
plt.ylabel("pet health, 2 pets")
plt.legend()
plt.show()

plt.plot(x, PeriodicEvents4.pet1)
plt.plot(x, PeriodicEvents4.pet2)
plt.plot(x, PeriodicEvents4.pet3)
plt.plot(x, PeriodicEvents4.pet4)
plt.xlabel("time [s]")
plt.ylabel("pet health, 4 pets")
plt.legend()
plt.show()

plt.plot(x, PeriodicEvents6.pet1)
plt.plot(x, PeriodicEvents6.pet2)
plt.plot(x, PeriodicEvents6.pet3)
plt.plot(x, PeriodicEvents6.pet4)
plt.plot(x, PeriodicEvents6.pet5)
plt.plot(x, PeriodicEvents6.pet6)
plt.xlabel("time [s]")
plt.ylabel("pet health, 6 pets")
plt.legend()
plt.show()



