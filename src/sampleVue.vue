// simple vue just for practice

<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.3.4/vue.min.js"> </script>
+    <title>Learning Vue.js! :D</title>
+  </head>
+  <body>
+    <div id="app">
+      <input v-model="message"><br />
+      {{ message }}
+      <ul>
+        <li v-for="doggo in doggos">{{ doggo }}</li>
+      </ul>
+      <button v-on:click="buttonClick">marco</button>
+    </div>
+    <script>
+      new Vue({
+        el: '#app',
+        data: {
+          'message': 'Hello World',
+          'doggos': ['shiba inu', 'golden retriever']
+        },
+        methods: {
+          buttonClick: function() {
+            alert('polo')
+          }
+        }
+      });
+    </script>
