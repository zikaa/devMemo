import { waitAndSetValue, waitAndClickButton } from './webdriver';
import { user } from './userInfo';
import { getMemo, createMemo} from './builder';

module.exports = function() {
  this.Before( function() {
    this.url = "https://youtube.com";
  });

  this.After( function() {
    server.execute((userId)=>{
      const { Memos } = require('/imports/api/memos.js');
      return Memos.remove({owner: userId });
    }, user.userId);
  });

  this.When(/^I fill in url "([^"]*)"$/, function(url) {
    waitAndSetValue('input[name=url]', url);
  });

  this.When(/^I submit$/, function() {
    client.submitForm("#addMemo");
  });

  this.Then(/^I should see "([^"]*)" is added to my memo$/, function(url) {
    client.pause(3000);
    const query = {
      url: url,
      owner: user.userId
    };
    let memo = getMemo(query);
    expect(memo.url).to.equal(url);
  });

  this.Given(/^I have memo "([^"]*)"$/, function(url) {
    const labelObj = {
      url: url,
      owner: user.userId,
      isFavorited: false,
    };
    this.memo = createMemo(labelObj);
  });

  this.When(/^I click memo$/, function() {
    client.waitForVisible(`#card-${this.memo._id}`, 3000);
    client.click(`#card-${this.memo._id}`);
  });

  this.When(/^I press heart icon$/, function() {
    client.pause(300);
    client.click(".heart");
  });

  this.Then(/^my memo "([^"]*)" should be favorited$/, function(url) {
    const query = {
      url: url,
      owner: user.userId
    };
    let memo = getMemo(query);
    expect(memo.isFavorited).to.equal(true);
  });

  this.When(/^I click label$/, function() {
    waitAndClickButton(`.label-${this.label._id}`);
  });

  this.Then(/^I should see "([^"]*)" with label "([^"]*)" added to my memo$/, function(url, labelName) {
    client.pause(3000);
    const query = {
      url: url,
      owner: user.userId,
    };
    let memo = getMemo(query);
    expect(memo.url).to.equal(url);
    expect(memo.labelId).to.equal(this.label._id);
  });
};