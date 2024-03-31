// src/utilities/Logger.js
import log from 'loglevel';

log.setLevel('debug'); // Set the logging level

const coloredLog = (message, color, level) => {
    console.log(`%c[${new Date().toISOString()}] [${level.toUpperCase()}] - ${message}`, `color: ${color};`);
};

export const logInfo = (message, color = 'blue') => {
    coloredLog(message, color, 'info');
    log.info(message);
};

export const logWarning = (message, color = 'orange') => {
    coloredLog(message, color, 'warn');
    log.warn(message);
};

export const logError = (message, color = 'red') => {
    coloredLog(message, color, 'error');
    log.error(message);
};

export const logDebug = (message, color = 'green') => {
    coloredLog(message, color, 'debug');
    log.debug(message);
};
