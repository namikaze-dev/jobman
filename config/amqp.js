import amqp from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

const conn = await amqp.connect(process.env.AMQP_SERVER);
const sendChan = await conn.createChannel();
const receiveChan = await conn.createChannel();

export default {
    conn,
    sendChan,
    receiveChan,
    createJobQueue: "CREATE_JOB",
};