<template>
    <div class="content">
        <div class="top-bar">
            <div class="top-bar-left" @click="goBack">
                <img class="back-img" src="@/assets/images/common/back.png" alt="">
            </div>
        </div>

        <div class="main">
            <!-- 头像 -->
            <label class="group-img" for="file">
                <img :src="groupImg" alt="" class="group-img">
                <input id="file" type="file" @change="uploadGroupImg($event)" style="display: none;">
            </label>
            <!-- 名字 -->
            <div class="group-name">
       
                    <input class="text" v-model="groupName" />
            </div>

            <div class="users">
                <div class="title">用户</div>
                <div class="user" v-for="friend in friends" :key="friend.id"> 
                    <div class="choice" :style="{background : friend.choice ? '#FFE431' : 'white'}" @click="friend.choice = !friend.choice">
                     
                    </div>
                    <div class="user-img">
                        <img :src="friend.imgurl" alt="">
                    </div>
                    <div class="user-name">
                        {{friend.name}}
                    </div>
                </div>

            </div>

            <div class="build" @click="buildGroup">创建</div>
        </div>
    </div>
    
    
</template>


<script>
import {getInfo} from '@/utils/auth'
import {getFriend} from '@/api/friend'
import {upload} from "@/api/upload"
import {buildGroup} from "@/api/group"
import config from '../../config'

export default {
    data() {
        return {
            user: {
                id: "",
                name: "",
                imgUrl: "",
                token: ""
            },
            friends: [],
            groupName: "请输入群名称",
            groupImg: "http://127.0.0.1:3000/user/user.png"

        }
    },
    methods: {
        goBack() {
            this.$router.go(-1);
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
                        item.choice = 0;
                        // this.friends.push(item);
                        this.friends.push(item);


                    })
                }
            }) 
        },
        uploadGroupImg(event) {
            let formData = new FormData();
            console.log(event.target.files);
            for (let i = 0; i < event.target.files.length; i++) {
                  formData.append('file', event.target.files[i])
            }
            try{
                upload(formData).then(response => {
					this.groupImg = response.data.result.message;
                    console.log(this.groupImg);
                });
            } catch(e) {
                console.log(e);
            }
        },
        buildGroup() {
            let users = [];
            this.friends.forEach(item => {
                if(item.choice) {
                    users.push(item);
                }
            }) 
            users.push(this.user);
            let data = {
                users: users,
                name: this.groupName,
                imgurl: this.groupImg,
                time: new Date()

            }
            buildGroup(data).then(response => {
                console.log(response);
            })

        }
    },
    mounted() {
        this.user = getInfo();
        this.getFriend();
        

    }
}
</script>

<style lang="scss" scoped>
@import '@/style/mixin.scss';

.content {
        width: 100%;
        @include px2rem(padding-top, 88);
        .top-bar {
        overflow: hidden;
        position: fixed;
        z-index: 100;
        left: 0;
        top: 0;
        @include px2rem(height, 88);
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
        display: flex;
        flex-direction: column;
        padding: 0  $spacing-row-base;

        .group-img {
            width: 98px;
            height: 98px;
            box-shadow: 0px 18px 20px 0px rgba(39,48,50,0.1);
            margin: 0 auto;
            border-radius: 24px;
        }

        .group-name {
            margin-top: 10px;
            height: 46px;
            background: #F3F4F6;
            border-radius: 23px;
            .text {
                display: block;
                background: #F3F4F6;
                margin: auto;
                text-align: center;
                line-height: 46px;
                font-size: 16px;
                color: #272832;
                letter-spacing: -0.55px;
                font-weight: 400;
            }
        }
        .users {
            .user {
                display: flex;
                align-items: center;
                .choice {
                    width: 24px;
                    height: 24px;
                    border-radius: 12px;
                    border: solid 1px black;

                }
                .user-img {
                    margin-left: 10px;
                    img {
                        width: 40px;
                        height: 40px;
                        border-radius: 10px;
                    }
                }
                .user-name {
                    margin-left: 20px;
                    flex: 1;
                    height: 25px;
                    font-size: 18px;
                    color: #272832;
                    letter-spacing: -0.62px;
                    font-weight: 400;
                }
            }
        }
        .build {
            height: 40px;
            display: flex;
            background-color: yellow;
            justify-content: center;
            align-items: center;
            border-radius: 18px;
        }
    }


}
</style>