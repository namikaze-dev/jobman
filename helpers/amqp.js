const send = async (chan, queue, data) => {
    await chan.assertQueue(queue, { durable: true });

    const content = JSON.stringify(data);
    const sent = chan.sendToQueue(queue, Buffer.from(content), {
        persistent: true
    });

    if (!sent) {
        chan.once('drain', () => { send(chan, queue, data) })
    }
}

export default send;