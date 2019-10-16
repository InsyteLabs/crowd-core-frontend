'use strict';

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
        let response: Response = await fetch(<string>opt.url, opt);
            response           = await response.json();

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