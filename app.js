
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');
var marked = require('marked');
var recipes = require('./recipes/index.json');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('view options', { layout: false, root: path.join(__dirname, 'views') });
app.engine('html', require('ejs').renderFile);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res){
  res.render('index.html', { recipes: recipes });
});

app.get('/:name', function(req, res, next){
  var name = req.params.name;
  var recipe;
  for (var i = 0, n = recipes.length; i < n; i++){
    recipe = recipes[i];
    if (recipe.name == name) {
      break;
    }
    recipe = null;
  }

  if (!recipe) return next(new Error('failed to find recipe'));

  res.render('recipe.html', { recipe: recipe });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

function loadRecipes() {
  for (var i = 0, n = recipes.length; i < n; i++){
    var recipe = recipes[i]; 
    var filePath = path.join('recipes', recipe.name + '.md');
    if (!fs.existsSync(filePath)) continue;
    var content = fs.readFileSync(filePath, 'utf-8');
    recipe.content = marked(content);
  }
}

loadRecipes();