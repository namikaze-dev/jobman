import { EventEmitter} from 'events';
import amqpSend from "../helpers/amqp.js";

const em = new EventEmitter();

em.on("new-job", async (env, job) => {
    const subscribers = await env.models.users.getSubscribersDetails();

    const matched = [];
    subscribers.forEach(e => {
        if (match(e.tags, job)) {
            const msg = {
                recipient: e.email,
                job: job
            };
            matched.push(amqpSend(env.amqp.sendChan, env.amqp.sendEmailQueue, msg));
        }
    });

    await Promise.allSettled(matched);
});

const match = (tags, job) => {
    tags = tags.map(e => e.toLowerCase());

    if (job.skills) {
        job.skills = job.skills.map(e => e.toLowerCase());
    }

    for (const tag of tags) {
        // check title
        if (job.title.toLowerCase().includes(tag)) {
            return true;
        }

        // check company name
        if (job.company_name.toLowerCase().includes(tag)) {
            return true;
        }

        // check skills
        if (job.skills && job.skills.includes(tag)) {
            return true;
        }
    }

    return false;
}

const listener = async (env) => {
    await env.amqp.receiveChan.assertQueue(env.amqp.createJobQueue, { durable: true });

    env.amqp.receiveChan.consume(env.amqp.createJobQueue, (msg) => {
        if (msg === null) {
            return;
        }

        env.amqp.receiveChan.ack(msg);

        const job = JSON.parse(msg.content.toString());
        
        em.emit("new-job", env, job);
    });
}

export default listener;