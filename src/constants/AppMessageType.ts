'use strict';

interface IAppMessageTypes{
    SUCCESS: 'success';
    INFO:    'info';
    WARN:    'warn';
    ERROR:   'error';
    DEFAULT: 'success'|'info'|'warn'|'error';
}

export const AppMessageType: IAppMessageTypes = {
    SUCCESS: 'success',
    INFO:    'info',
    WARN:    'warn',
    ERROR:   'error',
    DEFAULT: 'info'
}