'use strict'

const SERVER = 'amqps://rnecsina:cedh9fYdRIE8FFat376U-s2VAwiQ3P7R@puffin.rmq2.cloudamqp.com/rnecsina';
const NEW_JOB_QUEUE = 'new-job';


const amqp = require('amqplib');

let conn;
let sendChan;
let receiveChan

amqp.connect(SERVER).then(async c => {
    conn = c;

    sendChan = await conn.createChannel();
    receiveChan = await conn.createChannel();
});

module.exports = {
    conn,
    sendChan,
    receiveChan
};