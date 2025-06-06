/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import pinia from '@/stores'
import router from '@/router'
import { configure } from 'vue-gtag';

configure({
  tagId: 'G-GFLM2J7QL7',
  pageTracker: {
    router,
  },
})

export function registerPlugins (app) {
  app
    .use(vuetify)
    .use(router)
    .use(pinia)
}
