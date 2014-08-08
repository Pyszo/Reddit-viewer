describe('comments', function(){
	var scope, controller;
	beforeEach(function(){
		module('comments');
	});

	describe('replyCtrl', function(){
		beforeEach(inject(function($controller){
			controller = $controller('replyCtrl');
		}));

		it('not showing reply form at start', function(){
			expect(controller.showForm).toBeFalsy;
		});

		it('adding reply as a child of parent comment and hide form', function(){
			controller.showForm = true;
			var data = {parent:{data:{replies: ""}}};
			controller.addReply(data.parent, 'Pyszo', 'First!');
			expect(data.parent.data.replies.data.children[0].data.author).toEqual("Pyszo");
			expect(data.parent.data.replies.data.children[0].data.body).toEqual("First!");
			expect(data.parent.data.replies.data.children[0].data.score).toEqual(0);
			expect(data.parent.data.replies.data.children[0].data.replies).toEqual("");
			expect(controller.showForm).toBeFalsy;
		});
	});

	describe('newCommentCtrl', function(){
		beforeEach(inject(function($controller){
			controller = $controller('newCommentCtrl');
		}));

		it('not showing comment form at start', function(){
			expect(controller.showForm).toBeFalsy;
		});

		it('adding new comment', function(){
			controller.showForm = true;
			var data = [];
			controller.addReply(data, 'Pyszo', 'First!');
			expect(data[0].data.author).toEqual("Pyszo");
			expect(data[0].data.body).toEqual("First!");
			expect(data[0].data.score).toEqual(0);
			expect(data[0].data.replies).toEqual("");
			expect(controller.showForm).toBeFalsy;
			controller.addReply(data, 'AlwaysSecond', 'Always...');
			expect(data[0].data.author).toEqual("AlwaysSecond");
			expect(data[0].data.body).toEqual("Always...");
			expect(data[0].data.score).toEqual(0);
			expect(data[0].data.replies).toEqual("");
			expect(controller.showForm).toBeFalsy;
		});
	});
});
