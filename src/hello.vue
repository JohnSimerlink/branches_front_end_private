<template>
  <div>
  Hello {{name}}
  {{age}}
  {{color}}
  </div>
</template>
<script>
export default {
    name: 'hello',
  data () {
    return {
      name: "bob"
      , age: 26

    }
  }
  , props: ['color']
}
</script>
                                                                                                                                                                                       90