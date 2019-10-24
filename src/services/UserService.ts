'use strict';

import conf                    from '@/conf';
import { User }                from '@/models';
import { IRole, IUserToken }   from '@/interfaces';
import { httpService as http } from './Http';

const { apiUrl } = conf;

const JSON_HEADERS = {
    'Content-Type': 'application/json'
}

class UserService{
    async getUsers(clientId: number): Promise<User[]>{
        const url = `${ apiUrl }/clients/${ clientId }/users`;

        let users: User[] = await http.get<User[]>({ url });

        return users.map(u => new User(u));
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

    async deleteUser(user: User): Promise<any>{
        const url = `${ apiUrl }/users/${ user.id }`;

        const deletedUser: any = await http.delete<any>({ url });

        return deletedUser;
    }

    async authenticate(username: string, password: string): Promise<IUserToken|void>{
        const url = `${ apiUrl }/authenticate`;

        const jwt: any = await http.post<any>({
            url,
            headers: JSON_HEADERS,
            body: JSON.stringify({ username, password })
        });

        const { token } = jwt

        if(!token) return;

        localStorage.setItem('jwt', token);

        let [ header, payload ] = token.split('.');

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
        const url = `${ apiUrl }/roles`;

        const roles: IRole[] = await http.get<IRole[]>({ url });
        
        roles.forEach((r: IRole) => r.checked = false);
        
        return roles;
    }
}

export const userService = new UserService();