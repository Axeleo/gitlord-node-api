

const express = require('express');
const app = express();
// use later if using post requests
// app.use(bodyParser.urlencoded({
//   extended: true
// }));
// const bodyParser = require('body-parser');

const port = 8000;

require('./app/routes')(app);

app.listen(port, () => {
  console.log('We are live on ' + port);
});

