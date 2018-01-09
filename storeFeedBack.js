const fs = require('fs');
const feedbacks = require('./feedbacks.json');
const querystring = require('querystring');

const arrangeUserFeedBack = function(information) {
  return querystring.parse(information);
}

const makeFeedbackTable = function(event) {
  let date = new Date().toLocaleString();
  let table = feedbacks.map(function(feedback) {
    return `<tr><td>${date}</td><td>${feedback.name}</td><td>${feedback.comment}</td></tr>`
  })
  table = table.join("");
  return `<tr></tr>${table}`;
}

const storeFeedBack = function(url) {
  let userInfo = arrangeUserFeedBack(url);
  feedbacks.unshift(userInfo);
  let updateDatabase = JSON.stringify(feedbacks);
  fs.writeFile("./feedbacks.json", updateDatabase,function (err) {
    return;
  });
}

const updateGuestPage = function() {
  let pageDisplay = fs.readFileSync("public/guestPage.html", "utf8");
  let newFeeback = makeFeedbackTable();
  let guestPage = pageDisplay.replace("<tr></tr>", newFeeback);
  return guestPage;
}

exports.updateGuestPage = updateGuestPage;
exports.storeFeedBack = storeFeedBack;
