<template>
    <h1 class="title" :style="{'border-left-color': borderLeftColor}">{{title}}</h1>
</template>

<script>
    export default {
        props: {
            title: {
                type: String
            },
            borderLeftColor: {
                type: String
            }
        }
    };
</script>

<style lang="scss" scoped>
    .title {
        display: inline-block;
        font-weight: 700;
        font-size: 1.8rem;
        padding-left: 10px;
        border-left: 3px solid;
        margin: 1.5rem 0;
        line-height: 1.6rem;
        vertical-align: top;
    }
</style>
