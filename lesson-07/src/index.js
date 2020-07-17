import './assets/style/style.css'
import './assets/style/index.scss'

const pro = () => {
  return new Promise((resolve, reject) => {
    resolve('aaa')
  })
}
pro().then(res => {
  console.log(res)
})
console.log('Hello World!')
