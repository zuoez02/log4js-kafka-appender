const log4js = require('log4js');
const path = require('path');

log4js.loadAppender(path.resolve('./index.js'));
log4js.addAppender(log4js.appenders[path.resolve('./index.js')]({
    host: 'localhost',
    port: 2181,
    topic: 'fuck',
    converter: (loggingEvent) => {
        const data = {
            data: loggingEvent.data,
            level: loggingEvent.level.levelStr,
            startTime: loggingEvent.startTime,
            categoryName: loggingEvent.categoryName,
            haha: 'haha'
        };
        return JSON.stringify(data);
    }
}));

const logger = log4js.getLogger('test');

setInterval(() => logger.info('test'), 1000);