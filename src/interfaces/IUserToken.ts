'use strict';

import { User } from '@/models';

export interface IUserToken{
    issuer: string;
    exp:    number;
    iat:    number;
    data:   User;

}