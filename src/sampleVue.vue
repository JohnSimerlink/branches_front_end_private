<template>
    <div id="app">
        <input v-model="message"><br />
        {{ message }}
        <ul>
            <li v-for="doggo in doggos">{{ doggo }}</li>
        </ul>
        <button v-on:click="buttonClick">marco</button>
    </div>
</template>

<script>
//  new Vue({
//    el: '#app',
//    data: {
//      'message': 'Hello World',
//      'doggos': ['shiba inu', 'golden retriever']
//    },
//    methods: {
//      buttonClick: function() {
//        alert('polo')
//      }
//    }
//  });
    //^^Shaffan, modify the above code so that it follows the same structure/pattern as that of hello.vue :)
</script>
