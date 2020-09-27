const mongoose = require('mongoose');

mongoose.connect(process.env.URLDB,
    { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true }, (err, res) => {

        if (err) {
            console.log(err)
        } else {
            console.log('Conexión con la base de datos exitosa')
        }

    });

module.exports = mongoose