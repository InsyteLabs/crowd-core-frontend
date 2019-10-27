'use strict';

export interface IAppMessage{
    text:       string;
    autoClose?: boolean;
    timeout?:   number;
    type?:      string;
}