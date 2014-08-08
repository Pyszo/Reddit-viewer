Reddit-viewer
=============

Angularjs app that showing newest articles from reddit.com

##Features of app##

###Main view###

Main view display newest links from reddit.com in 9 slots (3 each row). Every slot contain a title of article, name of author, name of category, and thumbnail (if exist). U can display another links by clicking on "Older" button, back to newer links by clicking "Newer" button or refresh content of page (download the newest links) by clicking on "Refresh" button.

On right side of page there is a container when you can drop dragged slots with links. After dropping, dropped link will be displayed on this container until you refresh/close the whole page. You can use this container for marking articles that you want to see later. To remove article from container click on "Remove".

Main view adjust automatically to size of browser window. In small windows (like in tablets), right container is on bottom of the page. In very small windows (like in phones), there is no drop container, and slots with links are placed one under another.

###Article view###

After clicking on title of article in main view, you are moved to article view. In article view u can see content of article and top comments. After clicking on title, you are moved to new window/tab that open attached link. To back to main view click on "back" button". To add a comment or reply to comment click on "Add own comment" or "reply". It will shown form, where u have to write your nick and content. After clicking on "Save" comment will be added to current view. Press "cancel" to hide form. Comments have fake endpont, so it won't be send to reddit.com. It's just displayed until you close current view. 

##How to run app##

To run this app you only need to donwload folder "minified" and run local server from it.

##Tests##

App is enclosed with unit tests created with Jasmine 2.0.0. To run tests open SpecRunner.html in your browser. Specs files are in folder "spec".

##Minification##

Are files necessary to run app were minified using Grunt (see package.json and Gruntfile.js). All minified files (js, css, html) are in "minified" folder.

##Files and folders##

- "minified/" - minified version of app
- "node_modules/" - Grunt modules
- "spec/" - test files: Spec.js testing js.js file, CommentsSpec.js testing comments.js file
- "static/lib/" - all used libs (more info below)
- "static/js/" - javascript files of app: js.js is a main file, comments.js cointain controllers for adding comments, directives.js contain all used directives that have tamplates in "template" folder.
- "static/ccs/" - css file of app

- "Gruntfile.js" - configuration of Grunt modules
- "index.html" - main page of app (not minified version)
- "SpecRunner.html" - runnig tests
- ##Used frameworks and libraries##

- AngularJS - 1.2.20
- Bootstrap - 3.2.0
- Jasmine - 2.0.0
- Angular DragDrop directive by Ganaraj.Pr
- Grunt - 0.4.5
- cssmin - 0.10.0
- htmlmin - 0.3.0
- uglify - 0.5.1
