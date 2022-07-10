/** *****************************************************************************
 * @app.ts
 *
 * GET  /estimates
 * POST /calculate
 * GET  /calculate/:paidId
 * POST /purchase
 * GET  /payment-result/:orderId - transactionId (retry after 5 sec)
 *
/****************************************************************************** */

import { Application, Router } from 'express';

import * as handler from '../controllers/app';

const router = Router();

export default function (app: Application): void {
  router.get('/*', handler.index);

  app.use('/', router);
}
