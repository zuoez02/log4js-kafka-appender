const log4js = require('log4js');
const path = require('path');

log4js.loadAppender(path.resolve('./index.js'));
log4js.addAppender(log4js.appenders[path.resolve('./index.js')]({
    host: 'localhost',
    port: 2181,
    topic: 'test',
    level: 'ERROR',
    converter: (loggingEvent) => {
        const data = {
            message: `${loggingEvent.categoryName}: ${loggingEvent.data[0]}`,
            timestamp: loggingEvent.startTime,
        };
        return JSON.stringify(data);
    }
}));

const logger = log4js.getLogger('test');
