'use strict';

module.exports = function(Request) {

  Request.beforeRemote('create', function(context, user, next) {
    //context.args.data.date = Date.now();
    context.args.data.RequestedBy = context.req.accessToken.userId;
    context.args.data.SubmittedOn = new Date().toISOString();
    next();
  });

  Request.beforeRemote('prototype.updateAttributes', function(context, user, next) {
    context.args.data.ApprovedBy = context.req.accessToken.userId;
    console.log("Request approval status is now " + context.args.data.Status);
    next();
  });

};
