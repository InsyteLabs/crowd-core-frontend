'use strict';

export interface IClientOwner{
    id:              number;
    firstName:       string;
    lastName:        string;
    email:           string;
    username:        string;
    isAnonymous:     boolean;
    isDisabled:      boolean;
    disabledComment: string;
}