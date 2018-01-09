const fs = require('fs');
const querystring = require('querystring');
const Comment = require('./comment.js').Comment;

const Comments = function() {
  this.comment = 
}

const arrangeUserFeedBack = function(information) {
  return querystring.parse(information);
}

const storeFeedBack = function(data) {
  let feedbacks = JSON.parse(data);
  feedbacks.unshift(userInfo);
  let updateDatabase = JSON.stringify(feedbacks);
  fs.writeFile("./feedbacks.json", updateDatabase,function (err) {
    return;
  });
}


const readAndUpdateFeedBacks = function(response,url) {
  let userInfo = arrangeUserFeedBack(url);
  fs.readFile("./feedbacks.json",(err,feedbacks)=> {
    if (err) {
      response.write("File Not Found");
      return;
    }
    storeFeedBack
  })

}
