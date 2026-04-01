<script setup lang="ts">

import { ref } from 'vue'

const username = ref<string>('admin')
const age = ref<number>(18)
const isLogin = ref<boolean>(false)
const ids: number[] = [1, 2, 3]
const names: Array<string> = ['a', 'b']
type ApiResult = [number, string, boolean]
const result = ref<ApiResult>([200, 'ok', true])

enum StatusCode {
  SUCCESS = 200,
  ERROR = 500
}
enum StatusText {
  SUCCESS = 'success',
  ERROR = 'error'
}

enum ApiCode {
  OK = 0,
  FAIL = 1
}
const code = ref<ApiCode>(ApiCode.OK)

if (code.value === ApiCode.OK) {
  console.log('成功')
}

interface User {
  id: number
  name: string
  age: number
}
const user = ref<User>({
  id: 1,
  name: 'Tom',
  age: 18
})

interface User {
  readonly id: number
  name: string
}
user.value.id = 2 // ❌ TS 报错


interface BaseEntity {
  id: number
  createdAt: string
}

interface User extends BaseEntity {
  name: string
}

type UserId = number
type Username = string
const id: UserId = 1


type RequestStatus = 'idle' | 'loading' | 'success' | 'error'
const status = ref<RequestStatus>('idle')

type UserBase = {
  id: number
  name: string
}

type UserWithRole = UserBase & {
  role: 'admin' | 'user'
}

function sum(a: number, b: number): number {
  return a + b
}
sum(1, 2)     // ✅
sum('1', 2)   // ❌ TS 报错

function greet(name: string, title?: string): string {
  return title ? `${title} ${name}` : name
}

type Formatter = (value: string) => string
const upper: Formatter = (v) => v.toUpperCase()

type OnSuccess = (data: string) => void
function fetchData(onSuccess: OnSuccess) {
  onSuccess('ok')
}

type ApiSuccess<T> = {
  code: 0
  data: T
}

type ApiFail = {
  code: 1
  message: string
}

type ApiResult<T> = ApiSuccess<T> | ApiFail

type InputValue = string | number
const value = ref<InputValue>('')

if (typeof value.value === 'number') {
  value.value.toFixed(2)
}

const el = document.querySelector('#app') as HTMLDivElement

type Success = { data: string }
type Fail = { message: string }

function handle(result: Success | Fail) {
  if ('data' in result) {
    console.log(result.data)
  } else {
    console.log(result.message)
  }
}
function handleError(err: unknown) {
  if (err instanceof Error) {
    console.log(err.message)
  }
}

function useValue<T>(value: T): T {
  return value
}

const name = useValue('admin')   // T 推导为 string
const age = useValue(18)         // T 推导为 number


interface Box<T> {
  value: T
}
const userBox: Box<User> = {
  value: { id: 1, name: 'Tom' }
}

type Wrapper<T> = {
  data: T
  loading: boolean
}
const state = ref<Wrapper<User>>({
  data: { id: 1, name: 'Tom' },
  loading: false
})

function getId<T extends { id: number }>(obj: T) {
  return obj.id
}
getId({ id: 1, name: 'Tom' }) // ✅
getId({ name: 'Tom' })       // ❌
interface Result<T = unknown> {
  data: T
}
const r1: Result = { data: null }
const r2: Result<User> = { data: { id: 1, name: 'Tom' } }


export function isEmpty(value: unknown): value is '' | null | undefined {
  return value === '' || value === null || value === undefined
}
const keyword = ref<string>('')

if (isEmpty(keyword.value)) {
  console.log('请输入关键字')
}
export function safeTrim(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value.trim()
}
const name2 = ref<unknown>(' admin ')
name2.value = safeTrim(name2.value)


export function truncate(
    value: string,
    maxLength: number
): string {
  return value.length > maxLength
      ? value.slice(0, maxLength) + '...'
      : value
}
truncate('TypeScript is awesome', 10)

export function toFixed(
    value: number,
    digits = 2
): number {
  return Number(value.toFixed(digits))
}
toFixed(0.1 + 0.2) // 0.3
export function clamp(
    value: number,
    min: number,
    max: number
): number {
  return Math.min(Math.max(value, min), max)
}
const page = ref<number>(1)
page.value = clamp(page.value, 1, 10)

export function unique<T>(list: T[]): T[] {
  return Array.from(new Set(list))
}
const ids = unique([1, 2, 2, 3]) // number[]

export function groupBy<T, K extends keyof any>(
    list: T[],
    key: (item: T) => K
): Record<K, T[]> {
  return list.reduce((acc, item) => {
    const groupKey = key(item)
    acc[groupKey] ||= []
    acc[groupKey].push(item)
    return acc
  }, {} as Record<K, T[]>)
}
groupBy(users, user => user.role)

export function flatten<T>(list: T[][]): T[] {
  return list.reduce((acc, cur) => acc.concat(cur), [])
}
flatten([[1, 2], [3, 4]]) // number[]

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

export function merge<T extends object, U extends object>(
    target: T,
    source: U
): T & U {
  return Object.assign({}, target, source)
}
const merged = merge({ a: 1 }, { b: 'x' })
// 类型：{ a: number } & { b: string }
export function get<T, K extends keyof T>(
    obj: T,
    key: K
): T[K] {
  return obj[key]
}
const userName = get(user, 'name')

interface User {
  id: number
  name: string
  age: number
}
type UserPatch = Partial<User>
const form = ref<Partial<User>>({})

type FullUser = Required<User>

function submit(user: Required<User>) {
  // 可以放心使用所有字段
}
type ReadonlyUser = Readonly<User>
const user = ref<ReadonlyUser>({
  id: 1,
  name: 'Tom',
  age: 18
})

user.value.age = 20 // ❌ TS 报错

type UserBasic = Pick<User, 'id' | 'name'>
const list = ref<UserBasic[]>([])

type UserWithoutId = Omit<User, 'id'>
function createUser(data: UserWithoutId) {}
type Role = 'admin' | 'user'
const roleMap: Record<Role, string> = {
  admin: '管理员',
  user: '普通用户'
}
const statusText: Record<number, string> = {
  0: '未开始',
  1: '进行中',
  2: '已完成'
}
type UserForm = Partial<Omit<User, 'id'>>
type UserQuery = Pick<User, 'name' | 'age'>
type UserResult = Readonly<User>
function fetchUser(params: UserQuery): Promise<UserResult> {}
interface ApiUser {
  id: number
  name: string
  password: string
}
type SafeUser = Omit<ApiUser, 'password'>

</script>

<template>

</template>

<style scoped>

</style>
