import express from 'express';
import { checkLogin, registerUser } from '../controller/auth.js';

const router = express.Router();

router.post('/registeruser' , registerUser);
router.post('/checklogin' , checkLogin);

export default router;