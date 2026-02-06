import { Router } from "express";
import { BalanceController } from '@controllers/balance.controller.js';


const balanceRoutes = Router();

balanceRoutes.get('/balance', BalanceController.getBalance)

export default balanceRoutes