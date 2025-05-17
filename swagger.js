const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Contacts API',
    description: 'Manage contacts database'
  },
  host: "aaroncdee-cse341-contacts-api.onrender.com",
  schemes: ["https"]
};

const outputFile = './swagger.json';
const routes = ['./app.mjs'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);
