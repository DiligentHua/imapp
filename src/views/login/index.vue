<template>
    <div id="login">
        <div class="top-bar">
            <div class="top-bar-right">
                <router-link tag="div" class="sign-up" to="/register">
                    <span>注册</span>
                </router-link>
            </div>
        </div>

        <div class="logo">
            <img src="@/assets/images/sign/logo1.png" alt="" @click="t">
        </div>

        <div class="main">
            <div class="title">
                <span>登录</span>
            </div>
            <div class="slogan">
                <span>您好，欢迎</span>
            </div>
            <div class="inputs">
                <input type="text" class="user" placeholder="用户名/邮箱" v-model="user">
                <input type="password" class="pwd" placeholder="密码" v-model="pwd">
            </div>
            <div class="tips" v-if="mon">
                <span>用户名或密码错误!</span>
            </div>

            <div class="submit">
                <div @click="login()">登录</div>
            </div>

        </div>

    </div>
</template>

<script>
import {loginApi} from '@/api/login'
import {test} from '@/api/index'
import {setInfo} from '@/utils/auth'



export default {
    data() {
        return {
            user: '',
            pwd: '',
            token: '',
            mon: false
            
        }
    },
    methods: {
        t() {
            test({
                uid: "61e96b4ec095374bfc4e610c",
                fid: "61ee9c7407c74b2f58210d2f",
                nowPage: 0,
                pageSize: 3
                // data: '小明好友请求',
                // state : 0
            }).then(res => {
                console.log(res);
            })
        },
        login() {
            // if(this.user && this.pwd) {
                loginApi({
                    data: this.user, 
                    pwd: this.pwd
                }).then(response => {
                    let status = response.data.status;
                    if(status == 200) {
                        this.mon = false
                        setInfo(response.data.back)
                        this.token = response.data.back.token;
                        this.$router.push({ path: '/' })                        


                    } else if(status == 400) {
                        console.log("用户名或密码错误");
                        this.mon = true

                    } else if(status == 500) {
                        console.log("服务器错误");
                    } 
                    console.log(this.token);
                    console.log(response);
                })
            // }
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/style/mixin.scss';

#login {
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
        width: 100%;
        justify-content: space-between;
        align-items: center;
        padding: 0  $spacing-row-base;
        .top-bar-right {
            float: right;
            span {
                font-size: $font-size-lg;
                font-weight: 500;
                color: $text-color;
                @include px2rem(line-height, 88);
            }
        }
    }

    .logo {
        img {
            @include px2rem(margin-top, 198);
            @include px2rem(height, 92);
            @include px2rem(width, 194);
        }
    }
    .main {
        @include px2rem(padding-top, 48);
        
        .title {
            @include px2rem(font-size, 56);
            @include px2rem(line-height, 88);
            font-weight: 500;
            color: $text-color;
        }
        .slogan{
            @include px2rem(font-size, 40);
            @include px2rem(line-height, 56);
            color: $text-color-grey;

        }

        .inputs {
            @include px2rem(padding-top, 48);
            input {
                @include px2rem(padding-top, 40);
                @include px2rem(height, 88);
                width: 100%;
                font-size: $font-size-lg;
                font-weight: 500;
                color: $text-color;
                border-bottom: 1px solid $border-color;
            }
            input::-webkit-input-placeholder {color: #aaa; font-weight: 500;}
        }
        .tips {
            float: left;
            font-size: $font-size-lg;
            color: $color-warning;
            @include px2rem(height, 56);
        }
        .submit {
            @include px2rem(margin-top, 120);
            text-align: center;
            div {
                background-color: $color-primary;
                margin: 0 auto;
                @include px2rem(width, 520);
                @include px2rem(height, 96);
                @include px2rem(font-size, 32);
                @include px2rem(line-height, 44);
                @include px2rem(border-radius, 48);
                font-weight: 500;
                color: rgba(39, 40, 50, 1);
                box-shadow: 0px 50px 32px -36px rgba(255,228,49,0.4);
                text-align: center;
                
            }
        }
    }
}
</style>