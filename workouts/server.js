var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser')

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 9900);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'));

app.get('/',function(req,res,next){
    res.render('home');
});

app.get('/get-workouts', function(req, res) {
  var content = {};
  mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields) {
      if (err) {
        next(err);
        return;
      }
      content.results = JSON.stringify(rows);
      res.send(content);
  });
});

app.get('/get-a-workout', function(req, res) {
  var content = {};
  mysql.pool.query('SELECT * FROM workouts WHERE id=?', [req.query.id], function(err, rows, fields) {
      if (err) {
        next(err);
        return;
      }
      content.results = JSON.stringify(rows);
      res.send(content.results);
  });
});

app.get('/submit',function(req,res,next){
  if (req.query.name != ''){
    var context = {};
    mysql.pool.query("INSERT INTO workouts (`name`, `weight`, `lbs`, `reps`, `date`) VALUES (?,?,?,?,?)",
    [req.query.name, req.query.weight, req.query.weightUnit, req.query.reps, req.query.date],
    function(err, result){
      if(err){
        next(err);
        return;
      }
      context.results = "Inserted id " + result.insertId;
      res.status(200).json(result.insertId);
    });
  }

});

app.get('/delete',function(req,res,next){
  var context = {};
  mysql.pool.query("DELETE FROM workouts WHERE id=?", [req.query.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    res.render('home');
  });
});


app.get('/edit-row', function(req, res) {
      res.render('edit');
  });


app.get('/edit-save',function(req,res,next){
  var context = {};
  mysql.pool.query("SELECT * FROM workouts WHERE id=?", [req.query.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    if(result.length == 1){
      var curVals = result[0];
      mysql.pool.query("UPDATE workouts SET name=?, weight=?, lbs=?, reps=?, date=? WHERE id=? ",
        [req.query.name || curVals.name, req.query.weight || curVals.weight, req.query.lbs || curVals.lbs,
         req.query.reps || curVals.reps, req.query.date   || curVals.date, req.query.id],
        function(err, result){
        if(err){
          next(err);
          return;
        }
        context.results = "Updated " + result.changedRows + " rows.";
        res.render('home');
      });
    }
  });
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
})

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});