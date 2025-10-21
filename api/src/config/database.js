const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT || '1433'),
    dialect: process.env.DB_DIALECT || 'mssql',
    dialectOptions: {
      encrypt: process.env.DB_ENCRYPT === 'true',
      trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
      requestTimeout: 30000,
      options: {
        enableArithAbort: true,
        cryptoCredentialsDetails: {
          minVersion: 'TLSv1'
        }
      }
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: (msg) => {
      if (process.env.NODE_ENV === 'development') {
        logger.debug(msg);
      }
    },
    define: {
      timestamps: false,
      freezeTableName: true
    },
    benchmark: true
  }
);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info('✓ Conexión exitosa a SQL Server');
    return true;
  } catch (error) {
    logger.error('✗ Error al conectar con SQL Server:', error.message);
    return false;
  }
};

module.exports = {
  sequelize,
  testConnection
};
