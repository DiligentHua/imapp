<template>
    <div id="content">
        <div class="top-bar">
            <div class="top-bar-left" @click="goBack">
                <img class="back-img" src="@/assets/images/common/back.png" alt="">
            </div>
            <div class="top-bar-center">
                {{friend.name}}
            </div>
            <div class="top-bar-right">
                <img src="../../../src/assets/images/img/one.png" alt="">
            </div>
        </div>
        <div class="chat" ref="scrollWrapper">
            <div class="chat-main">
                <div class="chat-ls" v-for="(item,index) in msgs" :key="index">
                    <div class="chat-time">
                        {{changeTime(item.time)}}
                    </div>
                    <div class="msg-m msg-left" v-if="item.uid != user.id">
                        <img :src="friend.imgurl" alt="" class="user-img" @click="toFriendHome(friend)">
                        <div class="messages">
                            <div class="msg-text" v-if="item.type == 0">
                                {{item.message}}
                            </div>
                            <div class="msg-img" v-else-if ="item.type == 1">
                                <img :src="item.message" alt="">
                            </div>
                        </div>
                    </div>
                    <div class="msg-m msg-right" v-if="item.uid == user.id">
                        <img :src="user.imgurl" alt="" class="user-img">
                        <div class="messages">
                            <div class="msg-receipt" v-if="friendType == 1 && item.userNumber && item.receiptNumber"> {{item.receiptNumber + '/' + item.userNumber}}</div>
                            <div class="msg-read" v-if="friendType == 0"> {{item.state == 0 ? "已读" : "未读"}}</div>
                            <div class="msg-text" v-if="friendType == 0 && item.ack && $store.getters.isAck(item.ack) >= 0">"{{item.ack + '' + $store.getters.isAck(item.ack)}}"</div>
                            <div class="msg-text" v-if="item.type == 0">
                                {{item.message}}
                            </div>
                            <div class="msg-img" v-else-if ="item.type == 1">
                                <img :src="item.message" alt="">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="submit">
            <Submit @inputs="inputs" :uid="user.id" :fid="user.id.id" :friendType="friendType" ></Submit>
        </div>
    </div>
</template>

<script>
import BScroll from 'better-scroll'
// import datas from '@/commons/js/datas';
import dataFun from '@/commons/js/myfun';
import Submit from '@/components/charRoom/submit/index.vue' 
import {getMessage,readMessage,readMessageForGroup  } from "@/api/message"
import {getInfo} from '@/utils/auth'
import config from '../../config'
import socketio from 'socket.io-client';

