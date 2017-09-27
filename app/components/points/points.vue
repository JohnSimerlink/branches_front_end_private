<template>
    <div class="">
        {{displayPoints | round}}
    </div>
</template>
<script>
    export default {
        async created() {
        },
        watch: {
            points(newVal, oldVal){
//                console.log("points watch called", newVal, oldVal)
//                const time = 1000
//                const delta = Math.abs(newVal - oldVal)
//                let i = 0;
//                const me = this
//                const animationInterval = setInterval(function(){
//                    if (i > delta) clearInterval(animationInterval)
//                    me.displayPoints++
//                    i++
//                }, time/delta)
            }
        },
        data() {
            return {
            }
        },
        computed: {
            points(){
                console.log("points changed", this.$store.state.points)
                return this.$store.state.points
            },
            displayPoints() {
                return this.points
            }
        }
    }
</script>
<style>

</style>