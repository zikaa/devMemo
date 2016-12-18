import './routes.js';
import './accounts-config.js';
import { i18n } from 'meteor/anti:i18n';
import { TAPi18n } from 'meteor/tap:i18n';

AutoForm.setDefaultTemplate('materialize');

if (Meteor.isClient) {
  let userLang = window.navigator.language || window.navigator.userLanguage || 'ja';
  userLang = userLang.split('-')[0];

  const convertToTAPi18nLang = function(lang) {
    switch (lang) {
      case 'ja':
        return 'jp';
      case 'zh':
        return 'zh-CN';
      case 'ko':
        return 'ko';
      default:
        return 'en';
    }
  };

  const syncI18nAndTAPi18n = function() {
    const originalSetLanguage = i18n.setLanguage;// .bind(i18n);
    i18n.setLanguage = function(lang) {
      originalSetLanguage(lang);
      TAPi18n.setLanguage(convertToTAPi18nLang(lang));
    };
  };

  syncI18nAndTAPi18n();
  i18n.setLanguage(userLang);

  // code to run on server at startup
  Deps.autorun(function() {
    if (this.userId) {
      let lang = "ja";
      i18n.setLanguage(lang);
      moment.locale(lang);
    }
  });
}
