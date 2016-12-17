import { TemplateController } from 'meteor/space:template-controller';
import { Session } from 'meteor/session';

import './Overlay.html';

TemplateController('Overlay', {
  helpers: {
    shouldOverlayShow() {
      if (Session.get('isShrinkedSideNavShown') || Session.get('isSearchNavShown') || Session.get('isSearching') || Session.get('labelBarShow')) {
        return true;
      } else {
        return false;
      }
    },
  },
  events: {
    'click .sidebar-overlay'() {
      Session.set('isShrinkedSideNavShown', false);
      Session.set('isSearchNavShown', false);
      Session.set('isSearching', false);
      Session.set('labelBarShow', false);
      Session.set('labelFormShow', false);
    },
  },
});