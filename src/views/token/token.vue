<template>
    <div class="token-container"
         v-loading="loading"
         element-loading-text="拼命加载中"></div>
</template>

<script>
    import {mapActions} from 'vuex';

    export default {
        data() {
            return {
                loading: true
            };
        },
        created() {
            const urlToken = this.$route.params.id;
            this.adminToWeb(urlToken).then(res => {
                if (res === 0) {
                    this.loading = false;
                    this.$router.push('/');
                }
            });
        },
        methods: {
            ...mapActions([
                'adminToWeb'
            ])
        }
    };
</script>

<style lang="scss" scoped>
    .token-container {
        width: 100%;
        height: 100%;
    }
</style>
