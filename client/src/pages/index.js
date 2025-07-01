import * as React from 'react'
import { Provider } from 'react-redux'
import { store } from '../redux/store'

export default function Home() {
  return (
    <Provider store={store}>
      <h1>SkillStack</h1>  
    </Provider>
  )
}