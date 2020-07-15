pw = process.env.IC_DBPassword;
thedb = process.env.IC_Database;
module.exports = {
      HOST: "icweb-db",
      USER: "root",
      PASSWORD: pw,
      DB: thedb,
      dialect: "mysql",
      pool: {
              max: 20,
              min: 0,
              acquire: 30000,
              idle: 10000
            }
};
