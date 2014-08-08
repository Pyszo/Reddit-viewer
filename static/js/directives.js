var app = angular.module('directives', []);

app.directive('entrySlot', function(){	//View of single link in main view
	return{
		restrict: 'E',
		templateUrl: '/static/js/template/slot.html'
	}
});

app.directive('commentView', function(){	//View of single comment in content view
	return{
		restrict: 'E',
		templateUrl: '/static/js/template/comment.html'
	}
});

app.directive('commentsView', function(){	//View of all comments in content view
	return{
		restrict: 'E',
		templateUrl: '/static/js/template/comments.html'
	}
});

app.directive('entryContent', function(){	//View of entry in content view
	return{
		restrict: 'E',
		templateUrl: '/static/js/template/content.html'
	}
});

app.directive('pager', function(){	//View of pager (newer, older, refresh buttons) in main view
	return{
		restrict: 'E',
		templateUrl: '/static/js/template/pager.html'
	}
});

app.directive('dropContainer', function(){	//Drop container in main view
	return{
		restrict: 'E',
		templateUrl: '/static/js/template/container.html'
	}
});
