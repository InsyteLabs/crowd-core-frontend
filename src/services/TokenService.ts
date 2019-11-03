'use strict';

import { User }                  from '@/models';
import { ITokenMap, IUserToken } from '@/interfaces';

class TokenService{
    private TOKEN_MAP_KEY:  string = 'anonymous-token-map';
    private USER_TOKEN_KEY: string = 'token';

    private LAST_TOKEN: IUserToken|null = null;

    getAuthToken(): IUserToken|null{
        return this.LAST_TOKEN;
    }

    
    /*
        ==============================
        REGISTERED USER TOKEN HANDLING
        ==============================
    */
    getToken(): IUserToken|undefined{
        const tokenString: string|null = localStorage.getItem(this.USER_TOKEN_KEY);

        if(!tokenString) return;

        try{
            const userToken: IUserToken = JSON.parse(tokenString);

            return this.LAST_TOKEN = userToken;
        }
        catch(e){
            console.group('TokenService.getToken');
            console.error('Error parsing user token:');
            console.error(e);
            console.groupEnd();

            return;
        }
    }

    addToken(jwt: string): IUserToken|undefined{
        const user = this._getJWTData<User>(jwt);

        if(!user) return;

        const userToken: IUserToken = { user, jwt };

        try{
            const tokenString: string = JSON.stringify(userToken);

            localStorage.setItem(this.USER_TOKEN_KEY, tokenString);

            return this.LAST_TOKEN = userToken;
        }
        catch(e){
            console.group('TokenService.addToken');
            console.error('Error parsing user token');
            console.error(e);
            console.groupEnd();

            return;
        }
    }

    deleteToken(){
        localStorage.removeItem('token');

        this.LAST_TOKEN = null;
    }


    /*
        ========================
        ANONYMOUS TOKEN HANDLING
        ========================
    */
    getAnonymousToken(clientSlug: string): IUserToken|undefined{
        const tokenMap: ITokenMap = this._getAnonymousTokenMap();

        return this.LAST_TOKEN = tokenMap[clientSlug];
    }

    addAnonymousToken(clientSlug: string, jwt: string): IUserToken|undefined{
        const user = this._getJWTData<User>(jwt);

        if(!user) return;
        
        const tokenMap:  ITokenMap  = this._getAnonymousTokenMap(),
              userToken: IUserToken = { user, jwt };

        tokenMap[clientSlug] = userToken;

        this._saveAnonymousTokenMap(tokenMap);

        return this.LAST_TOKEN = userToken;
    }


    /*
        ===============
        PRIVATE METHODS
        ===============
    */
    private _getAnonymousTokenMap(): ITokenMap{
        const tokenMapString: string|null = localStorage.getItem(this.TOKEN_MAP_KEY);

        if(!tokenMapString) return {};

        try{
            const tokenMap: ITokenMap = JSON.parse(tokenMapString);

            return tokenMap;
        }
        catch(e){
            console.group('TokenService._getAnonymousTokenMap');
            console.error('Error parsing anonymous token map:');
            console.error(e);
            console.groupEnd();

            return {};
        }
    }

    private _saveAnonymousTokenMap(tokenMap: ITokenMap): void{
        try{
            const tokenMapString: string = JSON.stringify(tokenMap);

            localStorage.setItem(this.TOKEN_MAP_KEY, tokenMapString);
        }
        catch(e){
            localStorage.setItem(this.TOKEN_MAP_KEY, '{}');
        }
    }

    private _getJWTData<T>(jwt: string): T|undefined{
        let payload = jwt.split('.')[1];
            payload = atob(payload);

        try{
            const json: any = JSON.parse(payload);

            return <T>json.data;
        }
        catch(e){
            console.group('TokenService.getJWTData');
            console.error('Error parsing JWT payload');
            console.error(e);
            console.groupEnd();

            return;
        }
    }
}

export const tokenService = new TokenService();