export default {
    data() {
        return {
            loading: false,
            friendType: 0,
            scrollWrapper: null,
            user: {
                id: ""

            },
            msgs: [],
            friend: {
                
            },
            receiptMsgs:[],
            nowPage:0 ,
            pageSize: 15,
            io: null,
            timer: null
        }
    },
    created() {
        if(this.$route.params.friend) {
            this.friend = this.$route.params.friend;
            this.friendType = this.$route.params.friendType;
        } else {
            this.$router.go(-1);
        }
        this.user = getInfo();

        this.io  = socketio('http://localhost:3000', {
            transports: ['websocket'],
        })
    },
    mounted() {
        this.scrollWrapper = this.$refs.scrollWrapper;
        if(this.user) {
            this.user.imgurl = config.baseURL+'/user/'+this.user.imgurl;
        } else {
            this.$router.push('/login')
        }
        

        this.readMessage();
        this.firstGetMsg();
        this.io.emit("login", this.user.id)

        //收到消息
        this.io.on("message", (data) => {
            this.receiveMessage(data);
            this.io.emit("readUserMessage",{
                uid: this.user.id,
                fid: this.friend.id,
                friendType: this.friendType,
                messageID: data.id 
            });

        })
        //收到1对1消息回执
        this.io.on("messageReceived", () => {
            let l = this.msgs.length;
            for(let i = 0; i < l; i++) {
                this.msgs[i].state = 0;
            }

        })
        //接收回执群消息
        this.io.on("receiptMsgs",data => {
            this.receiptMsgs = data;
            console.log(data);
            data.forEach(item => {
                this.msgs.forEach(j => {
                    if(j.id == item.id) {
                        j.userNumber = item.userNumber;
                        j.receiptNumber = item.receiptNumber;
                    }
                })
            })
        });
        let data = {
            uid: this.user.id,
            fid: this.friend.id
        }
        if(this.friendType == 0) {
            console.log(this.friendType);
            this.io.emit("readUserMessage",data);  
        }
        this.timer = setInterval(() => {
            this.io.emit("getReceiptMsgs",this.receiptMsgs); 
        }, 10000);
        this.io.on("ackMessage", data => {
            this.msgs.forEach(item => {
                if(item.id == "" && item.ack == data.ack) {
                    item.id = data.id;
                }
            })
            this.receiptMsgs.forEach(item => {
                if(item.id == "" && item.ack == data.ack) {
                    item.id = data.id;
                }
            })
        })


    },
    destroyed() {
        this.io.disconnect(this.user.id);
        if(this.timer) {
            clearInterval(this.timer)
            this.timer = null;
        }
    },
    components: {
        Submit
    },
    methods: {
        listenScroll() {
            let _this = this;
            _this.$nextTick(() => {
                // 监听scroll事件
                _this.BScrollEvent.on('scroll', function (obj) {
                
                    //如果到达底部  请求加载更多数据
                    if (obj.y  >=  40) {
                        if (!_this.loading) {   //避免加载过程中 重复请求
                        _this.loading = true;
                        //请求加载更多
                        let data = {
                            uid: _this.user.id,
                            fid: _this.friend.id,
                            nowPage: _this.nowPage++  ,
                            pageSize: _this.pageSize,
                            friendType: _this.friendType
                            
                        }
                        getMessage(data).then(response => {
                            let status = response.data.status;
                            if(status == 200) {
                                response.data.result.forEach(e => {
                                    _this.msgs.unshift(e);
                                    if(e.uid == _this.user.id) {
                                        _this.receiptMsgs.unshift(e);
                                    }
                                });

                                //DOM重新渲染完毕后 重新计算better-scroll
                                _this.$nextTick(() => {
                                    _this.loading = false;
                                    _this.BScrollEvent.refresh();
                                })
                            }
                        })
                        }
                    }
                    })
            })
        },
        readMessage() {
            if(this.friendType == 1) return;
            let data = {
                fid: this.user.id,
                uid: this.friend.id,
            }
            readMessage(data).then(response => {
                console.log(response);
            })

        },
        readMessageForGroup(message) {
            let data = {
                uid: this.user.id,
                fid: this.friend.id,
                id: message.id
            }
            readMessageForGroup(data).then(response => {
                console.log(response);
            })

        },
        toFriendHome(friend) {
            this.$router.push({path: 'userHome', query: { id:  friend.id}})
        },
        receiveMessage(data) {
            this.msgs.push(data);
            this.$nextTick(() => {
                this.BScrollEvent.refresh();
            })
        },
        goBack() {
            this.$router.go(-1);
        },
        receiptGroupMessagetoServer(data) {

            this.io.emit("receiptGroupMessagetoServer", data);
        },
        //获取聊天数据
        firstGetMsg() {
            let data = {
                uid: this.user.id,
                fid: this.friend.id,
                nowPage: this.nowPage++,
                pageSize: this.pageSize,
                friendType: this.friendType,
                
            }
            getMessage(data).then(response => {
                let status = response.data.status;
                if(status == 200) {
                    response.data.result.forEach(e => {
                        this.msgs.unshift(e);
                        if(this.friendType == 1 && e.uid == this.user.id) {
                            e.receiptNumber = e.userNumber = 0;
                            this.receiptMsgs.unshift(e);
                        }
                    });
                    if(this.friendType == 1) {
                        if(this.msgs[this.msgs.length-1]) {
                            this.readMessageForGroup(this.msgs[this.msgs.length-1]);
                        }   
                        console.log(this.msgs[this.msgs.length-1]);
                        this.receiptGroupMessagetoServer({
                                fid:this.friend.id,
                                uid:this.user.id,
                                id: this.msgs[this.msgs.length-1].id
                            });
                    }
                    let _this = this;
                    _this.$nextTick(() => {
                        //dom渲染完成 初始化better-scroll
                        _this.BScrollEvent = new BScroll(_this.scrollWrapper, {click: true, probeType: 2});
                        //监听scroll事件
                        _this.listenScroll();
                    })

                }
            })
            // let msg = datas.message();
            // for(let i = 0; i < msg.length; i++) {
            //     msg[i].imgurl = '../../../src/assets/images/img/' + msg[i].imgurl;
            //     if(msg[i].types == 1) {
            //         msg[i].message = '../../../src/assets/images/img/' + msg[i].message;

            //     }
            //     this.msgs.unshift(msg[i]);  
            // }

        },
        changeTime(date) {
            return dataFun.dateTime(date);
        },
        inputs(data) {
            data.uid = this.user.id;
            data.fid = this.friend.id;
            data.state = 1;
            if(data.friendType == 1) {
                data.userNumber = data.receiptNumber = 0;
                data.id = "";
                this.io.emit("messageToGroup",data)
                this.receiptMsgs.push(data);
            } else {
                this.io.emit("message",data)
            }
            this.msgs.push(data);

            this.$nextTick(() => {
                this.BScrollEvent.refresh();
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    @import '@/style/mixin.scss';

    #content {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;
        padding: 0  $spacing-row-base;
    
        @include px2rem(padding-top, 88);
        @include px2rem(padding-bottom, 48);

        
        .top-bar {
            overflow: hidden;
            position: fixed;
            z-index: 100;
            left: 0;
            top: 0;
            @include px2rem(height, 88);
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0  $spacing-row-base;
            .top-bar-left {
                @include px2rem(height, 88);
                @include px2rem(width, 88);
                img {
                    @include px2rem(margin-top, 21);
                    @include px2rem(height, 46);
                    @include px2rem(width, 26);
                }

            }
            .top-bar-cneter {
                @include px2rem(height, 88);
                text-align: center;
                
            }
            .top-bar-right {
                img {
                    @include px2rem(width, 57);
                    @include px2rem(height, 57);
                }

            }

        }
        .chat {
            overflow: hidden;
            @include px2rem(padding-top, 88);
            width: 100%;
            .chat-ls {
                display: flex;
                flex-direction: column;
                .chat-time {
                    text-align: center;
                }
                .msg-m{
                    display: flex;
                    padding: 20px 0;
                    .user-img{
                        // flex: auto;
                        flex: none;
                        @include px2rem(height, 88);
                        @include px2rem(width, 88);
                        @include px2rem(border-radius, 20);

                    }
                    .messages {
                        flex: auto;
                        display: flex;


                    }
                    .msg-text{
                        @include px2rem(width, 480);
                        @include px2rem(min-height, 10);
                        border-radius: 0px 20px 20px 20px;
                        font-size: $font-size-lg;
                        color: $text-color;
                        padding: 18px 24px;
                    }

                }
                
                .msg-left{
                    flex-direction: row;
                    
                    .msg-text{
                        background-color: yellow;
                        @include px2rem(max-width, 480);
                        @include px2rem(min-height, 30);
                        border-radius: 0px 20px 20px 20px;
                        margin-left: 16px;
                    }
                    .msg-img{
                        margin-left: 16px;
                        img{
                            float: left;
                            height: 100px;
                            width: 100px;
                        }
                    }
                    .msg-map{
                        margin-left: 16px;
                        border-radius: 0 20px 20px 20px;
                    }
                    .voice{
                        text-align: right;
                    }
                    .voice-img{
                        float: left;
                        transform: rotate(180deg);
                        width: 28px;
                        height: 36px;
                        padding-bottom: 4px;
                    }
                }

                .msg-right{
                    flex-direction: row-reverse;
                    .messages {
                        justify-content: flex-end;

                    }
                    .msg-text{
                        background-color: #5f5;
                        margin-right: 16x;
                    }
                    .msg-img{
                        margin-right: 16px;
                        img{
                            float: right;
                            height: 100px;
                            width: 100px;
                        }
                    }
                    .msg-map{
                        margin-left: 16px;
                        border-radius: 0 20px 20px 20px;
                    }
                    .voice{
                        text-align: right;
                    }
                    .voice-img{
                        float: left;
                        transform: rotate(180deg);
                        width: 28px;
                        height: 36px;
                        padding-bottom: 4px;
                    }
                }

            }
        }
        .submit {
            position: fixed;
            left: 0;
            bottom: 0;
            width: 100%;
        }
    }
</style>


