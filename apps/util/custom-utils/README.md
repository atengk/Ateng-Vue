# 自定义工具类

## `utils` 目录结构

```txt
src/utils/
├─ array.ts
├─ object.ts
├─ string.ts
├─ is.ts
├─ date.ts
├─ storage.ts
├─ url.ts
├─ dom.ts
├─ file.ts
├─ validate.ts
└─ index.ts
```

## 设计原则

在企业项目中，`utils` 只放 **“无业务含义、可被任意模块复用”的纯工具**：

✔ 不依赖 Pinia
✔ 不直接操作 DOM（DOM 工具单独放）
✔ 不包含接口请求（那是 service 层）
✔ 不包含具体业务字段（如 user、order）

一句话总结：

> **utils = 可复用 + 无状态 + 无业务语义**

------

## 常用工具类

### 字符串工具

```
string.ts
```

常见职责：

- 判空、去空格
- 格式化字符串
- 下划线 / 驼峰转换
- 首字母大小写

**几乎所有项目必备**

### 数组工具

```
array.ts
```

常见职责：

- 去重
- 扁平化
- 分组
- 树结构辅助（非业务）

和你之前后端 CollectionUtil 的角色很像。

------

### 对象工具

```
object.ts
```

常见职责：

- 深拷贝
- 对象判空
- 安全取值
- 删除空字段

在表单、请求参数处理中非常高频。

------

### 类型判断工具

```
is.ts
```

**Vue3 + TS 项目非常重要**

职责只做一件事：

- isString
- isNumber
- isObject
- isArray
- isFunction
- isPromise

这个工具类会被 **utils、hooks、service 层大量依赖**。

------

### 时间 / 日期工具

```
date.ts
```

常见职责：

- 时间格式化
- 相对时间
- 开始/结束时间
- 时间戳转换

⚠️ 不直接和 dayjs / date-fns 强耦合
而是**封一层**，方便将来替换。

------

### 本地存储工具（重点）

```
storage.ts
```

职责：

- localStorage
- sessionStorage
- 自动 JSON 序列化 / 反序列化
- 过期时间支持（可选）

这是**企业项目几乎必有的工具类**。

------

### URL / 参数工具

```
url.ts
```

常见职责：

- query 参数解析
- 对象转 query
- URL 拼接
- encode / decode

在路由、请求、分享链接中使用频繁。

------

### DOM 工具

```
dom.ts
```

职责：

- 获取滚动位置
- 设置 title
- 滚动到指定位置
- 判断是否在视口中

⚠️ 不建议滥用，只放“通用、安全”的方法。

------

### 文件工具

```
file.ts
```

职责：

- 文件大小格式化
- 下载文件
- blob 转换
- base64 处理

在导入导出、附件上传中非常常见。

------

### 校验工具（轻量）

```
validate.ts
```

职责：

- 手机号
- 邮箱
- 身份证（如需要）
- 自定义正则封装

⚠️ 不替代表单校验库，只做**基础判断**。

------

### Base64 编解码与转换

```
base64.ts
```

职责：

- 字符串 ↔ Base64
- Base64 ↔ Blob
- Base64 ↔ File
- Base64 数据提取

------

