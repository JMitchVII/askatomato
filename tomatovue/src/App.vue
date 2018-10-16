<template>
  <div id="app">
    <img src="./assets/tomato.svg" height="120vh">
    <h1>Ask the tomato a question.</h1>
    <input type="text" v-model="question">
    <button @click="sendQuestion()">Ask!</button>
    <h3>Answer:</h3><br/>
    <p>{{answer}}</p>

  </div>
</template>

<script>
  import axios from 'axios';

export default {
  name: 'app',
  data () {
    return {
      msg: 'No body asked for this!',
      question:'',
      answer:'this will take a long time to appear!',
    }
  },
  methods:{
    sendQuestion(){
      console.log('I gon dun asken da question.')
      axios.get('/users',{
        'timeout':Infinity,
        params:{
          question:this.question,
        }
      }).then((response)=>{
        console.log(response);
        this.answer = response.data? response.data : 'there was an error answering the question';
      }).catch((error)=>{
        console.log(error.response);
        this.answer = 'There was a problem fetching the quesion answer.'
      })

    }
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
