<template>
    <div class="wrap">
        <div class="play tc">
            <div v-if="forensicsStatus.begin===0" @click="beginForensics">
                <img class="img" src="../img/play.png" alt="">
                <h1 class="f12 color-white" >开始取证</h1>
            </div>
            <div v-else @click="pauseForensics" class="pause">
                <img class="img" src="../img/pause.png" alt="">
                <h1 class="f12 color-white" >停止</h1>
            </div>
        </div>
        <div class="screenshot tc">
            <div v-if="forensicsStatus.begin===0">
                <img style="color:black" src="../img/screenshot_b.png" alt="">
                <h1 class="f12 color-grey">截屏</h1>
            </div>
            <div v-else @screenshot="screenshot">
                <img src="../img/screenshot.png" alt="">
                <h1 class="f12 color-white">截屏</h1>
            </div>
        </div>
        <div class="time tr">
            <div class="vm">
                <!-- <h1 class="f18 color-white">00:00:10</h1> -->
                <div>
                    <span class="f18 color-white">{{timepiece.hour}}:</span>
                    <span class="f18 color-white">{{timepiece.minute}}:</span>
                    <span class="f18 color-white">{{timepiece.second}}</span>
                </div>
                
            </div>
            
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                forensicsStatus: {
                    begin: 0,
                    pause: 1
                },
                timepiece: {
                    hour: 10,
                    minute: 25,
                    second: 36
                },
                beginTime: 0
            };
        },
        methods: {
            beginForensics() {
                this.forensicsStatus.begin = 1;
                this.beginTime = new Date();
                console.log(this.beginTime);
            },
            pauseForensics() {
                this.forensicsStatus.begin = 0;
                this.$emit('pause-forensics', true);
            },
            screenshot() {
                this.$emit('screenshot', true);
            }
        }
    };
</script>

<style lang="scss" scoped>
    .wrap{
        height: 70px;
        background-color: rgba(13, 16, 23, 0.096);
        display: flex;
        align-items: center;
        .play{
            flex: 1;
            // border: 1px solid red;
            padding-top: 13px;
            cursor: pointer;
            h1 {
                margin-top: 2px;
            }
            img {
                width: 25px;
                height: 25px;
                // border: 1px solid red;
            }
        }
        .screenshot{
            flex: 1;
            // padding-top: 10px;
            cursor: pointer;
            img {
                    width: 25px;
                    height: 25px;
                }
        }
        .time{
            flex: 6;
            line-height: 70px;
            padding-right: 50px;
        }
    }
</style>
