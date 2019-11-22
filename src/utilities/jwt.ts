'use strict';

import { IJWTPayload } from '@/interfaces';

function decode(jwt: string): IJWTPayload{
    let [ header, payloadEncoded ] = jwt.split('.');

    const payloadDecoded = atob(payloadEncoded);

    const payload: IJWTPayload = JSON.parse(payloadDecoded);

    return payload;
}

function isExpired(payload: IJWTPayload): boolean{
    const exp: number = (new Date(payload.exp * 1000)).getTime();
    
    return Date.now() > exp;
}


export const jwt = {
    decode,
    isExpired
}