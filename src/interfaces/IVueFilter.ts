'use strict';

export interface IVueFilter{
    name: string;
    method (...args: any[]): string;
}