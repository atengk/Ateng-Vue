import type { App } from 'vue'
import focus from './focus'

export function setupDirectives(app: App): void {
    app.directive('focus', focus)
}
