# LOG4JS KAFKA APPENDER

Kafka appender for log4js.

## Install

```bash
npm install --save log4js-Kafka-appender
```

## Usage

```javascript
const log4js = require('log4js');
log4js.loadAppender('log4js-kafka-appender');
log4js.addAppender(log4js.appenders['log4js-kafka-appender']({
    host: 'localhost',
    port: 2181,
    topic: 'topic',
    converter: (loggingEvent) => {
        const data = {
            data: loggingEvent.data,
            level: loggingEvent.level.levelStr,
            startTime: loggingEvent.startTime,
            categoryName: loggingEvent.categoryName
        };
        return JSON.stringify(data);
    }
}));
```

## options

* host: zookeeper host, default localhost
* port: zookeeper port, default 2181
* topic: the topic to send, no default, must config one.
* converter: custom logging event converter for customizing your data, default as above.

--------------------------------------

Developed by Luto