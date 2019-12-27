'use strict'


//puerto
process.env.PORT = process.env.PORT || 3000;


//entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//tiempo de vida del token
process.env.LIFE_TOKEN = '48h';

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


//id google
process.env.CLIENT_ID = process.env.CLIENT_ID || '791583185481-f9n4hhihrp78e9eck6rs0i5bqdeer965.apps.googleusercontent.com' ;