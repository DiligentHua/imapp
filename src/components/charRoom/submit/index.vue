<template>
	<div class="content">
		<div class="submit">
			<input type="text" v-model="message" @submit="send" @keyup.enter="send">
			<div class="btn" @click="send(message,0)">
				发送
				<div class="voice">
				<!-- <input id="file" type="file" @change="sendImage($event)"> -->

				</div>
				<div class="more"></div>
			</div>
		</div>
	</div>
</template>

<script>
import {sendImageMessage} from '@/api/message'
// import {upload} from "@/api/upload"
export default {
	data() {
		return {
			message: '',
			test: ''
		}
	},
	props: {
		friendType: Number
	},
	methods: {
		send(message,type) {
			let ack  = Date.now();
			
			this.$store.commit("addAck", {ack})
			// console.log(.getters.isAck(ack));
			let data = {
				message: message,
				time: new Date(),
				type: type,
				ack: ack,
				friendType: this.friendType
			}
			this.$emit('inputs', data);
			
		},
        sendImage(event) {
			// let messageInfo = {
			// 	userID: uid,	//用户id
			// 	friendID: fid,	//好友id
			// 	type: 1,	//内容类型（0文字，1图片链接，2音频链接...)
			// 	time: new Date(),   //发送时间
			// 	state: 1,	
			// }
            let formData = new FormData();
            console.log(event.target.files);
            for (let i = 0; i < event.target.files.length; i++) {
                  formData.append('file', event.target.files[i])
            }
            try{
                sendImageMessage(formData).then(response => {
					console.log(response);
                    let status = response.data.status;
					if(status == 200) {
						// this.test = response.data.message;
						this.send(response.data.result.message, 1)
					}
                });
            } catch(e) {
                console.log(e);
            }
        }
	}
}
</script>

	<style lang="scss" scoped>
		@import '@/style/mixin.scss';
		.submit{
			height: 40px;
			display: flex;
			input {
				width: 70%;
				border: solid black 2px;
				height: 100%;
			}
			.btn {
				flex: 1;
				text-align: center;
				background-color: yellow;
				line-height: 40px;
			}
			// background-color: aquamarine;
		}
	</style>
