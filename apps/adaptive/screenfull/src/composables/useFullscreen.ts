import { ref, onMounted, onBeforeUnmount } from 'vue';
import screenfull from 'screenfull';

export function useFullscreen() {
    const isSupported = ref<boolean>(screenfull.isEnabled);
    const isFullscreen = ref<boolean>(false);

    const enter = (el?: HTMLElement) => {
        if (!screenfull.isEnabled) return;
        el ? screenfull.request(el) : screenfull.request();
    };

    const exit = () => {
        if (!screenfull.isEnabled) return;
        if (screenfull.isFullscreen) {
            screenfull.exit();
        }
    };

    const toggle = (el?: HTMLElement) => {
        if (!screenfull.isEnabled) return;
        el ? screenfull.toggle(el) : screenfull.toggle();
    };

    const onChange = () => {
        isFullscreen.value = screenfull.isFullscreen;
    };

    onMounted(() => {
        if (!screenfull.isEnabled) return;
        screenfull.on('change', onChange);
    });

    onBeforeUnmount(() => {
        if (!screenfull.isEnabled) return;
        screenfull.off('change', onChange);
    });

    return {
        isSupported,
        isFullscreen,
        enter,
        exit,
        toggle,
    };
}
