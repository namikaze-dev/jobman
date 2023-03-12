export const sendJob = async (chan, queue, job) => {
    await chan.assertQueue(queue, { durable: true });

    const content = JSON.stringify(job);
    const sent = chan.sendToQueue(queue, Buffer.from(content), {
        persistent: true
    });

    if (!sent) {
        chan.once('drain', () => { sendJob(chan, queue, job) })
    }
}