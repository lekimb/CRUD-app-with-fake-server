# CRUD-app-with-fake-server

This is a CRUD application. It is possible to create, update and delete blog posts directly from the UI. 
The app is written in a way that CRUD-logic functions are clearly separated from UI-painting functions. 

## Intended usage
In order to keep everyhting working correctly, it's requiered to launch locally a fake server. Specifically, I have used json-server for that purpose and I highly recommend using it. By default, it launches a server on port 3000 (http://localhost:3000) and it's on that port where the application will try to connect when fetching data. 

## Installing json-server
Installing json-server is very easy with npm:

```
npm install -g json-server
```

Then, within the project folder, let's launch locally our db.json file:

```
json-server -w db.json 
```
And that's it! Now everything is set up and ready to run the application. 
