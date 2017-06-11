<template>
  <div>
  Hello {{name}}
  {{age}}
  {{color}}
  </div>
</template>
<script>
export default {
  data () {
    return {
      name: "bob"
      , age: 26

    }
  }
  , props: ['color']
}
</script>