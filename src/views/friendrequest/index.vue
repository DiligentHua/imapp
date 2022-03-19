<template>
    <div class="content">
        <div class="top-bar">
            <div class="top-bar-left" @click="goBack">
                <img class="back-img" src="@/assets/images/common/back.png" alt="">
            </div>
            <div class="top-bar-center">
                <div class="title">好友申请</div>
            </div>
            <div class="top-bar-right">
                
            </div>
        </div>

        <div class="main">
            <div class="requseter" v-for="friend in friends" :key="friend.id">
                <div class="requset-top">
                    <div class="reject" @click="reject(friend)">拒绝</div>
                    <img :src="friend.imgurl" alt="">
                    <div class="agree" @click="agree(friend)">同意</div>
                </div>
                <div class="request-center">
                    <div class="title">{{friend.name}}</div>
                    <div class="time">{{friend.lastTime}}</div>
                </div>
                <div class="notice">
                    <span>留言：{{friend.message}}</span>
                </div>
            </div>

        </div>

    </div>
</template>


<script>
import {deleteFriend,getFriend,agreeFriend} from "@/api/friend"
import {getLastMessage} from "@/api/message"

import {getInfo} from '@/utils/auth'
import config from '../../config'


export default {
    data() {
        return {
            user: {

            },
            messages: [],
            friends: []
        }
    },
    methods: {
        goBack() {
            this.$router.go(-1);
        },
        agree(friend) {
            let data = {
                uid: this.user.id,
                fid: friend.id
            }
            agreeFriend(data).then(response => {
                console.log(response);
            }) 
        },
        reject(friend) {
            let data = {
                uid: this.user.id,
                fid: friend.id
            }
            deleteFriend(data).then(response => {
                console.log(response);
            }) 
        },
        getFriend() {
            let data = {
                uid: this.user.id,
                state: 1,
                token: this.user.token
            }
            getFriend(data).then(response => {
                let status = response.data.status;
                if(status == 200) {
                    response.data.result.forEach(e => {
                        e.imgurl = config.baseURL+'/user/'+ e.imgurl;
                        this.getLastMessage(e);
                    });
                }
            })
        },
        getLastMessage(e) {
            let data = {
                uid: e.id,
                fid: this.user.id,
            }
            getLastMessage(data).then(response => {
                let status = response.data.status;
                if(status == 200) {
                    e.message = response.data.result;
                    this.friends.push(e);

                console.log(response);

                }
            })
        }
    },
    mounted() {
        this.user = getInfo();
        if(this.user) {
            this.user.imgurl = config.baseURL+'/user/'+this.user.imgurl;
        } else {
            this.$router.push('/login')
        }
        this.getFriend();
    }
}
</script>

<style lang="scss" scoped>
@import '@/style/mixin.scss';

.content {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    @include px2rem(padding-top, 88);
    padding: 0  $spacing-row-base;
    .top-bar {
        overflow: hidden;
        position: fixed;
        z-index: 100;
        left: 0;
        top: 0;
        @include px2rem(height, 88);
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        padding: 0  $spacing-row-base;
        .top-bar-left {
            float: left;
            @include px2rem(height, 88);
            @include px2rem(width, 88);
            .back-img {
                @include px2rem(margin-top, 21);
                @include px2rem(height, 46);
                @include px2rem(width, 26);
            }

        }
    }
    .main {
        @include px2rem(padding-top, 78);
        width: 100%;
    }
}
</style>