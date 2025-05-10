import express from 'express';

import { index } from '../controllers/home.mjs';

const router = express.Router();

router.get('/', index);

export default router;
