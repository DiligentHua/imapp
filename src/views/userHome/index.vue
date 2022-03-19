<template>
    <div id="user-home"  @click="test">
        <div class="bg" ref="bg" :style="{'background-image': `url${(bgImg)}`}"></div>
        <div class="bg-white"></div>
        <div class="top-bar">
            <div class="top-bar-left" @click="goBack">
                <img class="back-img" src="@/assets/images/common/back.png" alt="">
            </div>
            <div class="top-bar-right">
                <img class="more-img" src="@/assets/images/userhome/more.png" alt="" @click="more">
            </div>
        </div>
        <div class="main">
            <div class="user-header">
                <div class="sex">
                    <img src="@/assets/images/userhome/female.png" alt="">
                </div>
                <img class="user-img" :src="friend.imgurl" alt="">
            </div>

            <div class="user-inf">
                <div class="name">{{friend.name}}</div>
                <div class="nick">{{friend.nick}}</div>
                <div class="intr">{{friend.intr}}</div>
            </div>
        </div>

        <div class="bottom-btn" @click="clickBtn">
            {{btnText[btnType]}}
        </div>

        <div class="add-misg" ref="addMisg">
            <div class="name">{{user.name}}</div>
            <input type="text" v-model="friendMsg" class="add-main">
            <div class="cancle" @click="cancle">取消</div>
            <div class="add" @click="add">添加</div>
        
        </div>


        <div class="more" ref="more">
            <div class="delete" v-if="btnType == 1" @click="deleteFriend">删除好友</div>
            <div class="cancle" @click="cancleMore">取消</div>
        
        </div>

    </div>
</template>

<script>
import {getInfo} from '@/utils/auth'
import {addFriend, isFriend, deleteFriend} from '@/api/friend'
import {getUserInfo} from '@/api/user'

import config from '../../config'


export default {
    data() {
        return {
            user: null,
            friend: {
                imgurl: ""
            },
            bgImg: "../../../src/assets/images/img/one.png",
            btnType: 0,
            btnText:["修改资料", "发送消息", "添加好友"],
            friendMsg: "请求添加好友"

        }
    },
    methods: {
        deleteFriend() {
            let data = {
                uid: this.user.id,
                fid: this.$route.query.id,
            }
            deleteFriend(data).then(response =>  {
                let status = response.data.status;
                if(status == 200) {
                    console.log("删除成功");
                } else {
                    console.log("删除失败");
                }
            })
        },
        getUserInfo() {
            let data = {
                data: this.$route.query.id
            }
            console.log(data);
            getUserInfo(data).then(response => {
                console.log(response);
                let status = response.data.status;
                if(status == 200) {
                    this.friend = response.data.result;
                    this.friend.imgurl = config.baseURL+'/user/'+this.friend.imgurl;

                }
            })
        },
        clickBtn() {
            if(this.btnType == 0) {
                console.log("修改资料");
            } else if(this.btnType == 1) {
                this.$router.push({name: 'chatRoom', params: { friend:  this.friend}})
            } else {
                this.$refs.addMisg.style.bottom = 0;
            }
        },
        goBack() {
            this.$router.go(-1);
        },
        test() {
            console.log(this.$refs.bg.style);
        },
        add() {
          let data = {
            uid: this.user.id,
            fid: this.$route.query.id,
            message: this.friendMsg
          }
          addFriend(data).then(response => {
            let status = response.data.status;
            if(status == 200) {
              console.log(response);
            } else if(status == 500){
              console.log("服务器错误");
            }
          })
        },
        cancle() {
            this.$refs.addMisg.style.bottom = "-60vh";
        },
        more() {
            this.$refs.more.style.bottom = 0;
        },
        cancleMore() {
            this.$refs.more.style.bottom = "-40vh";
        },
    },
    created() {
        
        this.user = getInfo();
        if(this.user == null) {
            this.$router.push('/login');
        } 
        this.getUserInfo();
        // console.log(this.$route.params.id);
        if(this.user.id == this.$route.query.id) {
            this.btnType = 0;
        }  else {
            let data = {
                uid: this.user.id,
                fid : this.$route.query.id
            }
            isFriend(data).then(response => {
                let status = response.data.status;
                if(status == 200) {
                    if(response.data.result != null) {
                        this.btnType = 1;
                    } else {
                        this.btnType = 2;
                    }
                } else if(status == 500){
                    console.log("服务器错误");
                }
            }) 
        }

    }

}
</script>

<style lang="scss" scoped>
@import '@/style/mixin.scss';
#user-home {
    padding: 0  $spacing-row-base;
    @include px2rem(padding-top, 88);
    height: 100%;
    .bg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-size: cover;
        background-position: center 0;
        background-image: url('../../../src/assets/images/img/one.png');
        filter: blur(16px);
        z-index: -1;
        // background-color: aqua;
    }
    .bg-white {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: white;
        opacity: 0.4;
        z-index: 0;

    }
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
        .top-bar-right {
            float: right;
            @include px2rem(height, 88);
            @include px2rem(width, 88);
            .more-img {
                @include px2rem(margin-top, 41);
                @include px2rem(height, 12);
                @include px2rem(width, 52);
            }
        }
    }

    .main {
        text-align: center;
        @include px2rem(padding-top, 148);

        .user-header{
            z-index: 15;
            position: relative;
            @include px2rem(height, 412);
            @include px2rem(width, 412);
            margin: 0 auto;
            .user-img{
                
                @include px2rem(border-radius, 48);
                @include px2rem(height, 400);
                @include px2rem(width, 400);
                border: 6px solid white;
            }
            .sex {
                position: absolute;
                text-align: center;
                @include px2rem(height, 64);
                @include px2rem(width, 64);
                @include px2rem(right, 22);
                @include px2rem(bottom, 22);
                background-color: rgba(255, 93, 91, 1);
                border-radius: $border-radius-circle;
                img {
                    @include px2rem(padding-top, 16);
                    @include px2rem(height, 32);
                    @include px2rem(width, 32);
                }
            }
        }
        .user-inf {
            @include px2rem(margin-top, 32);
            
            
        }
    }

    .bottom-btn {
        position: fixed;
        text-align: center;
        bottom: 0;
        background-color: yellow;
        height: 30px;
        line-height: 30px;
        width: 80vw;
    }

    .add-misg {
        z-index: 100;
        position: fixed;
        bottom: -60vh;
        width: 100%;
        height: 60%;
        background-color: white;
        border-radius: 20px;
        padding: 30px;
        padding-top: 60px;
        
        input {
            background-color: yellow;
        }
        div {
            background-color: violet;
        }
    }
    .more {
        z-index: 100;
        position: fixed;
        bottom: -40vh;
        width: 100%;
        height: 40%;
        background-color: white;
        border-radius: 20px;
        padding: 30px;
        padding-top: 60px;
        
        input {
            background-color: yellow;
        }
        div {
            background-color: violet;
        }
    }
}
</style>