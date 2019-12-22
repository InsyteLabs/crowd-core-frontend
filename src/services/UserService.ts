'use strict';

import { tokenService } from '@/services';

import conf                    from '@/conf';
import { User }                from '@/models';
import { IRole, IUserToken }   from '@/interfaces';
import { httpService as http } from './Http';

const { apiUrl } = conf;

const JSON_HEADERS = {
    'Content-Type': 'application/json'
}

class UserService{
    async getUsers(): Promise<User[]>{
        const url = `${ apiUrl }/users`;

        let users: User[] = await http.get<User[]>({ url });

        return users ? users.map(u => new User(u)) : [];
    }

    async createUser(user: User): Promise<User>{
        const url = `${ apiUrl }/users`;

        const newUser: User = await http.post<User>({
            url,
            headers: JSON_HEADERS,
            body: JSON.stringify(user)
        });

        return new User(newUser);
    }

    async createAnonymousUser(clientSlug: string): Promise<User>{
        const url = `${ apiUrl }/clients/${ clientSlug }/users/anonymous`;
        
        const newUser: User = await http.post<User>({ url });

        return new User(newUser);
    }
    
    async updateUser(user: User): Promise<User>{
        const url = `${ apiUrl }/users/${ user.id }`;

        const updatedUser: User = await http.put<User>({
            url,
            headers: JSON_HEADERS,
            body: JSON.stringify(user)
        });

        return new User(updatedUser);
    }

    async deleteUser(user: User): Promise<any>{
        const url = `${ apiUrl }/users/${ user.id }`;

        const deletedUser: any = await http.delete<any>({ url });

        return deletedUser;
    }

    async authenticate(username: string, password: string): Promise<IUserToken|undefined>{
        const url = `${ apiUrl }/authenticate`;

        const response: any = await http.post<any>({
            url,
            headers: JSON_HEADERS,
            body: JSON.stringify({ username, password })
        });

        const jwt: string = response.token;

        if(!jwt) return;

        const userToken: IUserToken|undefined = tokenService.addToken(jwt);

        return userToken;
    }

    async authenticateAnonymous(clientSlug: string, username: string): Promise<IUserToken|undefined>{
        const url = `${ apiUrl }/authenticate/anonymous`;

        const response: any = await http.post<any>({
            url,
            headers: JSON_HEADERS,
            body: JSON.stringify({ username })
        });

        const jwt: string = response.token;

        if(!jwt) return;

        const anonymousToken: IUserToken|undefined = tokenService.addAnonymousToken(clientSlug, jwt);

        return anonymousToken;
    }

    async getRoles(): Promise<IRole[]>{
        const url = `${ apiUrl }/roles`;

        const roles: IRole[] = await http.get<IRole[]>({ url });

        if(!(roles && roles.length)) return [];
        
        roles.forEach((r: IRole) => r.checked = false);
        
        return roles;
    }
}

export const userService = new UserService();