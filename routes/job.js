import { Router } from 'express';
import * as mdw from '../lib/middlewares.js';
import * as hd from '../handlers/job.js';

const route = env => {
    const router = Router();

    router.get("/jobs/subscriptions", hd.subscribe(env));
    router.post("/jobs/payment-intent", hd.createPaymentIntent(env));

    router.get("/jobs/:id", hd.get(env));
    router.get("/jobs", hd.getAll(env));
    router.post("/jobs", mdw.authenticate(env), mdw.activate(env), hd.create(env));
    router.put("/jobs/:id", mdw.authenticate(env), mdw.activate(env), hd.update(env));
    router.delete("/jobs/:id", mdw.authenticate(env), mdw.activate(env), hd.remove(env));

    return router;
}

export default route;