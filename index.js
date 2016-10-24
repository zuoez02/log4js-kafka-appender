/**
 * Log4js Kafka appender
 * 
 * Developed by Luto 2016-10-24
 */
const layouts = require('log4js/lib/layouts');
const KafkaClient = require('./producer');
const log4js = require('log4js');
const logger = log4js.getLogger('log4js-kafka-appender');
logger.setLevel('ERROR');

let layout;

function loggingEventConverter(loggingEvent) {
    const data = {
        data: loggingEvent.data,
        level: loggingEvent.level.levelStr,
        startTime: loggingEvent.startTime,
        categoryName: loggingEvent.categoryName
    };
    return JSON.stringify(data);
}

function appender(_config, _layout) {
    // default zookeeper config host and port
    _config.host = _config.host || 'localhost';
    _config.port = _config.port || '2181';

    if (!_config.topic) {
        logger.error('No topic found in config');
        return (loggingEvent) => {
            // nothing to do
        }
    } else {
        let converter;
        if (_config.converter) {
            converter = _config.converter;
        } else {
            converter = loggingEventConverter;
        }
        const client = new KafkaClient(_config);
        layout = _layout || layouts.basicLayout;

        return (loggingEvent) => {
            if (loggingEvent.categoryName !== 'log4js-kafka-appender') {
                client.send([{ topic: _config.topic, messages: converter(loggingEvent) }]);
            }
        };
    }
}

function configure(_config) {
    if (_config.layout) {
        layout = layouts.layout(_config.layout.type, _config.layout);
    }

    return appender(_config, layout);
}

exports.name = 'kafka';
exports.appender = appender;
exports.configure = configure;
