'use strict';
var app = require('../../server/server'); //require `server.js` as in any node.js app

module.exports = function(Employee) {

  Employee.beforeRemote('create', function(context, user, next) {

    var myMongoDB = app.dataSources.MongoDB;
    if(myMongoDB==null) {
      console.log("MongoDB not found");
    }
    else {
      // Look for the supervisor in case of regular employee
      if(!context.req.body.IsManager){

        var mgrId = Employee.findOne({where :{DepartmentId : context.req.body.DepartmentId, IsManager : true}}, function(err, model) {
          if (err) next(err);
          if(model != null) {
            context.args.data.managerId=model.id;
            console.log("Added new Employee, reporting to " + model.username + "("+model.email+"), head of dept. n." +model.DepartmentId);        }
          else{
              console.log("No manager found for specified Department");
          }
          next();
        });


      }
      else {
        // Skip in case of Manager/supervisor
        console.log("Welcome to the manager:" + context.req.body.username + "("+context.req.body.email+"), head of dept. n." + context.req.body.DepartmentId);
        next();
      }
    }
  });



};
