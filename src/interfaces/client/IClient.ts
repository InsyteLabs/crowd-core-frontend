'use strict';

import { IClientType }  from './IClientType';
import { IClientOwner } from './IClientOwner';

export interface IClient{
    id?:             number;
    name:            string;
    slug:            string;
    owner:           IClientOwner;
    type:            IClientType,
    isDisabled:      boolean;
    disabledComment: string;
}