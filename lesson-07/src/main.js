// import Vue from 'vue'
import App from './App'
import text from '@/print'

text('print.js')

new Vue({
  render: h => h(App)
}).$mount('#box')
