# days-off-loopback
Server side application running on Loopback with data persisted on MongoDB. 

## Test days-off-loopback on your local machine
1. Install MongoDB on your machine, create an empty DB called days-off and run the MongoDB instance
2. clone this days-off-loopback repository
3. move to the folder you have just downloaded
4. run ```npm install``` to install the required node modules
5. run ```node .``` to launch the application
6. check out and test the API methods on http://localhost:3000/explorer

## Check out the cloud version on IBM Bluemix
Moving to IBM Bluemix is pretty easy, all you need is 
* getting a Bluemix account
* adding a manifest.yml file
* replacing a local DB with a Cloud DB (e.g. Cloudant)

### My Bluemix account
I have activated a trial using a promotional code and it will expire in June 2017. Some of the links provided below may not be longer valid after that date.

### Adding manifest.yml
Manifest.yml is used by Bluemix to 
More details on https://docs.cloudfoundry.org/devguide/deploy-apps/manifest.html.
This is an example of manifest.yml
```javascript
applications:
- path: .
  memory: 1024M
  instances: 1
  domain: mybluemix.net
  name: days-off-cloudant
  host: days-off-cloudant
  disk_quota: 1024M

```

### Using Cloudant instead of MongoDB
The cloud version of this application persist data on Cloudant, which is a "Database As A Service" provided by IBM Bluemix. Moving a Loopback application from MongoDB to Cloudant is pretty straightforward. 

* Create a Cloudant DBAAS application, enter its specific dashboard and create a database (e.g. "days-off")

* In the Cloudant dashboard go to Account > CORS and make sure that CORS is enabled and that "Databases will accept requests all the domains"

* Get the credentials from "Cloud Foundry Apps > Connections > View Connections". You will get something like this

```javascript
{
  "cloudantNoSQLDB": {
    "name": "Cloudant-3s",
    "label": "cloudantNoSQLDB",
    "plan": "shared",
    "credentials": {
      "username": "someusername",
      "password": "secret",
      "host": "myhost-bluemix.cloudant.com",
      "port": 443,
      "url": "https://someusername:secret@myhost-bluemix.cloudant.com"
    }
  }
}
```

* Now it's time to change the settings in days-off-loopback application. Go to server/datasources.json and replace it with something like this (of course you have to set your credentials
```
{
  "db": {
    "name": "db",
    "connector": "memory"
  },
  "Cloudant": {
    "url": "https://someusername:secret@myhost-bluemix.cloudant.com",
    "database": "days-off",
    "username": "someusername",
    "password": "secret",
    "name": "Cloudant",
    "modelIndex": "",
    "connector": "cloudant"
  }
}
```
* Finally, go to ```model-config.json``` and replace all the references to MongoDB with "Cloudant"

### REST API
You can take advantage of the Swagger API explorer that is built-in with Loopback. It is available here https://days-off-cloudant.mybluemix.net/explorer/. As an alternative, you can run this Postman collection

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/9703f36fb536d1c12325#?env%5Bibm-bluemix-env%5D=W3sia2V5Ijoiand0IiwidHlwZSI6InRleHQiLCJ2YWx1ZSI6ImV5SmhiR2NpT2lKSVV6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUoxYzJWeWJtRnRaU0k2SWxObGNtZHBieUlzSWw5cFpDSTZJalU0TVRFNE5USTVZVFkwTnpRd01qUTROR1V6WkdOaE1TSXNJbUZrYldsdUlqcG1ZV3h6WlN3aWFXRjBJam94TkRjNU1UQXdNVFV6TENKbGVIQWlPakUwTnpreE1ETTNOVE45LnY0OHdKdzNaWWxQVEpLdFdsYW1sUXNnS3ZsTG4yTU04bTA2T2NWOFVXS0EiLCJlbmFibGVkIjp0cnVlfSx7ImtleSI6ImN1cnJlbnQiLCJ0eXBlIjoidGV4dCIsInZhbHVlIjoic3RhbmRhcmQiLCJlbmFibGVkIjp0cnVlfSx7ImtleSI6Imhvc3RuYW1lIiwidmFsdWUiOiJodHRwczovL2RheXMtb2ZmLWNsb3VkYW50Lm15Ymx1ZW1peC5uZXQvYXBpIiwidHlwZSI6InRleHQiLCJlbmFibGVkIjp0cnVlfV0=)

The order of the methods in the Postman collection represents a test suite that covers all the methods used by the available clients.
