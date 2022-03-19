<template>
    <div id="login">
        <div class="top-bar">
            <div class="top-bar-left" @click="goBack">
                <img class="back-img" src="@/assets/images/common/back.png" alt="">
            </div>
        </div>

        <div class="logo">
            <img src="@/assets/images/sign/logo1.png" alt="">
        </div>

        <div class="main">
            <div class="title">
                <span>注册</span>
            </div>

            <div class="inputs">
                <div class="inputs-div">
                    <input type="text" class="user" v-model="user" placeholder="用户名" @blur="isNameOk">
                    <div class="employ" v-if="userEmploy">
                        <span>已占用</span>
                    </div>
                    <img src="@/assets/images/sign/right1.png" class="ok" alt="" v-if="isUser">
                </div>
                <div class="inputs-div">
                    <input type="text" class="email" placeholder="邮箱" v-model="email" @blur="isEmailOk">
                    <div class="employ" v-if="emailEmploy">
                        <span>已占用</span>
                    </div>
                    <div class="isEmail" v-if="!isEmail">
                        <span>邮箱无效</span>
                    </div>   
                    <img src="@/assets/images/sign/right1.png" class="ok" alt="" v-if="isEmail">
                </div>
                <div class="inputs-div">
                    <input :type="type" class="pwd" placeholder="密码" v-model="pwd" @input="throttle(fnIsOk,300)">
                    <img :src="this.lookUrl" alt="" class="look" @click="looks">
                </div>
            </div>
            <div :class="isOk ? 'submit' : 'submit1'">
                <button @click="register">注册</button>
            </div>

        </div>

    </div>
</template>

<script>
import {registerApi,registerJudge} from '@/api/register'

export default {
    data() {
        return {
            type: "password",
            user: '',
            pwd: '',
            email: '',
            isUser: false,
            isEmail: false,
            look: false,    //是否显示密码
            userEmploy: false,
            emailEmploy: false,
            isOk: false,
            lookUrl: require("@/assets/images/sign/biyan.png"),
            text:[]

        }
    },
    methods: {
        looks() {
            if (this.look) {
                this.look = false;
                this.type = "password";
                this.lookUrl = require("@/assets/images/sign/biyan.png");

            } else {
                this.look = true;
                this.type = "text";
                this.lookUrl = require("@/assets/images/sign/look.png");
            } 
        },
        isEmailOk() {
            // let szReg=/^[A-Za-zd]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/;
            // if(szReg.test(this.email)) {
                console.log(1);

                registerJudge({
                    data: this.email,
                    type: 'email'
                }).then(response => {
                    if(response.status == 200) {
                        this.isEmail = response.data.rest == 0;
                        console.log(response);

                        this.fnIsOk();
                    }
                    else {
                        console.log(response);
                    }
                })
            // } else {
            //     this.isEmail = false;
            // }
        },
        isNameOk() {
            registerJudge({
                data: this.user,
                type: 'name'
            }).then(response => {
                if(response.status == 200) {
                    this.isUser = response.data.rest == 0;
                    this.fnIsOk();
                }
                else {
                    console.log(response);
                }
            })
        },
        goBack() {
            this.$router.go(-1);
        },
        fnIsOk() {
            this.isOk =  this.email && this.user && this.pwd && this.isEmail && !this.emailEmploy && !this.userEmploy;
        },
		throttle(fn,delay = 300){
            this.text.push(fn);
            if(fn.timer) {
                clearTimeout(fn.timer);
            }
            var context = this;
            var args = arguments;
            fn.timer = setTimeout(function(){
                fn.apply(context,args);
                fn.timer = null;
            },delay)
		},
        register() {
            if(this.isOk) {
                registerApi({
                    mail: "xiaohai@163.com",
                    name : "小海",
                    pwd: "12345678"
                }).then(response => {
                    if(response.status == 200) {
                        this.$router.push({ path: 'login' })                        
                    } else {
                        console.log(response);
                    }
                })
            } else {
                alert("不正确")
            }
        }
    }
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

    .logo {
        img {
            @include px2rem(margin-top, 198);
            @include px2rem(height, 92);
            @include px2rem(width, 194);
        }
    }
    .main {
        @include px2rem(padding-top, 48);
        width: 100%;
        .title {
            @include px2rem(font-size, 56);
            @include px2rem(line-height, 88);
            font-weight: 500;
            color: $text-color;
        }

        .inputs {
            .inputs-div {
                position: relative;
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
                .employ,.isEmail{
                    @include px2rem(line-height, 88);
                    @include px2rem(top, 20);
                    position: absolute;
                    right: 0;
                    color: $color-warning;
                    font-weight: 500;
                    font-size: $font-size-base;
                }
                .ok {
                    @include px2rem(top, 50);
                    @include px2rem(width, 38);
                    @include px2rem(height, 30);
                    position: absolute;
                    right: 0;
                }
                .look {
                    @include px2rem(top, 50);
                    @include px2rem(width, 32);
                    @include px2rem(height, 18);
                    position: absolute;
                    right: 0;
                }

            }

        }
        .submit {
            @include px2rem(margin-top, 120);
            text-align: center;
            button {
                background-color: $color-primary;
                margin: 0 auto;
                @include px2rem(width, 520);
                @include px2rem(height, 96);
                @include px2rem(font-size, 32);
                @include px2rem(line-height, 44);
                @include px2rem(border-radius, 48);
                font-weight: 500;
                color:  $text-color;
                box-shadow: 0px 50px 32px -36px rgba(255,228,49,0.4);
                text-align: center;
                
            }
        }
        .submit1 {
            @include px2rem(margin-top, 120);
            text-align: center;
            button {
                background-color: rgba(39, 40, 58, 0.2);
                margin: 0 auto;
                @include px2rem(width, 520);
                @include px2rem(height, 96);
                @include px2rem(font-size, 32);
                @include px2rem(line-height, 44);
                @include px2rem(border-radius, 48);
                font-weight: 500;
                color: $text-color-inverse;
                text-align: center;
                
            }
        }
    }
}
</style>