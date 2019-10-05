'use strict';

import conf                  from '@/conf';
import { User }              from '@/models';
import { IRole, IUserToken } from '@/interfaces';

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

    async authenticate(username: string, password: string): Promise<IUserToken|void>{
        let jwt: any = await fetch(`${ apiUrl }/authenticate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const { token } = await jwt.json();

        if(!token) return;

        let [ header, payload, signature ] = token.split('.');

        header  = atob(header),
        payload = atob(payload);

        let userToken: IUserToken;
        try{
            userToken = JSON.parse(payload);
        }
        catch(e){
            console.error('Error parsing user token');
            return;
        }

        return userToken;
    }

    async getRoles(): Promise<IRole[]>{
        let roles: any = await fetch(`${ apiUrl }/roles`);
            roles      = await roles.json();
        
        roles.forEach((r: IRole) => r.checked = false);
        
        return roles;
    }
}

export const userService = new UserService();