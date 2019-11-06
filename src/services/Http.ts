'use strict';

/*
    On 401

    If user is anonymous, delete the token but keep ref to the username
    so that unlimited users are not created.

    Then redirect to login page. Login page will check if there is an anonymous
    token for the current client. If so, it should attempt the re-auth for the
    anon token.
*/

import router from '@/router';

import { tokenService } from '@/services';
import { IUserToken }   from '@/interfaces';
import { User }         from '@/models';

interface IHttpOptions{
    url?:      string;
    method?:   'GET'|'POST'|'PUT'|'DELETE';
    body?:     any;

    headers?: {
        [key: string]: string
    }
}

class HttpService{
    async makeRequest<T>(opt: IHttpOptions={ method: 'GET' }): Promise<T>{
        const userToken: IUserToken|null = tokenService.getAuthToken();

        if(userToken){
            opt.headers = opt.headers || {};

            opt.headers.Authorization = `Bearer ${ userToken.jwt }`;
        }

        let response: Response = await fetch(<string>opt.url, opt);

        if(response.status === 401){
            const path:   string = router.currentRoute.path,
                  domain: string = path.replace(/^\//, '').split('/')[0];

            let anonymous: boolean = false;

            if(userToken){
                const user: User   = userToken.user,
                      path: string = router.currentRoute.path;

                if(user.isAnonymous){
                    anonymous = true;
                }
                else{
                    tokenService.deleteToken();
                }
            }

            let querystring = `?anonymous=${ anonymous }`;
            if(domain){
                querystring += `&domain=${ encodeURIComponent(domain) }`;
            }
            if(path){
                querystring += `&to=${ encodeURIComponent(path) }`;
            }

            if(!router.currentRoute.path.includes('login')){
                router.push(`/login${ querystring }`);
            }
        }


        response = await response.json();


        const data = <unknown>response;

        return <T>data;
    }

    async get<T>(opt: IHttpOptions): Promise<T>{
        opt.method = 'GET';

        return this.makeRequest<T>(opt);
    }

    async post<T>(opt: IHttpOptions): Promise<T>{
        opt.method = 'POST';

        return this.makeRequest<T>(opt);
    }

    async put<T>(opt: IHttpOptions): Promise<T>{
        opt.method = 'PUT';

        return this.makeRequest<T>(opt);
    }

    async delete<T>(opt: IHttpOptions): Promise<T>{
        opt.method = 'DELETE';

        return this.makeRequest<T>(opt);
    }
}

export const httpService = new HttpService();