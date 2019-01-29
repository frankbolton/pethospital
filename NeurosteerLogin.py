import requests
import os

url = "https://api.neurosteer.com"

#this code appends the port for the testing server to the url
# port_pull = ":8443" 
# url = url+port_pull

def login():
    userName = (os.environ["Neurosteer_user"])
    password = (os.environ["Neurosteer_pass"])

    url_signin = url+"/signin"
    r = requests.post(url_signin, data={'Content-type': 'application/x-www-form-urlencoded','email': userName, 'password': password})
    #test if the EULA needs to be updated- if so, 
    if 'eulaUpdateMsg' in r.json():
        raise ValueError('Neurosteer service needs you to update the EULA, with a browser login to the portal to accept it.', url_signin)

    if 'status' in r.json():
        if(r.json()['status']==401):
            raise ValueError('Error', r.json()['message'])
    a = r.json()['url']
    start_of_token = a.find('access_token=')+len('access_token=')
    end_of_token = a.find('&user_data=')
    accessToken = a[start_of_token:end_of_token]

    start_of_bluetooth = a.find('bluetooth":"') + len('bluetooth":"')
    end_of_bluetooth = a.find('","email":')
    sensorID = a[start_of_bluetooth:end_of_bluetooth]

    return [accessToken, sensorID]



def logEvent(accessToken, sensorID, text):
    path = '/api/v1/sensors/'+sensorID+'/latest/events'
    data = {'Content-type':'application/x-www-form-urlencoded',}
    headers = {'path':path, 'authorization':'Bearer '+accessToken}
    data['description'] = text
    r = requests.post(url=url+path, json=data, headers = headers)
    print(r)
