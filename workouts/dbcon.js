var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : '',
  user            : '',
  password        : '',
  database        : ''
});

pool.getConnection(function(err, connection) {
  if (err) throw err
  console.log('You are now connected...')
});

module.exports.pool = pool;