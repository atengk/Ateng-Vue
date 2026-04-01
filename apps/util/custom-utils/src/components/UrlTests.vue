<script setup lang="ts">

import { parseQuery } from '@/utils/url'

const query = parseQuery()

const code = query.code
import { buildUrl } from '@/utils/url'

const url = buildUrl('/api/user/page', {
  page: 1,
  size: 10,
  keyword: '张三'
})

import { buildUrl } from '@/utils/url'

const shareUrl = buildUrl(
    'https://example.com/detail',
    { id: 1001 }
)

import { encodeUrl, decodeUrl } from '@/utils/url'

const encoded = encodeUrl('https://example.com/测试')
const decoded = decodeUrl(encoded)


</script>

<template>

</template>

<style scoped>

</style>