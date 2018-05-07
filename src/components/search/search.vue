<template>
    <div class="search-container">
        <div class="search-wrapper" @keyup.enter="enterSearch">
            <el-input size="small"
                      placeholder="搜索文件名或存证编号"
                      v-model="searchText"></el-input>
        </div>
        <el-button type="primary" size="small" style="vertical-align: -6px;" @click.native="search">搜索</el-button>
    </div>
</template>

<script>
    export default{
        data () {
            return {
                searchText: ''
            };
        },
        methods: {
            search () {
                if (this.searchText === '') {
                    this.$message({
                        message: '搜索框为空',
                        type: 'warning',
                        showClose: true
                    });
                } else {
                    this.$store.dispatch('GetSearchFile', {searchText: this.searchText});
                }
                this.$emit('search');
            },
            enterSearch () {
                this.search();
            }
        }
    };
</script>

<style lang="scss" scoped>
    .search-container {
        margin: 15px 0;
        .search-wrapper {
            float: left;
            margin-right: 6px;
        }
    }
</style>
