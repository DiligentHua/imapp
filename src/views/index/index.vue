<template>
    <div id="content">
        <div class="top-bar">
            <router-link class="top-bar-left" :to="'/userhome?id='+user.id">
                <img :src= "user.imgurl" >
            </router-link>
            <div class="top-bar-center">
                <img src="@/assets/images/index/logo.png" alt="">
            </div>
            <div class="top-bar-right">
                <div class="search" @click="goSearch">
                    <img src="@/assets/images/index/search.png" alt="">
                </div>
                <div class="add" @click="goBuildGroup">
                    <img src="@/assets/images/index/add.png" alt="">
                </div>
            </div>
        </div>

        <div class="main">
            <!-- 这里第一条是好友申请 -->
            <div class="friends">
                <div class="friend-list" @click="toFriendRequest">
                    <div class="friend-list-left">
                        <div class="tip">{{friendsApply.length}}</div>
                        <img src="@/assets/images/index/apply.png" alt="">
                    </div>
                    <div class="friend-list-right">
                        <div class="top">
                            <span class="name">好友申请</span>
                            <span class="time">18:24:16</span>
                        </div>
                        <div class="news">
                            <span>这里是信息内容这里是信息内容这里是信息内容这里是信息内容</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="friends" v-for="friend in friends" :key = "friend.id">
                <div class="friend-list" @click="toChatRoom(friend,friend.friendType)">
                    <div class="friend-list-left">
                        <div class="tip"> {{friend.tip}} </div>
                        <img :src="friend.imgurl" alt="">
                    </div>
                    <div class="friend-list-right">
                        <div class="top">
                            <span class="name">{{friend.name}}</span>
                            <!-- <span class="time">{{timeCal(friend.time)}}</span> -->
                        </div>
                        <div class="news">
                            <span>消息</span>
                        </div>
                    </div>
                </div>
            </div>


        </div>
        

    </div>
</template>

<script>
import dataFun from '@/commons/js/myfun'
import {getInfo} from '@/utils/auth'
import {getFriend} from '@/api/friend'
import {getUnreadMessage} from '@/api/message'
import {getGroup} from '@/api/group'

import config from '../../config'
// import socketio from 'socket.io-client' //引入socket.io-client
// import {io} from 'vue-socket.io'


export default {
    mounted() {
        this.$io.nowRoom = "";
        this.user = getInfo();
        if(this.user) {
            this.user.imgurl = config.baseURL+'/user/'+this.user.imgurl;
        } else {
            this.$router.push('/login')
        }
        this.getFriendApply();
        this.getFriend();
        this.getGroup();
        if(!this.$io.isJoin) {
            this.join();
            this.$io.isJoin = 1;
        }
    },
    data() {
        return {
            user:{
                id: '',
                name: '',
                imgurl: '',
                token: ''
            },
            friends: [],
            groups:[],
            friendsApply: [],
        }
    },
    methods: {
        join() {
            this.$io.emit("login", this.user.id)
            this.$io.on("msg", () => {
                console.log("连接成功");
            }),
            this.$io.on("ackMessage", data => {
                this.$store.commit("ackMessage", data)
            })
            this.$io.on("message", data => {
                if(data.gid) {
                    this.addTip(data.gid);
                } else {
                    this.addTip(data.uid);
                }
                this.$io.emit("ackForRe", data.ack);
            })

        },
        timeCal(time) {
            return dataFun.dateTime(time);
        },
        goSearch() {
            this.$router.push('/search');
        },
        goBuildGroup() {
            this.$router.push('/buildGroup');
        },
        addTip(id) {
            if(id == this.$store.getters.nowRoom) return;
            this.friends.forEach(item => {
                if(item.id == id) {
                    item.tip++;
                }
            })
        },

        getFriend() {
            let data = {
                uid: this.user.id,
                state: 0,
                token: this.user.token
            }
            getFriend(data).then(response => {
                let status = response.data.status;
                if(status == 200) {

                    response.data.result.forEach(item => {
                        item.imgurl = config.baseURL+'/user/'+ item.imgurl;
                        // this.friends.push(item);
                        let data1 = {
                            fid: this.user.id,
                            uid: item.id
                        }
                        getUnreadMessage(data1).then(response => {
                            item.tip = response.data.result;
                            item.friendType = 0;
                            this.friends.push(item);


                        })

                    })
                }
            }) 
        },
        getGroup() {
             let data = {
                uid: this.user.id,
                token: this.user.token
            }
            getGroup(data).then(response => {
                let status = response.data.status;
                if(status == 200) {
                    response.data.result.forEach(item => {
                        this.friends.push(item);
                        item.friendType = 1;
                    })
                }
            }) 

        },
        getFriendApply() {
            let data = {
                uid: this.user.id,
                state: 1,
                token: this.user.token
            }
            getFriend(data).then(response => {
                let status = response.data.status;
                if(status == 200) {
                    response.data.result.forEach(item => {
                        item.imgurl = config.baseURL+'/user/'+ item.imgurl;
                        this.friendsApply.push(item)
                    })
                }
            }) 
        },
        toChatRoom(friend,friendType) {
            this.$store.commit("setNowRoom", {id:friend.id})
            this.$io.nowRoom = friend.id;
            this.$router.push({name: 'chatRoom', params: { friend:  friend, friendType:friendType}})
 
        },
        toFriendRequest() {
            this.$router.push({name: 'friendRequest'})
        }
    }
    
}
</script>

