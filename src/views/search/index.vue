<template>
  <div id="search">
    <div class="search-container">
      <div class="search-input">
        <i class="iconfont">&#xe7d1;</i>
        <input type="text"  v-model.trim="search_val" placeholder="请输入要搜索的内容">
      </div>
      <span class="btn-search" @click="goBack">取消</span>
    </div>
    <div class="main">
      <div class="user part">
        <div class="title">
          <span>用户</span>
        </div>
        <div class="list">
          <div class="item user-item" v-for="user in userArr" :key="user.id">
            <div class="item-left">
              <img :src="user.imgurl" alt="">
              <div class="names">
                <div class="name">{{user.name}}</div>
                <div class="email">{{user.email}}</div>
              </div>
            </div>
            <div class="item-right" v-if="user.tip != 2" @click="showFriendPage(user._id)">
              <div>
                  {{user.tip == 0 ? "加好友" : "发消息"}}

              </div>
            </div>
          </div> 
        </div>
      
      </div>

      <div class="group part">
        <div class="title">
          <span>群组</span>
        </div>
        <div class="list">
          <div class="item group-item">
            <div class="item-left">
              <img src="@/assets/images/img/two.png" alt="">
              <div class="names">
                <div class="name">王帅傅</div>
                <div class="email">331144923@qq.com</div>
              </div>
            </div>
            <div class="item-right" v-if="user.tip != 2">
              <div>
                {{user.tip ? "加好友" : "发消息"}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <div class="motify" ref="motify">

      <div class="motify-header" >
        <div class="close" @click="close">取消</div>
        <div class="title">添加好友</div>
        <div class="define" @click="addFriend">确认</div>
      </div>
      <div class="motify-main">
        <input type="text" v-model="friendMsg">
        <div class="space"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {searchUser} from '@/api/search'
import {addFriend, isFriend} from '@/api/friend'
import {getInfo} from '@/utils/auth'

  export default {
    mounted() {
      this.user = getInfo();

    },
    data() {
      return {
        baseURL: 'http://127.0.0.1:3000',
        search_val: "",
        user: {},
        userArr:[],
        willAddFid: '',
        friendMsg: ''
      }
    },
    methods: {
      goBack() {
        this.$router.go(-1);
      },
      close() {
        this.$refs.motify.style.top = "100vh";
      },
      showFriendPage(id) {
        this.$refs.motify.style.top = 0;
        this.willAddFid = id;
      },
      addFriend() {
        if(this.willAddFid && this.friendMsg) {
          let data = {
            uid: this.user.id,
            fid: this.willAddFid,
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
        }
      },
      isFriend(e) {
        if(this.user.id == e._id) {
          e.tip = 2;
        } else {
            let data = {
            uid: this.user.id,
            fid: e._id
          }
          isFriend(data).then(response => {
            let status = response.data.status;
            if(status == 200) {
              e.tip = response.data.result != null;
              e.imgurl = this.baseURL + '/user/' + e.imgurl;
              this.userArr.push(e);
            } else if(status == 500){
              console.log("服务器错误");
            }
          })

          }
      }
    },
    watch: {
      search_val() {
        let data = {
          data: this.search_val,
          token: this.user.token

        }
        searchUser(data).then(response => {
          let status = response.data.status;
          console.log(response);
          if(status == 200) {
            this.userArr = [];
              let arr = response.data.result;
              arr.forEach(e => {
                this.isFriend(e);

              });               
          } else if(status == 300) {
            this.$router.push('/login')
            console.log("token过期");
          } else if(status == 500) {
              console.log("服务器错误");
          } 
          // console.log(this.token);
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "@/style/mixin";
  #search {
    padding: 0  $spacing-row-base;
    @include px2rem(padding-top, 88);
    .search-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      @include px2rem(height, 88);
      @include px2rem(padding-top, 21);
      display: flex;
      background: #fff;
      .search-input, .btn-search {
          @include px2rem(line-height, 60);
          font-size: 0.2rem;
      }
      .search-input {
        flex: 1;
        background: rgb(239, 238, 244);
        border-radius: 0.4rem;
        margin: 0 10px;
        @include px2rem(padding-left, 10);
        input {
          width: 85%;
          height: 100%;
          border: none;
          text-indent: 20px;
          outline: none;
          background: rgba(237, 237, 237, 0.1);
          line-height: normal;
          &::-webkit-input-placeholder {
            font-size: 0.3rem;
          }
        }
      }
      .btn-search {
        font-size: $font-size-lg;
        font-weight: 500;
        color: $text-color;
        @include px2rem(margin-right, 35);
      }
    }
    .part {
      .title {
        @include px2rem(font-size, 44);
        @include px2rem(line-height, 60);
        padding-top: $spacing-col-base;
        font-weight: 600;
        color: $text-color;
      }

      .list {
        .item {
          overflow: hidden;
          padding: $spacing-col-sm 0;
          .item-left {
              float: left;
              img {
                  display: inline-block;
                  @include px2rem(width, 88);
                  @include px2rem(height, 88);
                  background-color: $color-primary;
                  border-radius: $border-radius-base;
              }
              .names {
                display: inline-block;
                @include px2rem(font-size, 36);
                @include px2rem(line-height, 50);
                @include px2rem(margin-left, 10);
                font-weight: 400;
                color: $text-color;
        }
          }
          .item-right {
            float: right;
            @include px2rem(width, 120); 
            @include px2rem(height, 88); 
            position: relative;
            div {
              @include px2rem(width, 120); 
              @include px2rem(line-height, 48); 
              @include px2rem(border-radius, 24); 
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%,-50%);
              background-color: $color-primary;
              font-size: $font-size-base;
              color: $text-color;
              text-align: center;

            }
              
          }

        }
        
      }
        
    }
    .motify {
      position: fixed;
      padding: 0  $spacing-row-base;

      width: 100%;
      top: 100%;
      left: 0;
      .motify-header {
        display: flex;
        justify-content: space-between;
      }
      .motify-main{
        input {
          width: 100%;
          height: 50px;
          background-color: #afafaf;
        }
        .space{
          height: 100%;
          width: 100%;
        }
      }
    }

  }

</style>
