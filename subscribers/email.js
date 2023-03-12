import send from "../helpers/email.js";

const listener = async (env) => {
    await env.amqp.receiveChan.assertQueue(env.amqp.sendEmailQueue, { durable: true });

    env.amqp.receiveChan.consume(env.amqp.sendEmailQueue, async (msg) => {
        if (msg === null) {
            return;
        }

        env.amqp.receiveChan.ack(msg);

        const content = JSON.parse(msg.content.toString());

        await send(content.recipient, "New Job", "new_job", content.job)
    });
}

export default listener;