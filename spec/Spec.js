describe('redditViewer', function(){
	var scope, controller;
	beforeEach(function(){
		module('redditViewer');
	});

	describe('feedCtrl', function(){
		beforeEach(inject(function($rootScope, $controller, _$httpBackend_){
			httpBackend = _$httpBackend_;
			scope = $rootScope.$new();
			spyOn(window, 'alert').and.callFake(function(m){});
			console.log = jasmine.createSpy("log");
			controller = $controller('feedCtrl', {'$scope': scope});
		}));

		it('have corrent limit of requested links', function(){
			expect(scope.limit).toBeLessThan(101);
			expect(scope.limit).toBeGreaterThan(8);
		});

		it('have corrent initial values', function(){
			expect(scope.count).toEqual(0);
			expect(scope.startIndex).toEqual(0);
			expect(scope.rowIndex).toEqual([0,1,2]);
			expect(scope.columnIndex).toEqual([0,1,2]);
		});

		it('making content view not showed on page load', function(){
			expect(scope.contentView).toBeFalsy();
		});
	
		it('download fresh data of newest links', function(){
			httpBackend.whenGET('http://www.reddit.com/new.json?limit='+scope.limit).respond({
				data:{
					children:[
						{
							data:{
								title: "it's a title!",
								author: "Someone"
							}
						},{
							data:{
								title: "Hope it's gonna works",
								author: "Me"
							}
						}
					],
					after: "t1_abc123",
					before: null
				}
			});
			httpBackend.flush();
			expect(scope.after).toEqual("t1_abc123");
			expect(scope.before).toEqual(null);
			expect(scope.entries[1].data.author).toEqual("Me");
			expect(scope.entries[0].data.title).toEqual("it's a title!");
			expect(scope.count).toEqual(scope.limit);
		});

		it('download fresh data of newest links after "after" or before "before"', function(){
			httpBackend.whenGET('http://www.reddit.com/new.json?limit='+scope.limit).respond({
				data:{
					children:[
						{
							data:{
								title: "it's a title!",
								author: "Someone"
							}
						},{
							data:{
								title: "Hope it's gonna works",
								author: "Me"
							}
						}
					],
					after: "t1_abc123",
					before: null
				}
			});
			httpBackend.whenGET('http://www.reddit.com/new.json?after=t1&limit='+scope.limit+'&count='+scope.count).respond({
				data:{
					children:[
						{
							data:{
								title: "Something",
								author: "Someone"
							}
						},{
							data:{
								title: "Hope it's gonna works",
								author: "Meeeee"
							}
						}
					],
					after: "t1",
					before: "t3"
				}
			});



			scope.feed(null,"t1");
			scope.$digest();
			httpBackend.flush();
			expect(scope.after).toEqual("t1");
			expect(scope.before).toEqual("t3");
			expect(scope.entries[1].data.author).toEqual("Meeeee");
			expect(scope.entries[0].data.title).toEqual("Something");
			expect(scope.count).toEqual(2*scope.limit);

			httpBackend.whenGET('http://www.reddit.com/new.json?before=t3&limit='+scope.limit+'&count='+scope.count).respond({
				data:{
					children:[
						{
							data:{
								title: "Something here",
								author: "Someone"
							}
						},{
							data:{
								title: "Hope it's gonna works",
								author: "noname"
							}
						}
					],
					after: "t3",
					before: "t5"
				}
			});

			scope.feed("t3","something");
			scope.$digest();
			httpBackend.flush();
			expect(scope.after).toEqual("t3");
			expect(scope.before).toEqual(null);
			expect(scope.entries[1].data.author).toEqual("noname");
			expect(scope.entries[0].data.title).toEqual("Something here");
			expect(scope.count).toEqual(scope.limit);

		});

		it('download content of entry with top comments', function(){
			httpBackend.whenGET('http://www.reddit.com/new.json?limit='+scope.limit).respond({
				data:{children:[{data: "data"}],after: "t1_abc123",before: null}
			});
			httpBackend.whenGET('http://www.reddit.com/comments/id.json?depth=10&sort=top').respond({
				data: "such data, wow"
			});

			scope.contentFeed('id');
			scope.$digest();
			httpBackend.flush();
			expect(scope.entryData.data).toEqual("such data, wow");
		});

		it('can handle errors', function(){
			httpBackend.whenGET('http://www.reddit.com/new.json?limit='+scope.limit).respond(404, '');
			httpBackend.flush();
			expect(window.alert.calls.any).toBeTruthy();
			expect(console.log).toHaveBeenCalledWith(404);
			expect(scope.count).toEqual(0);
			window.alert.calls.reset();
			console.log.calls.reset();

			httpBackend.whenGET('http://www.reddit.com/new.json?after=t1&limit='+scope.limit+'&count='+scope.count).respond(404, '');
			scope.feed(null, 't1');
			scope.$digest();
			httpBackend.flush();
			expect(window.alert.calls.count()).toEqual(1);
			expect(console.log.calls.allArgs()).toEqual([[404],[404]]);
			expect(scope.count).toEqual(0);
			window.alert.calls.reset();
			console.log.calls.reset();

			httpBackend.whenGET('http://www.reddit.com/new.json?before=t3&limit='+scope.limit+'&count='+scope.count).respond(404, '');
			scope.feed('t3', 't1');
			scope.$digest();
			httpBackend.flush();
			expect(window.alert.calls.count()).toEqual(1);
			expect(console.log.calls.allArgs()).toEqual([[404],[404]]);
			expect(scope.count).toEqual(0);
			window.alert.calls.reset();
			console.log.calls.reset();

			httpBackend.whenGET('http://www.reddit.com/comments/id.json?depth=10&sort=top').respond(404, '');
			scope.contentFeed('id');
			scope.$digest();
			httpBackend.flush();
			expect(console.log).toHaveBeenCalledWith(404);
			expect(scope.contentView).toBeFalsy();
			expect(window.alert.calls.any()).toBeTruthy();
		});
	});

	describe('paginateCtrl', function(){
		beforeEach(inject(function($rootScope, $controller){
			scope = $rootScope.$new();
			controller = $controller('paginateCtrl', {'$scope': scope});
			scope.startIndex = 0;
			scope.limit = 18;
			scope.after = 't3';
			scope.before = 't5';
			scope.feed = function(a,b){};
			spyOn(scope, 'feed');
		}));

		it('showing older links', function(){
			scope.older();
			expect(scope.startIndex).toEqual(9);
			expect(scope.feed.calls.any()).toBeFalsy();
			scope.older();
			expect(scope.startIndex).toEqual(0);
			expect(scope.feed.calls.any()).toBeTruthy();
			expect(scope.feed.calls.argsFor(0)).toEqual([null, 't3']);
		});

		it('showing newer links', function(){
			scope.newer();
			expect(scope.startIndex).toEqual(9);
			expect(scope.feed.calls.any()).toBeTruthy();
			expect(scope.feed.calls.argsFor(0)).toEqual(['t5', null]);
			scope.feed.calls.reset();
			scope.newer();
			expect(scope.startIndex).toEqual(0);
			expect(scope.feed.calls.any()).toBeFalsy();
		});

		it('showing newest links on first page', function(){
			scope.count = 180;
			scope.startIndex = 27;
			scope.refresh();
			expect(scope.startIndex).toEqual(0);
			expect(scope.count).toEqual(0);
			expect(scope.feed.calls.any()).toBeTruthy();
			expect(scope.feed.calls.argsFor(0)).toEqual([null, null]);
		});
	});

	describe('dragDropCtrl', function(){
		var array = [];
		beforeEach(inject(function($rootScope, $controller){
			scope = $rootScope.$new();
			controller = $controller('dragDropCtrl', {'$scope': scope});
		}));

		it('push value into array after drop', function(){
			scope.onDrop(null, 'dat data', array);
			expect(array).toEqual(['dat data']);
			scope.onDrop(null, 'more data', array);
			expect(array).toEqual(['dat data','more data']);
		});

		it('delete value from array after clicking on remove', function(){
			scope.remove(1, array);
			expect(array).toEqual(['dat data']);
		});
	});

	describe('entrySlotCtrl', function(){
		beforeEach(inject(function($controller){
			controller = $controller('entrySlotCtrl');
		}));

		it('count index of entry in entries array', function(){
			expect(controller.index(0,0,0)).toEqual(0);
			expect(controller.index(9,1,2)).toEqual(16);
		});
	});

	describe('contentCtrl', function(){
		beforeEach(inject(function($rootScope, $controller){
			scope = $rootScope.$new();
			controller = $controller('contentCtrl', {'$scope': scope});
			scope.contentFeed = function(id){};
			spyOn(scope, 'contentFeed');
		}));

		it('downloading and showing content view', function(){
			scope.checkContent('id');
			expect(scope.contentView).toBeTruthy();
			expect(scope.contentFeed.calls.any).toBeTruthy();
			expect(scope.contentFeed.calls.argsFor(0)).toEqual(['id']);
		});

		it('checking if entry have correct thumbnail', function(){
			expect(scope.isThumb('http://www.page.com/my.jpg')).toBeTruthy();
			expect(scope.isThumb('self')).toBeFalsy();
			expect(scope.isThumb('default')).toBeFalsy();
			expect(scope.isThumb('')).toBeFalsy();
		});
	});

});
