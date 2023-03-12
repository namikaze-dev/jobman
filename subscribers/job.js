export default async (env) => {
    await env.amqp.receiveChan.assertQueue(env.amqp.createJobQueue, { durable: true });

    env.amqp.receiveChan.consume(env.amqp.createJobQueue, (msg) => {
        if (msg === null) {
            return;
        }

        env.amqp.receiveChan.ack(msg);

        const job = JSON.parse(msg.content.toString());
        console.log(job);
    });
}