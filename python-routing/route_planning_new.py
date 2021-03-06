import requests
import json
from math import radians, cos, sin, asin, sqrt

#haversine function
def haversine(lon1, lat1, lon2, lat2):
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees)
    """
    # convert decimal degrees to radians 
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])

    # haversine formula 
    dlon = lon2 - lon1 
    dlat = lat2 - lat1 
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a)) 
    r = 6371 # Radius of earth in kilometers. Use 3956 for miles
    return c * r *1000


def plan_route_oneway(route_json,lon,lat,end_lon,end_lat,range_car):
    #assuming only 1 leg
    range_left=range_car
    route_array=[] #Main list of properly visited node
    #total number of steps taken
    num_steps=len(route_json['legs'][0]['steps'])
    count=0

    #get routes
    for i in range(0,num_steps):
        num_intersections=len(route_json['legs'][0]['steps'][i]['intersections'])
        for j in range(0,num_intersections):
            offset=0
            lat_new=route_json['legs'][0]['steps'][i]['intersections'][j]['location'][1]
            lon_new=route_json['legs'][0]['steps'][i]['intersections'][j]['location'][0]
            location={'lat':lat_new,'lon':lon_new}
            route_array.append(location)
    routes={'locations':route_array}

    #send routes to get list of nearvy routes
    findStationURL="http://192.168.43.141:2454/api/getStation"
    headers = {'Content-Type': 'application/json', 'Accept':'application/json'}
    nearMeStations= requests.post(findStationURL, data=json.dumps(routes), headers=headers).json()['response']

    #last charge co ordinates
    last_charge_lat=lat
    last_charge_lon=lon
    #Prev Co ordiantes
    prev_lat=lat
    prev_lon=lon
    final_route_array=[]
    distance=0
    #return routes
    for i in range(0,len(nearMeStations)):
        final_route_array.append({ 'lat' : prev_lat , 'lon' : prev_lon } )
        #If stations exist update last charge else add distance
        if(nearMeStations[i]):
            distance=0
            last_charge_lat=route_array[i]['lat']
            last_charge_lon=route_array[i]['lon']
        else:
            distance=distance+haversine(float(prev_lon),float(prev_lat),float(route_array[i]['lon']),float(route_array[i]['lat']))
            
        if(distance>=range_car):
            if(last_charge_lat==lat and last_charge_lon==lon):
                return []
            start_lon=str(last_charge_lon)
            start_lat=str(last_charge_lon)
            end_lon=str(end_lon)
            end_lat=str(end_lat)
            r = requests.get('http://0.0.0.0:5000/route/v1/driving/'+start_lon+','+start_lat+';'+end_lon+','+end_lat+'?alternatives=3&overview=false&steps=true')
            route_data=r.json()
            num_routes=len(route_data['routes'])
            route_present=0
                
            for i in range(0,num_routes):
                
                route=plan_route_oneway(route_data['routes'][i],start_lon,start_lat,end_lon,end_lat,range_car)
                    
                #since route array is not null it will return some route append it to original route and send ahead 
                if(len(route)!=0):
                    route_present=1
                    final_route_array=final_route_array+route
                    return final_route_array
                return [] 
        prev_lat=route_array[i]['lat']
        prev_lon=route_array[i]['lon']    

    return final_route_array


# In[18]:



def plan_route(start_lon,start_lat,end_lon,end_lat,range_car):
    #start_lon,start_lat,end_lon,end_lat
    start_lon=str(start_lon)
    start_lat=str(start_lat)
    end_lon=str(end_lon)
    end_lat=str(end_lat)
    r = requests.get('http://0.0.0.0:5000/route/v1/driving/'+start_lon+','+start_lat+';'+end_lon+','+end_lat+'?alternatives=3&overview=false&steps=true')
    route_data=r.json()
    #number of routes
    num_routes=len(route_data['routes'])
    #routing array which will be sent
    route_arr=[]
    
    for i in range(0,num_routes):
        route_arr.append(plan_route_oneway(route_data['routes'][i],start_lon,start_lat,end_lon,end_lat,range_car))

    return route_arr    
    

