import express from 'express';
const routes = express.Router();

routes.get('/', (request, response) => {
    return response.render('index')
});

export default routes;