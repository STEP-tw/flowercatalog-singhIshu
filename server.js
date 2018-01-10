let fs = require('fs');
const http = require('http');
const WebApp = require('./webapp');
const updateGuestPage = require('./feedbackHandlers.js').updateGuestPage;
const displayInvalidUser = require('./feedbackHandlers.js').displayInvalidUser;
const storeFeedBack = require('./feedbackHandlers.js').storeFeedBack;
const displayCommentPage = require('./feedbackHandlers.js').displayCommentPage;
let registered_users = [{userName:'bhanutv',name:'Bhanu Teja Verma'},{userName:'ishusi',name:'Ishu Singh'}];
let toS = o=>JSON.stringify(o,null,2);

let logRequest = (req,res)=>{
  let text = ['--------------------------',
    `${req.method} ${req.url}`,
    `HEADERS=> ${toS(req.headers)}`,
    `COOKIES=> ${toS(req.cookies)}`,
    `BODY=> ${toS(req.body)}`,''].join('\n');
  fs.appendFile('request.log',text,()=>{});
};

let loadUser = (req,res)=>{
  let sessionid = req.cookies.sessionid;
  let user = registered_users.find(u=>u.sessionid==sessionid);
  if(sessionid && user){
    req.user = user;
  }
};

let redirectLoggedOutUserToLogin = (req,res)=>{
  if(req.urlIsOneOf(['/logout']) && !req.user) res.redirect('/index.html');
};

const handleGuestPage = function(req,res) {
  if (req.user) {
    let displayContents = updateGuestPage().replace("username",req.user.name);
    res.write(displayContents);
    res.end();
    return;
  }
  res.redirect("/commentPage");
}

const handleCommentPage = function(req,res) {
  if(req.user){
    res.redirect("/guestPage.html");
    return;
  }
  res.setHeader('Content-type','text/html');
  res.write(displayCommentPage());
  res.end();
}

const handleLoginPage = function(req,res) {
  res.setHeader('Content-type','text/html');
  res.write(`<h2><a href="index.html"><<</a>home</h2><form method="POST"> <input name="userName"><input name="place"> <input type="submit"></form>`);
  res.end();
}

const handlePostLogin = function(req,res) {
  let user = registered_users.find(u=>u.userName==req.body.userName);
  if(!user) {
    res.redirect("/login");
    return;
  }
  let sessionid = new Date().getTime();
  res.setHeader('Set-Cookie',`sessionid=${sessionid}`);
  user.sessionid = sessionid;
  res.redirect('/guestPage.html');
}

const handleFeedbacks = function(req,res) {
  storeFeedBack(req.body);
  res.redirect("/guestPage.html");
}

const handleLogoutPage = function(req,res) {
  delete req.user.sessionid;
  res.redirect('index.html');
}

let app = WebApp.create();
app.use(logRequest);
app.use(loadUser);
app.use(redirectLoggedOutUserToLogin);
app.get('/',(req,res)=>{
  res.redirect('/index.html');
});

app.post('/feedback',handleFeedbacks);
app.get("/guestPage.html",handleGuestPage);
app.get("/commentPage",handleCommentPage);
app.get('/login',handleLoginPage);
app.post('/login',handlePostLogin);
app.get('/logout',handleLogoutPage);

const PORT = 5000;
let server = http.createServer(app);
server.on('error',e=>console.error('**error**',e.message));
server.listen(PORT,(e)=>console.log(`server listening at ${PORT}`));
