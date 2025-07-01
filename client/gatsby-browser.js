/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-browser/
 */

// You can delete this file if you're not using it

import * as React from 'react'
import { Provider } from 'react-redux'
import { store } from './src/redux/store'
import { loadAuthFromStorage } from "./src/redux/initAuth";

loadAuthFromStorage(store);

export const wrapRootElement = ({ element}) => (
    <Provider store={store}>{element}</Provider>
)