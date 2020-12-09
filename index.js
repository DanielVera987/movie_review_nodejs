const mongoose = require('mongoose');
const app = require('./app');

mongoose.connect('mongodb://127.0.0.1/moviesreview', { useNewUrlParser: true, useUnifiedTopology: true})
        .then(console.log('connected a the database'))
        .catch(err => console.log('failed db'))

app.listen(app.get('port'), () => {
  console.log(`app run in ${app.get('port')}`);
});