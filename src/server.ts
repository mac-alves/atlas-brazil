import dotenv from 'dotenv';
dotenv.config()

import express from 'express';
import path from 'path';
import http from 'http';
import routes from './routes';
import { config, engine } from 'express-edge'

const app = express();
const server = http.createServer(app);

app.use(engine)
app.use(express.static(path.join(__dirname, '..', 'public')));
app.set('views', path.join(__dirname, 'views'));
app.use(routes);

/**
 * Inicialização do servidor
 */
server.listen(process.env.PORT || 3000, () => {
	console.log(
		`Server iniciado em: ${process.env.APP_URL}`
	);
});