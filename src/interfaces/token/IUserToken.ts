'use strict';

import { User } from '../../models/User';

export interface IUserToken{
    user: User;
    jwt:  string;
}
