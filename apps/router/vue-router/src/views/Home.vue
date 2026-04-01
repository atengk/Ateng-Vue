<script setup lang="ts">
import {useRouter} from 'vue-router'
import {ref} from "vue";

const router = useRouter()

const id = ref<string>('')
const name = ref<string>('')

function goAbout() {
  router.push('/about')
  /*router.push({
    name: 'About'
  })*/
}

function replaceAbout() {
  router.replace('/about')
  /*router.push({
    name: 'About',
    replace: true
  })*/
}

function goDetail(): void {
  router.push({
    name: 'Detail',
    query: {
      id: id.value,
      name: name.value
    }
  })
}

const detailId = ref<string>('')

function goDetailById(): void {
  if (!detailId.value) {
    return
  }
  router.push({
    name: 'DetailById',
    params: {
      id: detailId.value
    }
  })
}

function goRoute(): void {
  router.push({
    name: 'Route',
    query: {
      id: id.value,
      name: name.value
    },
    params: {
      id: detailId.value
    },
    hash: '#ateng'
  })
}

</script>

<template>
  <h1>Home 页面</h1>

  <div>
    <input v-model="detailId" placeholder="请输入 detail id"/>
    <button @click="goDetailById">
      去 DetailById（params）
    </button>
  </div>

  <div>
    <input v-model="id" placeholder="请输入 id"/>
    <input v-model="name" placeholder="请输入 name"/>
    <button @click="goDetail">
      去 Detail（带参数）
    </button>
  </div>

  <hr/>

  <div>
    <input v-model="detailId" placeholder="请输入 detail id"/>
    <input v-model="id" placeholder="请输入 id"/>
    <input v-model="name" placeholder="请输入 name"/>
    <button @click="goRoute">
      去 Route
    </button>
  </div>

  <hr/>

  <button @click="goAbout">去 About</button>
  |
  <button @click="replaceAbout">
    replace 跳转 About
  </button>
</template>
