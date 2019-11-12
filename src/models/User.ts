'use strict';

export class User{
    [key: string]: any;

    id?:              number;
    clientId?:        number|null;
    firstName:        string;
    lastName:         string;
    email:            string;
    username:         string;
    password:         string;
    isAnonymous:      boolean;
    isDisabled?:      boolean;
    disabledComment?: string|null;

    roles:            string[];

    constructor(u: any){
        this.id              = u.id;
        this.clientId        = u.clientId;
        this.firstName       = u.firstName;
        this.lastName        = u.lastName;
        this.email           = u.email;
        this.username        = u.username;
        this.password        = u.password;
        this.isAnonymous     = u.isAnonymous;
        this.isDisabled      = u.isDisabled;
        this.disabledComment = u.disabledComment;

        this.roles           = u.roles;
    }
}