<style lang="scss" scoped>
@import '@/style/mixin.scss';
#content {
    width: 100%;
    @include px2rem(padding-top, 88);
    .top-bar {
        display: flex;
        position: fixed;
        z-index: 100;
        left: 0;
        top: 0;
        @include px2rem(height, 88);
        width: 100%;
        justify-content: space-between;
        align-items: center;
        background-color: $bg-color-grey;
        box-shadow: 0 1px 0 0 rgba($color: #000000, $alpha: 0.1);
        padding: 0  $spacing-row-base;
        .top-bar-left {
            img {
                @include px2rem(width, 68);
                @include px2rem(height, 68);
                @include px2rem(border-radius, 16);
            }
        }
        .top-bar-center {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            img {
                @include px2rem(width, 88);
                @include px2rem(height, 42);
            }
        }
        .top-bar-right {
            display: flex;
            img {
                position: absolute;
                @include px2rem(width, 52);
                @include px2rem(height, 57);
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
            }
            .search {
                position: relative;
                @include px2rem(width, 88);
                @include px2rem(height, 88);
                // border: 1px solid red;
            }
            .add {
                position: relative;
                @include px2rem(width, 88);
                @include px2rem(height, 88);
                // border: 1px solid red;
            }
        }
    }

    .main {
        padding: 0  $spacing-row-base;
        @include px2rem(padding-top, 16);
        .friends { 
            .friend-list {
                overflow: hidden;
                padding: $spacing-col-sm 0;
                .friend-list-left {
                    position: relative;
                    float: left;
                    img {
                        display: inline-block;
                        @include px2rem(width, 96);
                        @include px2rem(height, 96);
                        background-color: $color-primary;
                        border-radius: $border-radius-base;
                    }
                    .tip {
                        position: absolute;
                        width: 20px;
                        @include px2rem(top, -8);
                        @include px2rem(left, 68);
                        @include px2rem(line-height, 36);
                        @include px2rem(height, 36);
                        @include px2rem(width, 36);
                        background-color: $color-warning;
                        border-radius: $border-radius-circle;
                        font-size: $font-size-sm;
                        color: $text-color-inverse;
                        text-align: center;
                    }
                }
                .friend-list-right {
                    @include px2rem(padding-left, 116);
                    .top {
                        overflow: hidden;
                        .name {
                            float: left;
                            @include px2rem(font-size, 36);
                            @include px2rem(line-height, 50);
                            font-weight: 400;
                            color: $text-color;
                        }
                        .time {
                            float: right;
                            font-size: $font-size-sm;
                            color: $text-color-disable;
                            @include px2rem(line-height, 50);
                        }
                    }
                    .news {
                        display: inline-block;
                        font-size: $font-size-base;
                        color: $text-color-grey;
                        @include px2rem(line-height, 40);
                        span {
                            display: -webkit-box;
                            -webkit-box-orient: vertical;
                            -webkit-line-clamp: 1;
                            overflow: hidden;
                        }

                    }
                }
            }
        }
    }


}

</style>