const Comment = function(name,comment) {
  this.name=name;
  this.comment = comment;
  this.data = new Date().toLocaleString();
}


Comment.prototype={
  getName : function() {
    return this.name;
  },
  getDate : function() {
    return this.data;
  },
  getComment : function() {
    return this.comment;
  }
}


exports.Comment=Comment;
