<template>
    <div class="content">
        <input id="file" type="file" @change="uploadImg($event)">
    </div>
</template>


<style lang="scss" scoped>
.content {
    #file {
        height: 30px;
        widows: 100px;
        background-color: black;
    }
}
</style>

<script>
import {upload} from '@/api/upload'

export default {
    methods: {
        uploadImg(event) {
            let formData = new FormData();
            console.log(event.target.files);
            
            for (let i = 0; i < event.target.files.length; i++) {
                  formData.append('file', event.target.files[i])
            }
            try{
                upload(formData).then(response => {
                    console.log(response);
                });
            } catch(e) {
                console.log(e);
            }


        }
        
    }
}
</script>
