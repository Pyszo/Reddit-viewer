var app=angular.module('redditViewer', ['ngDragDrop', 'comments', 'directives']);

//Download links/comments from reddit.com

app.controller('feedCtrl', ['$http', '$scope', function($http, $scope){
	$scope.limit = 90;	//maximum number of requested links. Max 100, min 9, should be multiple of 9
	$scope.count = 0;
	$scope.feed = function(before, after){
		if (before == null){
			if (after == null){	//feed(null, null) - downloading newest links. Using at first load and while using refresh button
				$http({method: 'GET', url: 'http://www.reddit.com/new.json?limit='+$scope.limit})
					.success(function(data){
						$scope.entries = data.data.children;
						$scope.after = data.data.after;
						$scope.before = data.data.before;
						$scope.count = $scope.count + $scope.limit;
					})
					.error(function(data, status){
						console.log(status);
						alert("It's something wrong with reddit.com. Try to refresh the page latter");
					});
			}else{	//feed(null, after) - downloading new links after "after"
				$http({method: 'GET', url: 'http://www.reddit.com/new.json?after='+after+'&limit='+$scope.limit+'&count='+$scope.count})
					.success(function(data){
						$scope.entries = data.data.children;
						$scope.after = data.data.after;
						$scope.before = data.data.before;
						$scope.count = $scope.count + $scope.limit;
					})
					.error(function(data, status){	//It may happend if link with id "after" was deleted
						console.log(status);
						$scope.count = 0;
						$scope.feed(null, null);
					});

			};
		}else{	//feed(before, anything) - downloading new links before "before"
			$http({method: 'GET', url: 'http://www.reddit.com/new.json?before='+before+'&limit='+$scope.limit+'&count='+$scope.count})
				.success(function(data){
					$scope.entries = data.data.children;
					$scope.after = data.data.after;
					$scope.before = data.data.before;
					$scope.count = $scope.count - $scope.limit;
					if($scope.count == $scope.limit)$scope.before = null;	//no before at 1st page
				})
				.error(function(data, status){	//It may happend if link with id "before" was deleted
					console.log(status);
					$scope.count = 0;
					$scope.feed(null, null);
				});
		};

	};
//Downloading content and comments of one entry. Comments are sort by rate. Comments are downloading up to 10 replies.
	$scope.contentFeed = function(id){	
		$http({method: 'GET', url: 'http://www.reddit.com/comments/'+id+'.json?depth=10&sort=top'})
			.success(function(data){
				$scope.entryData = data;
			})
			.error(function(data, status){	//It may happend if link was deleted
				console.log(status);
				$scope.contentView = false;
				alert("Entry that u are trying to see was deleted, try another one");
				
			});
	};
	$scope.feed(null, null);	//initial call
	$scope.startIndex = 0;		//initial index of first link
	$scope.rowIndex = [0,1,2];
	$scope.columnIndex = [0,1,2];
	$scope.contentView = false;				//content view is disabled on page load
}]);

//Paginate controller (buttons older, newer and refresh)

app.controller('paginateCtrl', ['$scope', function($scope){
	$scope.older = function(){					//button older
		if($scope.startIndex+9 < $scope.limit){			//if links are downloaded
			$scope.startIndex = $scope.startIndex + 9;
		}else{							//if need to download new links from api
			$scope.feed(null, $scope.after);
			$scope.startIndex = 0;
		};
	};

	$scope.newer = function(){					//button newer
		if($scope.startIndex == 0){
			if($scope.before != null){			//if need to download new links from api
				$scope.feed($scope.before, null);
				$scope.startIndex = $scope.limit - 9;
			};
		}else{							//if links are downloaded
			$scope.startIndex = $scope.startIndex - 9
			if($scope.startIndex < 0)$scope.startIndex = 0;
		};
	};

	$scope.refresh = function(){					//button refresh - move user to 1st page with fresh newest links
		$scope.count = 0;
		$scope.feed(null, null);
		$scope.startIndex = 0;
	};
}]);

app.controller('dragDropCtrl', ['$scope', function($scope){	//using Angular DragDrop directive by Ganaraj.Pr
	$scope.toRead = [];					//links to read are saving to this array

	$scope.dropSuccessHandler = function($event){
	};
	

	$scope.onDrop = function($event,$data,array){
		array.push($data);				//adding dropped link to array
	};

	$scope.remove = function(index, array){
		array.splice(index, 1);				//deleting link from array
	};
}]);

app.controller('entrySlotCtrl', function(){		//count index of entry in entries array
	this.index = function(startIndex, col, row){
		return startIndex+col+row*3;
	};
});

//Content View

app.controller('contentCtrl', ['$scope', '$filter', function($scope, $filter){
	$scope.checkContent = function(id){			//showing content view of one entry with "id"
		$scope.contentFeed(id);
		$scope.contentView = true;
	}
	$scope.isThumb = function(url){				//checking if entry have correct thumbnail
		return $filter('limitTo')(url, 4) == 'http';	//some thumbnail in Reddit are like "self", "default", etc.
	};							//and we don't want to see them
}]);


