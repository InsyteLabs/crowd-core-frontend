'use strict';

import { IUserToken } from './IUserToken';

export interface ITokenMap{
    [key: string]: IUserToken;
}