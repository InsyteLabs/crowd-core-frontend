'use strict';

import conf                    from '@/conf';
import { IClient }             from '@/interfaces';
import { httpService as http } from './Http';

const { apiUrl } = conf;

class ClientService{
    async getClient(id: number): Promise<IClient>{
        const url = `${ apiUrl}/clients/${ id }`;

        const client: IClient = await http.get<IClient>({ url });

        return client;
    }

    async getClientBySlug(slug: string): Promise<IClient>{
        const url = `${ apiUrl }/clients/slug/${ slug }`;

        const client: IClient = await http.get<IClient>({ url });

        return client;
    }
}

export const clientService = new ClientService();