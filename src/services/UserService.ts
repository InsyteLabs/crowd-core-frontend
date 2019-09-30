'use strict';

import conf      from '@/conf';
import { User }  from '@/models';
import { IRole } from '@/interfaces';

const apiUrl = conf.apiUrl;

class UserService{
    async getUsers(): Promise<User[]>{
        let users: any = await fetch(`${ apiUrl }/users`);
            users      = await users.json();

        return users.map((user: any) => new User(user));
    }

    async createUser(user: User): Promise<User>{
        let newUser: any = await fetch(`${ apiUrl }/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        newUser = await newUser.json();

        return new User(newUser);
    }

    async getRoles(): Promise<IRole[]>{
        let roles: any = await fetch(`${ apiUrl }/roles`);
            roles      = await roles.json();

        return roles;
    }
}

export const userService = new UserService();