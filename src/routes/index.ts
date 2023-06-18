import * as express from 'express'

import{ HelloWorldController } from '../controllers/helloWorldController';

const router = express.Router();

router.get('/helloworld', (req, res) => new HelloWorldController().execute(req, res));

export default router