import util from "util";

const wait = util.promisify(setTimeout);

class Queue {
  constructor(rsmq, qname) {
    this.rsmq = rsmq;
    this.qname = qname;
  }

  async createQueue() {
    const queues = await this.rsmq.listQueuesAsync();

    if (queues.find(queue => queue === this.qname)) {
      return;
    }

    const response = await this.rsmq.createQueueAsync({
      qname: this.qname,
      vt: 1
    });

    if (response !== 1) {
      throw new Error(`${this.qname} could not be created`);
    }

    console.log(`${this.qname} successfully created`);
  }

  async deleteQueue() {
    const response = await this.rsmq.deleteQueueAsync({ qname: this.qname });

    if (response !== 1) {
      console.log(`Queue could not be deleted`);
      return;
    }

    console.log(`${this.qname} queue and all messages deleted`);
  }

  async sendMessage(message) {
    const response = await this.rsmq.sendMessageAsync({
      qname: this.qname,
      message
    });

    if (!response) {
      throw new Error(`Message could not be sent to ${this.qname}`);
    }

    return response;
  }

  async receiveMessage() {
    const response = await this.rsmq.receiveMessageAsync({ qname: this.qname });

    if (!response || !response.id) {
      return null;
    }

    return response;
  }

  async deleteMessage(id) {
    const response = await this.rsmq.deleteMessageAsync({
      qname: this.qname,
      id
    });

    return response === 1;
  }

  async listen({ interval = 10000, maxReceivedCount = 10 }, callback) {
    const start = Date.now();

    try {
      const response = await this.receiveMessage();

      if (response && response.rc > maxReceivedCount) {
        await this.deleteMessage(response.id);
      } else if (response) {
        callback(response);
        await this.deleteMessage(response.id);
      }
    } finally {
      const elapsedTime = Date.now() - start;
      const waitTime = interval - elapsedTime;

      await wait(Math.max(0, waitTime));
      await this.listen({ interval, maxReceivedCount }, callback);
    }
  }
}

export default Queue;
