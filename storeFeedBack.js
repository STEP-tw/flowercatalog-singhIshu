const fs = require('fs');
const feedbacks = require('./feedbacks.json');
const querystring = require('querystring');

const arrangeUserFeedBack = function(information) {
  return querystring.parse(information);
}

const makeFeedbackTable = function() {
  let date = new Date().toLocaleString();
  let table = feedbacks.map(function(feedback) {
    return `<tr><td>${date}</td><td>${feedback.name}</td><td>${feedback.comment}</td></tr><br>`
  })
  table = table.join("");
  return `<table><tr></tr>${table}</table>`;
}


const storeFeedBack = function(url) {
  let userInfo = arrangeUserFeedBack(url);
  feedbacks.unshift(userInfo);
  console.log("storing feedback");
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

exports.makeFeedbackTable = makeFeedbackTable;
exports.updateGuestPage = updateGuestPage;
exports.storeFeedBack = storeFeedBack;
