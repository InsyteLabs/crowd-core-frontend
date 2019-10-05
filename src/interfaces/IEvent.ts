'use strict';

import { IEventSettings } from './IEventSettings';

export interface IEvent{
    id?:         number;
    clientId:    number;
    title:       string;
    slug:        string;
    description: string;
    startTime:   Date;
    endTime:     Date;
    active?:     boolean;
    questions:   any[];

    settings: IEventSettings;
}