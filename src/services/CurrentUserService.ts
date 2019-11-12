'use strict';

import store    from '@/store';
import { User } from '@/models';
import { Role } from '@/constants';

export class CurrentUserService{

    get user(): User|null{
        return store.getters['user/user'];
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

    get canViewUsers(): boolean{
        if(!this.user) return false;
        
        return this.isAdmin || this.isSubAdmin;
    }
}

export const currentUserService = new CurrentUserService();