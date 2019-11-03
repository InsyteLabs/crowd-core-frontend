<template>
    <div class="user-profile container-fluid p-0">
        <div v-if="user" class="card p-3">
            <h4>Signed in as: <i>{{ user.isAnonymous ? 'Anonymous' : user.username }}</i></h4>

            <div class="row">
                <div class="col-12">
                    <div class="form-group">
                        <label for="username">Username</label>
                        <div class="input-group">
                            <input :value="user.username" type="text" id="username" class="form-control form-control-sm" disabled="disabled">
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="user && !user.isAnonymous" class="row">
                <div class="col-6">
                    <div class="form-group">
                        <label for="first-name">First Name</label>
                        <div class="input-group">
                            <input :value="user.firstName" type="text" id="first-name" class="form-control form-control-sm" disabled="disabled">
                        </div>
                    </div>
                </div>
                <div class="col-6">
                    <div class="form-group">
                        <label for="last-name">Last Name</label>
                        <div class="input-group">
                            <input :value="user.lastName" type="text" id="last-name" class="form-control form-control-sm" disabled="disabled">
                        </div>
                    </div>
                </div>
                <div class="col-12">
                    <div class="form-group">
                        <label for="email">Email</label>
                        <div class="input-group">
                            <input :value="user.email" type="text" id="email" class="form-control form-control-sm" disabled="disabled">
                        </div>
                    </div>
                </div>
                <div class="col-12">
                    <div class="form-group">
                        <label for="roles">Roles</label>
                        <div class="input-group">
                            <input :value="user.roles.join(', ')" type="text" id="roles" class="form-control form-control-sm" disabled="disabled">
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="user.isAnonymous">
                <button @click="login()" class="btn btn-primary btn-block">Login</button>
            </div>
            <div v-else>
                <button @click="logout()" class="btn btn-primary btn-block">Logout</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

import { Vue, Component, Emit } from 'vue-property-decorator';

import { tokenService } from '@/services';
import { User }         from '@/models';

@Component
export default class UserProfile extends Vue {

    @Emit('login')
    login(): void{ }

    @Emit('logout')
    logout(): void{ }

    get user(): User|null{
        return this.$store.getters.user;
    }
}
</script>

<style scoped lang="sass">

.user-profile
    background-color: white
</style>