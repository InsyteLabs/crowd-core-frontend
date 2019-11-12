'use strict';

import { tokenService } from './TokenService';
import { User }         from '@/models';
import { IUserToken }   from '@/interfaces';
import { Role }         from '@/constants';

class CurrentUserService{

    get user(): User|undefined{
        const token: IUserToken|undefined = tokenService.getToken();

        return token ? token.user : undefined;
    }

    get isAdmin(): boolean{
        if(!this.user) return false;

        return this.user.roles.includes(Role.ADMIN)
    }

    get isSubAdmin(): boolean{
        if(!this.user) return false;

        return this.user.roles.includes(Role.SUBADMIN);
    }

    get isModerator(): boolean{
        if(!this.user) return false;

        return this.user.roles.includes(Role.MODERATOR);
    }

    get isAnonymous(): boolean{
        if(!this.user) return true;

        return !!this.user.isAnonymous;
    }
}

export const currentUserService = new CurrentUserService();