import { Meteor } from 'meteor/meteor';
import { moment } from 'meteor/momentjs:moment';

import { Memos } from '../imports/api/memos.js';
import { Accounts } from 'meteor/accounts-base';
import { Label } from '../imports/api/label.js';
import { SyncedCron } from 'meteor/percolate:synced-cron';
import '../imports/api/user.js';
  Accounts.onCreateUser(function(options, user) {
  	Label.insert({
  		name:"default",
  		createdAt:new Date(),
  		owner:user._id,
  		username:user.username,
  	},{getAutoValues:false});
  	return user;
  });

//jobs
SyncedCron.add({
  name: 'Find notification needed memos',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text('every 5 seconds');
  },
  job: function() {
    Meteor.call('checkNotify');
  }
});
Meteor.startup(() => {
  SyncedCron.start();
  // code to run on server at startup
});
