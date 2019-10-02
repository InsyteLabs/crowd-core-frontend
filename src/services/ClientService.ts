'use strict';

import conf        from '@/conf';
import { IClient } from '@/interfaces';

const { apiUrl } = conf;

class ClientService{
    async getClient(id: number): Promise<IClient>{
        let client: any = await fetch(`${ apiUrl}/clients/${ id }`);
            client      = await client.json();

        return <IClient>client;
    }

    async getClientBySlug(slug: string): Promise<IClient>{
        let client: any = await fetch(`${ apiUrl }/clients/slug/${ slug }`);
            client      = await client.json();

            return <IClient>client;
    }
}

export const clientService = new ClientService();