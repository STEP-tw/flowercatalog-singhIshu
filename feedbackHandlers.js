const fs = require('fs');
const feedbacks = require('./feedbacks.json');
const querystring = require('querystring');


const makeFeedbackRow = function(feedback) {
  let date = new Date().toLocaleString();
  let name = `<td>${feedback.name}</td>`;
  let comment = `<td>${feedback.comment}</td>`;
  return `<tr><td>${date}</td>${name}${comment}</tr>`;
}


const makeFeedbackTable = function() {
  let date = new Date().toLocaleString();
  let table = feedbacks.map(makeFeedbackRow);
  table = table.join("");
  return `<tr></tr>${table}`;
}

const displayCommentPage = function() {
  let commentPageContents = fs.readFileSync("public/commentPage.html","utf8");
  let tableHead = `<tr><th>Date</th><th>Name</th><th>Comment</th></tr>`;
  return `${commentPageContents}<table>${tableHead}${makeFeedbackTable()}</table>`;
}

const displayInvalidUser = function() {
  let commentPageContents = fs.readFileSync("public/commentPage.html","utf8");
  let invalidUserPage = commentPageContents.replace("Login To Add a Comment","Invalid userName Enter valid userName And login again");
  let tableHead = `<tr><th>Date</th><th>Name</th><th>Comment</th></tr>`;
  return `${invalidUserPage}<table>${tableHead}${makeFeedbackTable()}</table>`;
}

const storeFeedBack = function(url) {
  feedbacks.unshift(url);
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

exports.displayInvalidUser = displayInvalidUser;
exports.displayCommentPage = displayCommentPage;
exports.makeFeedbackTable = makeFeedbackTable;
exports.updateGuestPage = updateGuestPage;
exports.storeFeedBack = storeFeedBack;
