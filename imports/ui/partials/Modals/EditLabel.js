import { TemplateController } from 'meteor/space:template-controller';
import { Label } from '../../../api/label.js';
import { AutoForm } from 'meteor/aldeed:autoform';
import { resetModalForm } from './modalHelper.js';
import { Session } from 'meteor/session';

import './EditLabel.html';

TemplateController('EditLabel', {
  state: {
    label: {}
  },
  onCreated() {
    const self = this;
  },
  helpers: {
    label() {
      let label = Label.findOne({_id: Session.get('editLabelId')});
      this.state.label = label;
      return label;
    },
  },
});
const hooksObject = {
  onSuccess: function() {
    resetModalForm();
  },
};
AutoForm.hooks({
  editLabel: hooksObject
});
