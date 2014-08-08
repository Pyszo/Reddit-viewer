var app = angular.module('comments', []);

//Mock reply to existing comment

app.controller('replyCtrl', function(){
	this.showForm = false;					//not showing form at start
	var t = this;
	this.addReply = function(child, author, body){
		if(child.data.replies == ""){			//if comment dont have any reply
			child.data.replies = {};		//we have to create new objects
			child.data.replies.data = {};
			child.data.replies.data.children = [];
		};
		var data = {};
		data.data = {};
		data.data.author = author;
		data.data.body = body;
		data.data.score = 0;					//setting score to 0pt
		data.data.replies = "";					//new comment dont have replies
		child.data.replies.data.children.splice(0,0,data);	//adding reply as first reply
		t.showForm = false;					//hide form after sending
	};
});

//Mock adding of new comment

app.controller('newCommentCtrl', function(){
	this.showForm = false;				//not showing form at start
	var t = this;
	this.addReply = function(child, author, body){
		var data = {};
		data.data = {};
		data.data.author = author;
		data.data.body = body;
		data.data.score = 0;				//setting score to 0pt
		data.data.replies = "";				//new comment dont have replies
		child.splice(0,0,data);				//adding comment as a first comment
		t.showForm = false;				//hide form after sending
	};
});
