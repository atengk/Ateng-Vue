import AMapLoader from '@amap/amap-jsapi-loader'

let amapInstance: Promise<any> | null = null

export function loadAMap() {
    if (amapInstance) return amapInstance

    window._AMapSecurityConfig = {
        securityJsCode: import.meta.env.VITE_AMAP_SECURITY_CODE
    }

    amapInstance = AMapLoader.load({
        key: import.meta.env.VITE_AMAP_KEY,
        version: '2.0',
        plugins: []
    })

    return amapInstance
}