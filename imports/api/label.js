import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { i18n } from 'meteor/anti:i18n';
import { Memos } from './memos.js';
export const Label = new Mongo.Collection('Label');

Label.allow({
  update: function(userId) {
    return !!userId;
  },
  remove: function(userId, doc) {
    Memos.update({labelId: doc._id}, {
      $unset: {labelId: ""}
    }, {multi: true});
    return !!userId;
  }
});

let Schemas = {};

Schemas.label = new SimpleSchema({
  name: {
    type: String,
    label: function() {return i18n('collection.label.name');},
    max: 10,
  },
  name_sort: {
    type: String,
    optional: true,
    autoValue: function() {
      let name = this.field("name");
      if (name.isSet) {
        return name.value.toLowerCase();
      } else {
        return this.unset();
      }
    }
  },
  color: {
    type: String,
    optional: true,
    defaultValue: "#e4e4e4",
    regEx: /^#([0-9a-f]{6}|[0-9a-f]{3})$/i,
  },
  createdAt: {
    type: Date,
    autoValue: function() {
      return new Date();
    },
  },
  owner: {
    type: String,
    autoValue: function() {
      return Meteor.userId();
    },
  },
  username: {
    type: String,
    autoValue: function() {
      return Meteor.user().username;
    },
  },
});

Label.attachSchema(Schemas.label);
Meteor.methods({
  'addLabel'(labelObj) {
    check(labelObj, Object);

    if (!this.userId) {
      throw new Meteor.Error("not authorized");
    }

    Label.insert({
      name: labelObj.name,
      color: labelObj.color,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },
  'removeLabel'(id) {
    check(id, String);
    const label = Label.findOne(id);

    if (this.userId !== label.owner) {
      throw new Meteor.Error('not authorized');
    }

    Label.remove(id);
    Memos.update({labelId: id},
      {
        $unset: {labelId: ""}
      }, {multi: true});
  }
});

Label.helpers({
  memos() {
    return Memos.find({labelId: this._id});
  },
  memoCount() {
    return Memos.find({labelId: this._id}).count();
  }
});
