const { createLogger, transports, format } = require('winston');
require('express-async-errors');


module.exports = function () {

    createLogger({
        transports: [
            new transports.File({ filename: 'logfile.log' }),
        ],
        exceptionHandlers: [
            new transports.Console({
                format: format.combine(
                    format.colorize({all: true}),
                    format.prettyPrint(),
                ),
            }),
            new transports.File({ filename: 'uncaughtExceptions.log' })
        ],
        rejectionHandlers: [
            new transports.File({ filename: 'unhandledrejection.log' })
        ],
    });
}