'use strict'


//puerto
process.env.PORT = process.env.PORT || 3000;


//entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//tiempo de vida del token
process.env.LIFE_TOKEN = 60 * 60 * 24 * 30;

//seed o VERIFY SIGNATURE
process.env.VERIFY_SIGNATURE = process.env.VERIFY_SIGNATURE || 'genrando-token-seguro-desarrollo';


//base de datos
let urlDB;

if (process.env.NODE_ENV === 'dev') {

    urlDB = 'mongodb://localhost:27017/cafe';
} else {

    urlDB = process.env.MONGO_URI;
}
process.env.urlDB = urlDB;