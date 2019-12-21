'use strict';

import { IClientType }  from './IClientType';
import { IClientOwner } from './IClientOwner';
import { IClientUsage } from './IClientUsage';

export interface IClient{
    id?:             number;
    name:            string;
    slug:            string;
    owner:           IClientOwner;
    type:            IClientType;
    isDisabled:      boolean;
    disabledComment: string;
    usage:           IClientUsage;
}