<template>
<div>
Hello {{name}}
{{age}}
{{color}}
</div>
</template>
<script>
export default {
    name: 'hello2',
    data () {
        return {
            name: "bob"
            , age: 26

        }
    }
    , props: ['color']
}
</script>
