'use strict';

import { User } from '@/models';

export interface IJWTPayload{
    exp:    number;
    iat:    number;
    issuer: string;
    data:   User;
}