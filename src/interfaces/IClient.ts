'use strict';

export interface IClient{
    id?:             number;
    ownerId:         number;
    name:            string;
    slug:            string;
    types:           string[],
    isDisabled:      boolean;
    disabledComment: string;
}