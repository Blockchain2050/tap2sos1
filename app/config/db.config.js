module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "password",
  DB: "tap2sos",
  dialect: "mysql",
  port:"3306",
  
  dialectOptions: {
    charset: 'utf8',
    collate: 'utf8_general_ci',
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

// module.exports = {
//   host: "10.245.225.153",
//   username: "db",
//   password: "IM8Nij6EN9XEOtbV",
//   database: "db",
//   dialect: "postgres",
//   port:6432,
 
  
//   dialectOptions: {
//     charset: 'utf8',
//     collate: 'utf8_general_ci'  },
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 50000,
//     idle: 50000
//   }
// };

