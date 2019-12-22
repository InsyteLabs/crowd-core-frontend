'use strict';

import { Module } from 'vuex';

import { userService } from '@/services';
import { User }        from '@/models';

export const userModule: Module<any, any> = {
    state: {
        users: <User[]>    [],
        user:  <User|null> null
    },

    getters: {
        users: (state): User[]    => state.users || [],
        user:  (state): User|null => state.user
    },

    mutations: {
        setUser(state, user: User): void{
            state.user = user;
        },

        setUsers(state, users: User[]): void{
            state.users = Array.isArray(users) ? users : [];
        },

        addUser(state, user: User): void{
            if(!(state.users && Array.isArray(state.users))){
                state.users = [ user ];
            }

            state.users.push(user);
        },

        updateUser(state, user: User): void{
            const users: User[] = state.users;

            if(!users || !Array.isArray(users)){
                state.users = [ user ];
                return;
            }

            const idx = users.findIndex(u => u.id === user.id);
            if(~idx){
                users.splice(idx, 1, user);
            }
        },

        deleteUser(state, user: User): void{
            const users: User[] = state.users;

            if(!(users && Array.isArray(users))) return;

            const idx = users.findIndex(u => u.id === user.id);
            if(~idx){
                users.splice(idx, 1);
            }
        },
    },

    actions: {
        async loadUsers({ commit }): Promise<User[]>{
            const users: User[] = await userService.getUsers();

            commit('setUsers', users);

            return users;
        }
    }
}