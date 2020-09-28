// ===============================
// PUERTO
// ===============================

process.env.PORT = process.env.PORT || 3000;

//=================================
// ENTORNO
//=================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=================================
// BASE DE DATOS
//=================================

let uriDB;

if (process.env.NODE_ENV === 'dev') {
    uriDB = "mongodb://localhost:27017/test1?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false"
} else {
    uriDB = process.env.MONGO_URI;
}

process.env.URLDB = uriDB;

// ===============================
// CLIENT_ID
// ===============================

process.env.CLIENT_ID = process.env.CLIENT_ID || '185779368046-h2g5mpgfv68rv55bpad4b2q0sd39ap6d.apps.googleusercontent.com';

//=================================
// CADUCIDAD TOKEN
//=================================

process.env.TOKEN_EXPIRED = '24h';

//=================================
// SEMILLA TOKEN
//=================================

process.env.SEED = process.env.SEED || 'seed-token-dev';