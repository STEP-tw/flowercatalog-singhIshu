let fs = require('fs');
const http = require('http');
const WebApp = require('./webapp');
const updateGuestPage = require('./storeFeedBack.js').updateGuestPage;
const storeFeedBack = require('./storeFeedBack.js').storeFeedBack;
const displayCommentPage = require('./storeFeedBack.js').displayCommentPage;
let registered_users = [{userName:'bhanutv',name:'Bhanu Teja Verma'},{userName:'ishusi',name:'Ishu Singh'}];
let toS = o=>JSON.stringify(o,null,2);



let logRequest = (req,res)=>{
  let text = ['--------------------------',
    `${req.method} ${req.url}`,
    `HEADERS=> ${toS(req.headers)}`,
    `COOKIES=> ${toS(req.cookies)}`,
    `BODY=> ${toS(req.body)}`,''].join('\n');
  fs.appendFile('request.log',text,()=>{});
}

let loadUser = (req,res)=>{
  let sessionid = req.cookies.sessionid;
  let user = registered_users.find(u=>u.sessionid==sessionid);
  if(sessionid && user){
    req.user = user;
  }
};

let redirectLoggedOutUserToLogin = (req,res)=>{
  if(req.urlIsOneOf(['/logout']) && !req.user) res.redirect('/index.html');
}


let app = WebApp.create();
app.use(logRequest);
app.use(loadUser);
app.use(redirectLoggedOutUserToLogin);
app.get('/',(req,res)=>{
  res.redirect('/index.html');
});

app.post('/feedback',(req,res)=>{
  storeFeedBack(req.body);
  res.redirect("/guestPage.html");
});

app.get("/guestPage.html",(req,res)=>{
  if (req.user) {
    let displayContents = updateGuestPage().replace("username",req.user.name);
    res.write(displayContents);
    res.end();
    return;
  }
});

app.get("/commentPage",(req,res)=>{
  if(req.user){
    res.redirect("/guestPage.html");
    return;
  }
  res.setHeader('Content-type','text/html');
  res.write(displayCommentPage());
  res.end();
})

app.get('/login',(req,res)=>{
  res.setHeader('Content-type','text/html');
  res.write(`<form method="POST"> <input name="userName"><input name="place"> <input type="submit"></form>`);
  res.end();
});

app.post('/login',(req,res)=>{
  let user = registered_users.find(u=>u.userName==req.body.userName);
  if(!user) {
    res.setHeader('Set-Cookie',`logInFailed=true`);
    res.redirect('/index.html');
    return;
  }
  let sessionid = new Date().getTime();
  res.setHeader('Set-Cookie',`sessionid=${sessionid}`);
  user.sessionid = sessionid;
  res.redirect('/guestPage.html');
});


app.get('/logout',(req,res)=>{
  delete req.user.sessionid;
  res.redirect('/login');
});

const PORT = 5000;
let server = http.createServer(app);
server.on('error',e=>console.error('**error**',e.message));
server.listen(PORT,(e)=>console.log(`server listening at ${PORT}`));
