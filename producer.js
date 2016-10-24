const kafka = require('kafka-node');
const log4js = require('log4js');
const logger = log4js.getLogger('log4js-kafka-appender');

logger.setLevel('ERROR');

/**
 * Kafka Client
 */
class Client {
    constructor(config) {
        const HighLevelProducer = kafka.HighLevelProducer;

        this.config = config;
        config.host = config.host || 'localhost';
        config.port = config.port || '2181';
        config.topics = [config.topic];

        this.client = new kafka.Client(`${config.host}:${config.port}`);

        this.client.on('error', () => {
            this.client.close();
        })

        this.producer = new HighLevelProducer(this.client);
        this.ready = false;
        this.topics = config.topics;
        this.producer.on('ready', () => {
            logger.info('Kafka client ready');
            this.createTopics(config.topics);
        });

        process.on('exit', () => {
            this.client.close();
        });
    }

    createTopics(topics) {
        this.producer.createTopics(topics, false, (err, data) => {
            if (err) {
                logger.error(err);
                return
            }
            this.ready = true;
            logger.info(data);
        });
    }

    send(payloads) {
        if (!this.ready) {
            return;
        }
        this.producer.send(payloads, (err, data) => {
            if (err) {
                logger.error(err);
                this.ready = false;
                logger.info('Reacreating topics');
                this.createTopics(this.config.topics);
                return;
            }
            logger.info(data);
        });
    }
}

module.exports = Client;