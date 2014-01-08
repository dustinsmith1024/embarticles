// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require_tree .

window.onbeforeunload = function(){
    return false; // This will stop the redirecting.
}

App = Ember.Application.create();

App.Router.map(function() {
  this.resource("espn_articles", function(){
    this.route("view", { path: '/:espn_article_id' });
  });
  this.resource("articles", function() {
    this.route("new", { path: '/new' });
    this.route("edit", { path: '/:article_id/edit' });
    this.route("view", { path: '/:article_id' });
  });
  
});

/*
App.Router.map(function() {
  this.resource("articles", function(){
    this.route("show", { path: "/:article_id" });
  });
});*/

/*
App.Router.map(function() {
  this.resource("articles", function(){
    this.resource("article", { path: '/:id' });
  });
});
*/

App.IndexRoute = Ember.Route.extend({
  redirect: function() {
   this.transitionTo('articles'); 
  }
});

//App.Article = Ember.Object.extend({
//  name: '',
//  day: ''
//});

App.Store = DS.Store.extend({
  //adapter: DS.FixtureAdapter.create()
  adapter: DS.RESTAdapter.create({
    url: 'http://localhost:3000'
  })
});

/*
DS.RESTAdapter.reopen({
  url: 'http://localhost:3000'
});*/

App.EspnArticle = DS.Model.extend({
  shortLinkText: DS.attr('string'),
  //date: DS.attr('date'),
  headline: DS.attr('string'),
  description: DS.attr('string'),
  source: DS.attr('string'),
  link_text: DS.attr('string'),

});

App.Article = DS.Model.extend({
  title: DS.attr('string'),
  //date: DS.attr('date'),
  headline: DS.attr('string'),
  description: DS.attr('string'),
  source: DS.attr('string'),
  link_text: DS.attr('string'),

  displayName: function() {
    return this.get('title') + ' ' + this.get('headline');
  }.property('title', 'headline')
});

/*App.Article.FIXTURES = [
  { id: 1, name: 'Trek', date: '2012-03-04', authorFirstName: 'Dustin', authorLastName:'Smith', content: 'this is the article!!!', url: 'http://espn.com' },
  { id: 2, name: 'Tom', date: '2013-03-05', authorFirstName: 'Justin', authorLastName:'Hegg' , content: 'this is the article', url: 'http://smith1024.com' }
];*/

App.ArticlesRoute = Ember.Route.extend(
  {//Not sure why but its forcing me to define these routes
    model: function() {
      console.log('articlesss');
      return App.Article.find();
    },
    events: {
      createArticle: function(){
        var articles = this.modelFor('articles');
        var article = App.Article.createRecord({id: articles.length});
        this.transitionTo('articles.edit', article);
      }
    }
});

App.EspnArticlesRoute = Ember.Route.extend(
  {
    model: function() {
      // the server returns `{ id: 12 }`
      console.log('darticles!');
      var rdata = [];
      return jQuery.getJSON("http://api.espn.com/v1/sports/news/headlines", {
        // enter your developer api key here
        apikey: "8hu4nra8956f8kymyq955j33",
        // the type of data you're expecting back from the api
        _accept: "application/json"
      }).then(function(data){
        console.log(data.headlines);
        console.log('its here!');
        return data.headlines;
      });
    },

    serialize2: function(model) {
      console.log(model);
      console.log(model.headlines)
      return { headlines: model.headlines };
    }
});

App.ArticlesViewRoute = Ember.Route.extend(
  {
    model: function(params) {
      console.log(params);
      return App.Article.find(params.article_id);
    }    
});

App.EspnArticlesViewRoute = Ember.Route.extend(
  {
    model: function(params) {
      console.log('y?', params);
      return jQuery.getJSON("http://api.espn.com/v1/sports/news/" + params.espn_article_id, {
        // enter your developer api key here
        apikey: "8hu4nra8956f8kymyq955j33",
        // the type of data you're expecting back from the api
        _accept: "application/json"
      }).then(function(data){
        console.log(data.headlines);
        console.log('its here!');
        return data.headlines[0];
      }).then(function(data){
        jQuery.get(data.links.web.href);
      });
    }    
});

App.ArticlesNewRoute = Ember.Route.extend(
  {
    model: function(params) {
      console.log(params);
      return App.Article.createRecord();
    },
    events: {
      save: function(){
        console.log('do save!');
        var article = this.modelFor('articles.new');
        var that = this;
        article.save().then(function(){
          //console.log('saved!', article, article.get('id'), article.get('isDirty'), article.get('isNew'));
          //App.Article.find();
          that.transitionTo('articles');
        });
      }
    }
});

App.ArticlesEditRoute = Ember.Route.extend(
  {
    model: function(params) {
      console.log(params);
      return App.Article.find(params.article_id);
    },
    events: {
      save: function(){
        console.log('save!');
        var article = this.modelFor('articles.edit');
        article.save();
        this.transitionTo('articles.view', article);
      },
      delete: function(){
        console.log('delete');
        var article = this.modelFor('articles.edit');
        article.deleteRecord();
        article.save();
        this.transitionTo('articles');
      }
    }
});

App.ClickableView = Ember.View.extend({
  click: function(evt) {
    alert("ClickableView was clicked!");
  }
});

//Use controller to set things up
App.ArticlesController = Ember.ArrayController.extend({
  title: 'Articles'
});

App.EspnArticlesController = Ember.ArrayController.extend({
  title: 'Darticles'
});
