import db from './config/db.js';
import amqp from './config/amqp.js';
import Models from '../jobman/models/base.js';
import appFactory from './app.js';
import jobSubscriber from './subscribers/job.js';
import emailSubscriber from './subscribers/email.js'

// setup dependencies
const env = {
    models: new Models(db),
    amqp: amqp
};

await jobSubscriber(env);
await emailSubscriber(env);

const app = appFactory(env);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log('server listening on', PORT);
})
