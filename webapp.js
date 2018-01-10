const fs = require('fs');
const toKeyValue = kv=>{
  let parts = kv.split('=');
  return {key:parts[0].trim(),value:parts[1].trim()};
};

const getContentType = function(filename) {
  let fileType = filename.slice(filename.lastIndexOf("."));
  let types = {
    ".jpg": "img/jpg",
    ".jpeg": "img/jepg",
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".gif": "img/gif",
    ".pdf": "text/pdf",
    ".png": "img/png",
    ".txt": "text/txt"
  }
  return types[fileType];
}

const readFileContents = function(response,fileName) {
  fileName = `./public${fileName}`;
  fs.readFile(fileName,(err,data)=>{
    if (err) {
      response.statusCode
      response.write("File Not Found"+fileName);
      response.end();
      return;
    }
    response.setHeader("Content-type",getContentType(fileName));
    response.write(data);
    response.end();
  })
}

const accumulate = (o,kv)=> {
  o[kv.key] = kv.value;
  return o;
};

const parseBody = text=> text && text.split('&').map(toKeyValue).reduce(accumulate,{}) || {};

let redirect = function(path){
  console.log(`redirecting to ${path}`);
  this.statusCode = 302;
  this.setHeader('location',path);
  this.end();
};

const parseCookies = text=> {
  try {
    return text && text.split(';').map(toKeyValue).reduce(accumulate,{}) || {};
  }catch(e){
    return {};
  }
}

let invoke = function(req,res){
  let handler = this._handlers[req.method][req.url];
  if(handler){
    handler(req,res);
  }
  return;
}

const initialize = function(){
  this._handlers = {GET:{},POST:{}};
  this._preprocess = [];
};
const get = function(url,handler){
  this._handlers.GET[url] = handler;
}
const post = function(url,handler){
  this._handlers.POST[url] = handler;
};
const use = function(handler){
  this._preprocess.push(handler);
};
let urlIsOneOf = function(urls){
  return urls.includes(this.url);
}

const main = function(req,res){
  res.redirect = redirect.bind(res);
  req.urlIsOneOf = urlIsOneOf.bind(req);
  req.cookies = parseCookies(req.headers.cookie||'');
  let content="";
  req.on('data',data=>content+=data.toString())
  req.on('end',()=>{
    req.body = parseBody(content);
    content="";
    debugger;
    this._preprocess.forEach(middleware=>{
      if(res.finished) return;
      middleware(req,res);
    });
    if(res.finished) return;
    console.log(req.url);
    invoke.call(this,req,res);
    if (res.finished) return;
    readFileContents(res,req.url);
  });
};

let create = ()=>{
  let rh = (req,res)=>{
    main.call(rh,req,res)
  };
  initialize.call(rh);
  rh.get = get;
  rh.post = post;
  rh.use = use;
  return rh;
}
exports.create = create;
