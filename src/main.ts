import '@logseq/libs'
import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

async function main() {
        // Preparation code

        // Hide plugin UI via Esc
        document.addEventListener('keydown', function (e) {
                if (e.keyCode === 27) {
                        logseq.hideMainUI({ restoreEditingCursor: true })
                }
                e.stopPropagation()
        }, false)

        // Hide plugin UI when clicking anywhere
        document.addEventListener('click', (e) => {
                if (!(e.target as HTMLElement).closest('.toc') && (e.target as HTMLElement).id != 'search') {
                        logseq.hideMainUI({ restoreEditingCursor: true })
                }
        })
  createApp(App).mount('#app')

}

// Bootstrap the plugin
logseq.ready(main).catch(console.error)