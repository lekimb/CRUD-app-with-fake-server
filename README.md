# CRUD-app-with-fake-server

This is a CRUD application. It is possible to create, update and delete blog posts directly from the UI. 
The app is written in a way that CRUD-logic functions are clearly separated from UI-painting functions. 

## Intended usage
In order to keep everyhting working correctly, it's requiered to launch locally a fake server. The reason for that the application can fetch the data from there propperly. Specifically, I have been using json-server for that purpose and I highly recommend using it. By default, it launches a server on port 3000 (http://localhost:3000) and it's on that port where the application will try to connect when fetching data. 

## Installing json-server
Installing json-server is very easy with npm:

```
npm install -g json-server
```

Then, within the project folder, let's launch our db.json file on port 3000:

```
json-server -w db.json 
```
And that's it! Now you can run the application and everything should work correctly. 
