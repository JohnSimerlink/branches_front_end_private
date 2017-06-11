<template>
  <li class='fact'>
    <span>{{id}}:</span>
    <span class='question'> {{question}} </span>
    <span class='answer'> {{answer}} </span>
  </li>
</template>


<script>

export default {
  name: 'fact',
  data() {
    return {}// this.props['data']
  },
  props: ['id', 'question', 'answer']
}
</script>