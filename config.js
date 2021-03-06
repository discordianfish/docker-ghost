var config,
    url = require('url'),
    path = require('path');

function getDatabase() {
  if (process.env.DATABASE_URL) {
    var dbUrl = url.parse(process.env['DATABASE_URL']);
    var auth = (dbUrl.auth || ':').split(':');
    var dbConfig = {
      client: dbUrl.protocol.slice(0, -1),
      connection: {
        host: dbUrl.hostname,
        user: auth[0],
        password: auth[1],
        port: dbUrl.port,
        database: dbUrl.pathname ? dbUrl.pathname.slice(1) : null
      }
    };
    return dbConfig;
  }

  if (process.env['DB_PORT']) {
    var dbUrl = url.parse(process.env['DB_PORT']);
    if (!process.env['DB_CLIENT'] || !process.env['DB_USER'] || !process.env['DB_PASSWORD'] || !process.env['DB_DATABASE']) {
      console.log("Environment variables DB_CLIENT, DB_USER, DB_PASSWORD and DB_DATABASE required when using Docker links");
      process.exit(1);
    }
    var dbConfig = {
      client: process.env['DB_CLIENT'],
      connection: {
        host: dbUrl.hostname,
        user: process.env['DB_USER'],
        password: process.env['DB_PASSWORD'],
        port: dbUrl.port,
        database: process.env['DB_DATABASE']
      }
    };
    return dbConfig;
  }
  var dbConfig = {
    client: 'sqlite3',
    connection: {
      filename: path.join(__dirname, '/content/data/ghost.db')
    },
    debug: false
  };
  return dbConfig;
}

function getMailConfig() {
  var mailConfig = {}
  if (process.env.MAIL_HOST)    { mailConfig['host']      = process.env.MAIL_HOST }
  if (process.env.MAIL_SERVICE) { mailConfig['service']   = process.env.MAIL_SERVICE }
  if (process.env.MAIL_USER) { mailConfig['auth']['user'] = process.env.MAIL_USER }
  if (process.env.MAIL_PASS) { mailConfig['auth']['pass'] = process.env.MAIL_PASS }
  return mailConfig;
}

if (process.env.NODE_ENV == "production" && !process.env.URL) {
  console.log("Please set URL environment variable to your blog's URL");
  process.exit(1);
}

server = {
  host: '0.0.0.0',
  port: '8080'
}

config = {
  production: {
    url: process.env.URL,
    database: getDatabase(),
    mail: getMailConfig(),
    server: server,
  },
  development: {
    url: "http://localhost",
    database: {
      client: 'sqlite3',
      connection: {
        filename: '/tmp/ghost-dev.db'
      }
    },
    server: server,
    debug: true
  }
};
module.exports = config;
