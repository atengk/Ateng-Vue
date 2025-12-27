# CSS


## 基础样式

### 操作区工具栏

```
.toolbar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}
```

* **toolbar**：工具栏容器，常用于放置按钮、输入框、操作按钮等元素
* **display: flex**：开启弹性布局，让子元素在一行排列

  * **其他常用值**：

    * `inline-flex`：行内弹性布局，元素像 `inline-block`，但子元素是 flex
* **justify-content: center**：水平方向居中

  * **其他常用值**：

    * `flex-start`：左对齐（默认值）
    * `flex-end`：右对齐
    * `space-between`：两端对齐，中间间距平均
    * `space-around`：每个子元素间距相等，首尾也有间距
    * `space-evenly`：每个子元素间距均等
* **align-items: center**：垂直方向居中

  * **其他常用值**：

    * `flex-start`：顶部对齐
    * `flex-end`：底部对齐
    * `stretch`：拉伸填充容器高度（默认值）
    * `baseline`：按文本基线对齐
* **gap: 8px**：子元素之间的间距，不需要单独设置 margin

---

**使用示例**

```
<div class="toolbar">
    <input class="input" placeholder="请输入关键字" />
    <button class="btn">查询</button>
    <button class="btn primary">新增</button>
</div>
```

---

### 页面容器

```
.page-container {
  padding: 16px;
  min-height: 100%;
  box-sizing: border-box;
}
```

* **page-container**：页面内容最外层容器，用于统一内边距和布局
* **padding: 16px**：内容与容器边缘保持一定距离
* **min-height: 100%**：保证容器至少撑满可视区域高度
* **box-sizing: border-box**：包含 padding 在内计算元素宽高

  * **其他常用值**：

    * `content-box`（默认值）：宽高只包含内容，不包含 padding 和 border

---

**使用示例**

```
<div class="page-container">
    <div>这里是页面内容</div>
</div>
```

---

### 卡片容器

```
.card {
  background-color: #ffffff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 16px;
}
```

* **card**：信息分组容器，常用于表单、列表或展示块
* **background-color: #ffffff**：白底，区分内容区域
* **border: 1px solid #dcdfe6**：边框，让卡片独立
* **border-radius: 4px**：圆角，让视觉更柔和
* **padding: 16px**：内部留白，内容不贴边

---

**使用示例**

```
<div class="card">
    <p>卡片内容</p>
</div>
```

---

### 水平居中容器

```
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

* **flex-center**：常用于加载中、空状态或弹窗居中
* **display: flex**：开启弹性布局

  * **其他常用值**：

    * `inline-flex`：行内弹性布局
* **justify-content: center**：水平方向居中

  * **其他常用值**：

    * `flex-start`：左对齐
    * `flex-end`：右对齐
    * `space-between`：两端对齐，中间间距平均
    * `space-around`：子元素间距均等
    * `space-evenly`：子元素间距均等，首尾也有间距
* **align-items: center**：垂直方向居中

  * **其他常用值**：

    * `flex-start`：顶部对齐
    * `flex-end`：底部对齐
    * `stretch`：拉伸填充容器高度
    * `baseline`：按文本基线对齐

---

**使用示例**

```
<div class="flex-center" style="height: 100px; border: 1px solid #ccc;">
    <span>居中内容</span>
</div>
```

---

### 输入框基础样式

```
.input {
  height: 32px;
  padding: 0 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
```

* **input**：统一输入框样式，保证表单整齐
* **height: 32px**：固定高度，使表单元素统一
* **padding: 0 8px**：左右内部留白，内容不贴边
* **border: 1px solid #dcdfe6**：输入框边框，便于识别
* **border-radius: 4px**：圆角，让视觉更柔和

---

**使用示例**

```
<input class="input" placeholder="请输入内容" />
```

---

### 主按钮样式

```
.btn.primary {
  background-color: #409eff;
  color: #ffffff;
  cursor: pointer;
  border-radius: 4px;
  padding: 0 16px;
  height: 32px;
}
```

* **btn.primary**：主操作按钮，用于强调关键操作
* **background-color: #409eff**：按钮背景颜色

  * **其他常用值**：

    * `#ffffff`：普通按钮
    * `#f56c6c`：危险操作按钮
* **color: #ffffff**：文字颜色

  * **其他常用值**：

    * `#303133`：深色文字
* **cursor: pointer**：鼠标悬停时显示小手
* **border-radius: 4px**：圆角
* **padding: 0 16px**：左右内边距
* **height: 32px**：固定高度

---

**使用示例**

```
<button class="btn primary">保存</button>
```

---

### 普通按钮样式

```
.btn {
  background-color: #ffffff;
  color: #303133;
  cursor: pointer;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 0 16px;
  height: 32px;
}
```

* **btn**：普通按钮，常用于一般操作
* **background-color: #ffffff**：按钮背景白色
* **color: #303133**：文字深色
* **cursor: pointer**：鼠标悬停显示小手
* **border: 1px solid #dcdfe6**：边框
* **border-radius: 4px**：圆角
* **padding: 0 16px**：左右内边距
* **height: 32px**：固定高度

---

**使用示例**

```
<button class="btn">取消</button>
```

---

### 两端对齐容器

```
.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

* **flex-between**：常用于标题+操作按钮、表头工具栏
* **display: flex**：开启弹性布局

  * 其他值：`inline-flex`
* **justify-content: space-between**：两端对齐，中间间距自动分配

  * 其他值：

    * `flex-start`：左对齐
    * `flex-end`：右对齐
    * `center`：水平居中
    * `space-around`：两边及中间间距均等
    * `space-evenly`：所有间距均等
* **align-items: center**：垂直居中

  * 其他值：`flex-start`、`flex-end`、`stretch`、`baseline`

---

**使用示例**

```
<div class="flex-between" style="height: 40px; border: 1px solid #ccc;">
    <span>标题</span>
    <button class="btn primary">新增</button>
</div>
```

---

### 间距类：margin / padding

```
.mt-16 { margin-top: 16px; }
.mb-16 { margin-bottom: 16px; }
.pt-8  { padding-top: 8px; }
.pb-8  { padding-bottom: 8px; }
```

* **mt-16 / mb-16**：设置元素上/下外边距
* **pt-8 / pb-8**：设置元素上/下内边距
* **意义**：统一间距体系，避免每次随意写 px，保证页面整齐
* **其他常用值**：4px、8px、12px、16px、24px

---

**使用示例**

```
<div class="card mt-16 pb-8">
    <p>内容区域</p>
</div>
```

---

### 文本样式

```
.text-primary {
  font-size: 14px;
  color: #303133;
}
.text-secondary {
  font-size: 12px;
  color: #909399;
}
.text-bold {
  font-weight: 600;
}
```

* **text-primary**：主要文字，深色、常用于标题和重点信息
* **text-secondary**：辅助文字，浅色、常用于描述、提示信息
* **text-bold**：加粗文字
* **其他常用值**：

  * `font-size`: 12px、13px、14px、16px、18px
  * `color`: 根据设计稿选择深色、浅色、警示色

---

**使用示例**

```
<div class="text-primary text-bold">用户管理</div>
<div class="text-secondary">用于维护系统用户信息</div>
```

---

### 表格行高与边框

```
.table-row {
  height: 40px;
  border-bottom: 1px solid #ebeef5;
}
```

* **table-row**：表格或列表行，统一高度和分隔线
* **height: 40px**：固定行高，保证表格整齐
* **border-bottom: 1px solid #ebeef5**：行间分隔线

  * 其他常用值：

    * `none`：无边框
    * `dashed`：虚线
    * `dotted`：点线
    * `2px solid #ccc`：加粗分隔线

---

**使用示例**

```
<div class="table-row">
    <span>用户1</span>
    <span>管理员</span>
</div>
<div class="table-row">
    <span>用户2</span>
    <span>普通用户</span>
</div>
```

---

### 文本溢出省略

```
.text-ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
```

* **text-ellipsis**：当文本过长时显示省略号
* **overflow: hidden**：隐藏溢出部分
* **white-space: nowrap**：禁止换行
* **text-overflow: ellipsis**：显示省略号

  * 其他常用值：

    * `clip`：直接裁切，不显示省略号
    * `normal`：允许换行

---

**使用示例**

```
<div class="text-ellipsis" style="width: 150px; border: 1px solid #ccc;">
    这是一段很长的文本，用于演示省略效果
</div>
```

---

### 图片/头像样式

```
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}
```

* **avatar**：用户头像或圆形图片
* **width / height**：固定大小
* **border-radius: 50%**：圆形显示
* **object-fit: cover**：保持比例填充容器，避免图片变形

  * 其他常用值：

    * `contain`：完整显示，不裁切
    * `fill`：拉伸填充

---

**使用示例**

```
<img class="avatar" src="user.jpg" alt="头像" />
```

---

### 标签/状态标识

```
.tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  background-color: #f0f9eb;
  color: #67c23a;
}
```

* **tag**：状态标签或小徽章
* **display: inline-block**：可以设置宽高又不独占一行
* **padding: 2px 8px**：内部留白
* **border-radius: 12px**：圆角，视觉像胶囊
* **font-size: 12px**：文字大小
* **background-color / color**：背景色和文字颜色

  * 其他常用值：

    * 红色背景：`#fef0f0` + `#f56c6c`（危险）
    * 蓝色背景：`#f0f6ff` + `#409eff`（信息）
    * 灰色背景：`#f5f7fa` + `#909399`（禁用或次要）

---

**使用示例**

```
<span class="tag">已启用</span>
<span class="tag" style="background-color:#fef0f0;color:#f56c6c;">已禁用</span>
```

---

### 弹窗基础容器

```
.modal {
  width: 400px;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}
```

* **modal**：弹窗内容容器
* **width: 400px**：固定宽度
* **background-color: #ffffff**：白底
* **border-radius: 8px**：圆角
* **padding: 24px**：内部留白
* **box-shadow**：投影，悬浮效果

  * 其他常用值：

    * `0 0 8px rgba(0,0,0,0.1)`：轻投影
    * `0 4px 16px rgba(0,0,0,0.2)`：重投影

---

**使用示例**

```
<div class="modal">
    <h3>弹窗标题</h3>
    <p>这里是弹窗内容</p>
    <div class="toolbar">
        <button class="btn">取消</button>
        <button class="btn primary">确定</button>
    </div>
</div>
```

---

### 栅格/列布局

```
.col-6 {
  width: 50%;
  float: left;
  box-sizing: border-box;
  padding: 0 8px;
}
```

* **col-6**：常用于表单或内容的两列布局
* **width: 50%**：占据父容器一半宽度
* **float: left**：浮动排列，实现多列效果
* **box-sizing: border-box**：宽度包含 padding，避免撑破布局
* **padding: 0 8px**：列间留白
* **其他常用值**：

  * `width: 25%`：四列
  * `width: 33.33%`：三列
  * `float: right`：右浮动

---

**使用示例**

```
<div class="col-6">
    <input class="input" placeholder="左侧输入框"/>
</div>
<div class="col-6">
    <input class="input" placeholder="右侧输入框"/>
</div>
```

---

### hover 状态样式

```
.btn:hover {
  background-color: #66b1ff;
  border-color: #66b1ff;
}
```

* **btn:hover**：鼠标悬停按钮时状态
* **background-color: #66b1ff**：变亮的背景色
* **border-color: #66b1ff**：同步边框颜色
* **其他常用值**：

  * 改文字颜色：`color: #ffffff`
  * 改阴影：`box-shadow: 0 2px 8px rgba(0,0,0,0.2)`

---

**使用示例**

```
<button class="btn primary">保存</button>
```

*鼠标放上去，按钮会变色*

---

### disabled 状态样式

```
.btn:disabled {
  background-color: #f5f7fa;
  color: #c0c4cc;
  cursor: not-allowed;
  border-color: #dcdfe6;
}
```

* **btn:disabled**：禁用状态按钮
* **background-color / color**：灰色，提示不可操作
* **cursor: not-allowed**：鼠标显示禁止符号
* **border-color**：边框灰色
* **其他常用值**：可根据设计稿调整灰色深浅

---

**使用示例**

```
<button class="btn primary" disabled>提交</button>
```

---

### 浮动/层级控制

```
.popup {
  position: absolute;
  top: 50px;
  left: 50px;
  z-index: 1000;
}
```

* **popup**：常用于下拉菜单、提示框、弹窗
* **position: absolute**：绝对定位，相对于最近的定位父元素

  * 其他常用值：

    * `relative`：相对定位
    * `fixed`：固定在窗口
    * `sticky`：滚动吸附
* **top / left**：位置偏移
* **z-index: 1000**：层级控制，值越大越在上层

---

**使用示例**

```
<div class="popup">弹出内容</div>
```

---

### overflow 控制

```
.scroll-box {
  width: 200px;
  height: 100px;
  overflow: auto;
  border: 1px solid #dcdfe6;
}
```

* **scroll-box**：超出容器范围显示滚动条
* **overflow: auto**：需要时出现滚动条

  * 其他常用值：

    * `visible`：默认，内容溢出显示
    * `hidden`：溢出隐藏
    * `scroll`：总显示滚动条
* **width / height**：固定容器大小
* **border**：边框方便观察

---

**使用示例**

```
<div class="scroll-box">
    <p>这是一段很长的文本，用于演示滚动效果。多行内容，多行内容，多行内容，多行内容，多行内容，多行内容。</p>
</div>
```

---

### 弹性换行布局

```
.flex-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
```

* **flex-wrap**：允许子元素换行
* **display: flex**：开启弹性布局
* **flex-wrap: wrap**：超出父容器宽度时，自动换到下一行

  * 其他常用值：

    * `nowrap`（默认）：不换行
    * `wrap-reverse`：换行方向反向
* **gap: 8px**：子元素间距

---

**使用示例**

```
<div class="flex-wrap" style="width: 200px; border: 1px solid #ccc;">
    <button class="btn">按钮1</button>
    <button class="btn">按钮2</button>
    <button class="btn">按钮3</button>
    <button class="btn">按钮4</button>
</div>
```

---

### 表单控件 focus 样式

```
.input:focus {
  border-color: #409eff;
  outline: none;
  box-shadow: 0 0 2px #409eff;
}
```

* **:focus**：表单元素获得焦点时状态
* **border-color: #409eff**：边框高亮
* **outline: none**：去掉默认浏览器轮廓线
* **box-shadow: 0 0 2px #409eff**：增加聚焦视觉效果

  * 其他常用值：

    * `border-color: #67c23a`：成功状态
    * `border-color: #f56c6c`：错误状态

---

**使用示例**

```
<input class="input" placeholder="请输入用户名"/>
```

*聚焦时边框高亮*

---

### 省略多行文本

```
.text-ellipsis-multi {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

* **text-ellipsis-multi**：多行文本超出显示省略号
* **display: -webkit-box**：弹性盒子布局，用于多行限制
* **-webkit-line-clamp: 2**：最多显示两行
* **-webkit-box-orient: vertical**：垂直方向排列
* **overflow: hidden**：溢出隐藏

  * 其他常用值：

    * `-webkit-line-clamp: 3`：显示三行
    * `overflow: visible`：显示所有内容

---

**使用示例**

```
<div class="text-ellipsis-multi" style="width: 150px;">
    这是一段很长的文本，用于演示多行省略效果。多行内容，多行内容，多行内容。
</div>
```

---

### 常用图标大小和间距

```
.icon {
  width: 16px;
  height: 16px;
  margin-right: 4px;
  vertical-align: middle;
}
```

* **icon**：图标或 svg 控件
* **width / height**：固定大小
* **margin-right: 4px**：图标和文字或元素间距
* **vertical-align: middle**：垂直居中对齐文字

  * 其他常用值：

    * `width / height: 12px / 24px`：根据设计稿调整
    * `margin-left`：左侧间距

---

**使用示例**

```
<span><img class="icon" src="edit.svg" alt="">编辑</span>
```

---

### 按钮分组/组合

```
.btn-group {
  display: inline-flex;
}
.btn-group .btn {
  border-radius: 0;
}
.btn-group .btn:first-child {
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}
.btn-group .btn:last-child {
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}
```

* **btn-group**：按钮组合，用于同类操作
* **display: inline-flex**：水平排列按钮
* **.btn { border-radius: 0 }**：去掉默认圆角
* **:first-child / :last-child**：保持组合首尾圆角

  * 其他常用值：

    * 多按钮时可增加 `margin-left: -1px` 避免双边框重叠

---

**使用示例**

```
<div class="btn-group">
    <button class="btn">左</button>
    <button class="btn primary">中</button>
    <button class="btn">右</button>
</div>
```

---

### 状态提示颜色

```
.status-success {
  color: #67c23a;
}
.status-warning {
  color: #e6a23c;
}
.status-error {
  color: #f56c6c;
}
```

* **status-success / warning / error**：常用于提示信息、表单校验、状态标签
* **color**：文字颜色

  * 其他常用值：

    * 成功：绿色 `#67c23a`
    * 警告：橙色 `#e6a23c`
    * 错误：红色 `#f56c6c`
    * 信息：蓝色 `#409eff`

---

**使用示例**

```
<span class="status-success">操作成功</span>
<span class="status-warning">警告信息</span>
<span class="status-error">操作失败</span>
```

---

### 徽章/Badge

```
.badge {
  display: inline-block;
  min-width: 16px;
  height: 16px;
  line-height: 16px;
  padding: 0 4px;
  font-size: 12px;
  color: #fff;
  background-color: #f56c6c;
  border-radius: 8px;
  text-align: center;
}
```

* **badge**：小徽章，常用于数量提示或状态标记
* **display: inline-block**：允许设置宽高
* **min-width / height / line-height**：固定大小并垂直居中
* **padding**：左右内边距
* **font-size**：文字大小
* **color / background-color**：文字颜色和背景颜色
* **border-radius: 8px**：圆角，形成胶囊形
* **text-align: center**：文字水平居中

---

**使用示例**

```
<span>消息 <span class="badge">3</span></span>
```

---

### Toast/提示框基础样式

```
.toast {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  background-color: rgba(0,0,0,0.7);
  color: #fff;
  border-radius: 4px;
  font-size: 14px;
  z-index: 2000;
}
```

* **toast**：页面临时提示消息
* **position: fixed**：固定在页面可视区域
* **bottom / left / transform**：水平居中、底部偏移
* **padding**：内部留白
* **background-color**：半透明黑色背景
* **color**：文字颜色白色
* **border-radius**：圆角
* **font-size**：文字大小
* **z-index**：显示在最上层

  * 其他常用值：可根据需求调整位置、颜色和透明度

---

**使用示例**

```
<div class="toast">保存成功</div>
```

---

### 列表 hover 高亮

```
.list-item {
  padding: 8px 16px;
  cursor: pointer;
}
.list-item:hover {
  background-color: #f5f7fa;
}
```

* **list-item**：列表或菜单条目
* **padding**：内部留白
* **cursor: pointer**：鼠标悬停显示小手
* **:hover background-color**：鼠标悬停高亮

  * 其他常用值：

    * 高亮色可根据设计稿调整，如 `#e6f7ff`、`#f0f9ff`

---

**使用示例**

```
<div class="list-item">菜单1</div>
<div class="list-item">菜单2</div>
<div class="list-item">菜单3</div>
```

---

### 小组件间距规范

```
.component + .component {
  margin-top: 16px;
}
```

* **component + component**：相邻组件之间统一间距
* **margin-top: 16px**：保证垂直间距一致

  * 其他常用值：

    * 8px、12px、24px，根据设计稿和布局要求
* **意义**：保持页面整齐、避免单独给每个组件设置 margin

---

**使用示例**

```
<div class="card">卡片1</div>
<div class="card">卡片2</div>
<div class="card">卡片3</div>
```

---

### 卡片阴影

```
.card-shadow {
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  border-radius: 4px;
  background-color: #ffffff;
  padding: 16px;
}
```

* **box-shadow**：投影效果，使卡片悬浮感

  * 其他常用值：

    * `0 1px 3px rgba(0,0,0,0.1)`：轻微投影
    * `0 4px 16px rgba(0,0,0,0.2)`：明显投影
* **border-radius**：圆角
* **background-color**：白色背景
* **padding**：内部留白

---

**使用示例**

```
<div class="card-shadow">
    <p>卡片带阴影效果</p>
</div>
```

---

### Tab 样式

```
.tab {
  display: flex;
  border-bottom: 1px solid #ebeef5;
}
.tab-item {
  padding: 8px 16px;
  cursor: pointer;
}
.tab-item.active {
  color: #409eff;
  border-bottom: 2px solid #409eff;
}
```

* **tab**：Tab 容器
* **display: flex**：水平排列 Tab
* **border-bottom**：底部边框
* **tab-item**：单个 Tab
* **cursor: pointer**：可点击
* **active**：选中状态

  * 颜色和下边框高亮

---

**使用示例**

```
<div class="tab">
    <div class="tab-item active">Tab1</div>
    <div class="tab-item">Tab2</div>
</div>
```

---

### 折叠面板基础样式

```
.collapse {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
.collapse-header {
  padding: 10px 16px;
  cursor: pointer;
  background-color: #f5f7fa;
}
.collapse-body {
  padding: 16px;
  display: none;
}
```

* **collapse**：折叠容器
* **collapse-header**：可点击标题
* **cursor: pointer**：鼠标手型
* **collapse-body**：内容区域，默认隐藏

  * `display: block`：展开

---

**使用示例**

```
<div class="collapse">
    <div class="collapse-header">标题</div>
    <div class="collapse-body">内容</div>
</div>
```

---

### 进度条基础样式

```
.progress {
  width: 100%;
  height: 8px;
  background-color: #ebeef5;
  border-radius: 4px;
  overflow: hidden;
}
.progress-bar {
  height: 100%;
  background-color: #409eff;
  width: 50%;
}
```

* **progress**：进度条容器
* **background-color**：背景色
* **border-radius**：圆角
* **overflow: hidden**：隐藏超出部分
* **progress-bar**：已完成部分
* **width**：进度百分比

---

**使用示例**

```
<div class="progress">
    <div class="progress-bar"></div>
</div>
```

---

### 带图标按钮

```
.btn-icon {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0 12px;
  height: 32px;
}
```

* **display: inline-flex**：水平排列图标和文字
* **align-items: center**：垂直居中
* **gap: 4px**：图标和文字间距
* **padding / height**：统一大小

---

**使用示例**

```
<button class="btn-icon">
    <img class="icon" src="edit.svg" alt="">编辑
</button>
```

---

### 分割线

```
.divider {
  border-bottom: 1px solid #ebeef5;
  margin: 8px 0;
}
```

* **divider**：内容分割线
* **border-bottom**：下边框实现
* **margin**：上下间距

  * 其他常用值：`margin: 16px 0`

---

**使用示例**

```
<div>内容1</div>
<div class="divider"></div>
<div>内容2</div>
```

---

### 标签页容器

```
.tabs {
  display: flex;
  flex-wrap: wrap;
  border-bottom: 1px solid #ebeef5;
}
.tab {
  padding: 8px 16px;
  cursor: pointer;
}
.tab.active {
  color: #409eff;
  border-bottom: 2px solid #409eff;
}
```

* **tabs**：标签页外层容器
* **flex-wrap: wrap**：多行时自动换行
* **tab**：单个标签
* **active**：选中状态高亮

---

**使用示例**

```
<div class="tabs">
    <div class="tab active">标签1</div>
    <div class="tab">标签2</div>
</div>
```

---

### 悬浮按钮

```
.floating-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #409eff;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
```

* **position: fixed**：固定位置
* **bottom / right**：距离页面边缘
* **width / height / border-radius**：圆形
* **display: flex / align-items / justify-content**：图标居中
* **box-shadow**：悬浮效果

---

**使用示例**

```
<div class="floating-btn">+</div>
```

---

### 加载中 Spinner

```
.spinner {
  width: 32px;
  height: 32px;
  border: 4px solid #ebeef5;
  border-top-color: #409eff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

* **spinner**：加载动画
* **border-top-color**：高亮色，形成旋转视觉
* **animation**：旋转动画

  * `1s linear infinite`：持续旋转

---

**使用示例**

```
<div class="spinner"></div>
```

---

### 卡片折叠内容

```
.card-collapse .card-body {
  display: none;
}
.card-collapse.active .card-body {
  display: block;
}
```

* **card-collapse**：可折叠卡片
* **display: none / block**：控制内容显示隐藏
* **active**：展开状态

---

**使用示例**

```
<div class="card-collapse">
    <div class="card-header">标题</div>
    <div class="card-body">折叠内容</div>
</div>
```

---

### 进度条带文字

```
.progress-text {
  display: flex;
  align-items: center;
  gap: 8px;
}
.progress-text .progress {
  flex: 1;
}
```

* **progress-text**：带文字的进度条容器
* **display: flex**：水平排列进度条和文字
* **align-items: center**：垂直居中
* **gap: 8px**：文字和进度条之间间距
* **flex: 1**：进度条填满剩余空间

---

**使用示例**

```
<div class="progress-text">
    <div class="progress">
        <div class="progress-bar" style="width: 70%;"></div>
    </div>
    <span>70%</span>
</div>
```

---

### 分组表单行

```
.form-row {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}
```

* **form-row**：表单一行，常用于多字段布局
* **display: flex**：水平排列子字段
* **gap: 16px**：子元素间距
* **margin-bottom: 16px**：行间距，保证表单整齐

---

**使用示例**

```
<div class="form-row">
    <input class="input" placeholder="姓名"/>
    <input class="input" placeholder="邮箱"/>
</div>
```

---

### 表单标签宽度统一

```
.form-label {
  display: inline-block;
  width: 100px;
  text-align: right;
  margin-right: 8px;
}
```

* **form-label**：表单字段标签
* **display: inline-block**：可设置宽高
* **width: 100px**：统一宽度
* **text-align: right**：右对齐，与输入框对齐
* **margin-right: 8px**：标签和输入框间距

---

**使用示例**

```
<label class="form-label">用户名：</label>
<input class="input" placeholder="请输入用户名"/>
```

---

### 弹窗遮罩层

```
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.4);
  z-index: 999;
}
```

* **modal-mask**：遮罩层，防止背景操作
* **position: fixed / top / left / width / height**：覆盖整个屏幕
* **background-color**：半透明黑色
* **z-index: 999**：确保在其他元素之上

---

**使用示例**

```
<div class="modal-mask"></div>
<div class="modal">
    弹窗内容
</div>
```

---

### 图片圆角

```
.img-rounded {
  border-radius: 8px;
  object-fit: cover;
}
```

* **img-rounded**：常用于卡片图片或头像
* **border-radius: 8px**：圆角
* **object-fit: cover**：保持比例填充容器

---

**使用示例**

```
<img class="img-rounded" src="pic.jpg" alt="图片" width="150" height="100"/>
```

---

### 悬浮提示 Tooltip

```
.tooltip {
  position: relative;
  display: inline-block;
  cursor: pointer;
}
.tooltip .tooltip-text {
  visibility: hidden;
  background-color: #303133;
  color: #fff;
  text-align: center;
  padding: 4px 8px;
  border-radius: 4px;
  position: absolute;
  bottom: 125%; /* 显示在上方 */
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  z-index: 1000;
}
.tooltip:hover .tooltip-text {
  visibility: visible;
}
```

* **tooltip**：提示容器
* **position: relative**：定位子元素
* **cursor: pointer**：鼠标手型
* **tooltip-text**：提示文字
* **visibility: hidden / visible**：默认隐藏，悬停显示
* **position: absolute / bottom / left / transform**：定位提示框
* **white-space: nowrap**：不换行

---

**使用示例**

```
<div class="tooltip">悬停我
    <span class="tooltip-text">提示信息</span>
</div>
```

---

### 水平滚动列表

```
.horizontal-scroll {
  display: flex;
  overflow-x: auto;
  gap: 8px;
  padding: 8px 0;
}
```

* **horizontal-scroll**：水平滚动容器
* **display: flex**：水平排列
* **overflow-x: auto**：超出显示滚动条
* **gap**：元素间距
* **padding**：上下留白

---

**使用示例**

```
<div class="horizontal-scroll">
    <div class="card">Item1</div>
    <div class="card">Item2</div>
    <div class="card">Item3</div>
</div>
```

---

### 标签堆叠

```
.tag-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
```

* **tag-stack**：多个标签水平换行排列
* **flex-wrap: wrap**：换行
* **gap: 4px**：标签间距

---

**使用示例**

```
<div class="tag-stack">
    <span class="tag">标签1</span>
    <span class="tag">标签2</span>
    <span class="tag">标签3</span>
</div>
```

---

### 面包屑导航

```
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #909399;
}
.breadcrumb a {
  color: #409eff;
  text-decoration: none;
}
.breadcrumb a:hover {
  text-decoration: underline;
}
```

* **breadcrumb**：导航路径
* **display: flex**：水平排列
* **align-items: center**：垂直居中
* **gap: 4px**：元素间距
* **a**：可点击链接
* **hover**：悬停下划线

---

**使用示例**

```
<div class="breadcrumb">
    <a href="#">首页</a> / 
    <a href="#">用户管理</a> / 
    <span>详情</span>
</div>
```

---

### 卡片标题

```
.card-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}
```

* **card-title**：卡片内标题
* **font-size: 16px**：文字大小
* **font-weight: 600**：半粗体
* **margin-bottom: 12px**：下方间距

---

**使用示例**

```
<div class="card-shadow">
    <div class="card-title">用户信息</div>
    <p>这里是卡片内容</p>
</div>
```

---

### 按钮组悬浮效果

```
.btn-group:hover .btn {
  background-color: #66b1ff;
  border-color: #66b1ff;
}
```

* **btn-group:hover .btn**：按钮组合悬停状态
* **background-color / border-color**：改变背景和边框颜色

  * 其他常用值：

    * `#409eff`：主色
    * `#67c23a`：成功
    * `#f56c6c`：危险

---

**使用示例**

```
<div class="btn-group">
    <button class="btn">左</button>
    <button class="btn">中</button>
    <button class="btn">右</button>
</div>
```

---

### 表格列宽控制

```
.table-col {
  width: 150px;
  text-align: left;
  padding: 8px;
}
```

* **table-col**：表格列样式
* **width**：固定列宽
* **text-align**：文字对齐
* **padding**：内边距

  * 其他常用值：

    * `text-align: center`
    * `width: auto`

---

**使用示例**

```
<table>
  <tr>
    <td class="table-col">姓名</td>
    <td class="table-col">邮箱</td>
  </tr>
</table>
```

---

### 下拉选择样式

```
.select {
  width: 200px;
  padding: 6px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background-color: #fff;
}
```

* **select**：下拉选择框
* **width / padding**：固定宽度和内部留白
* **border / border-radius**：边框与圆角
* **background-color**：白色背景

---

**使用示例**

```
<select class="select">
    <option>选项1</option>
    <option>选项2</option>
</select>
```

---

### 响应式布局

```
.responsive {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}
```

* **responsive**：常用页面容器
* **width: 100%**：宽度自适应
* **max-width: 1200px**：最大宽度
* **margin: 0 auto**：水平居中
* **padding**：左右间距

---

**使用示例**

```
<div class="responsive">
    <p>页面内容</p>
</div>
```

---

### 阻止文本选中

```
.no-select {
  user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
```

* **no-select**：禁止用户选中内容
* **user-select**：标准属性
* **-webkit-user-select / -ms-user-select**：兼容不同浏览器

---

**使用示例**

```
<p class="no-select">不可选中文本</p>
```

---

### 溢出提示

```
.overflow-tooltip {
  position: relative;
  display: inline-block;
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

* **overflow-tooltip**：超出显示省略号
* **max-width**：最大宽度
* **white-space: nowrap**：禁止换行
* **overflow: hidden / text-overflow: ellipsis**：显示省略号

---

**使用示例**

```
<span class="overflow-tooltip">这是一段很长的文字，用于演示溢出省略</span>
```

---

### 列表折叠

```
.list-collapse .list-body {
  display: none;
}
.list-collapse.active .list-body {
  display: block;
}
```

* **list-collapse**：折叠列表容器
* **display: none / block**：控制展开与折叠
* **active**：展开状态

---

**使用示例**

```
<div class="list-collapse">
    <div class="list-header">标题</div>
    <div class="list-body">内容</div>
</div>
```

---

### 栅格间距

```
.row {
  display: flex;
  flex-wrap: wrap;
  margin: -8px;
}
.col {
  padding: 8px;
}
```

* **row**：行容器
* **flex-wrap: wrap**：允许换行
* **margin: -8px / padding: 8px**：保证列间距一致
* **col**：列容器

---

**使用示例**

```
<div class="row">
    <div class="col"><div class="card">列1</div></div>
    <div class="col"><div class="card">列2</div></div>
</div>
```

---

### 背景色通用类

```
.bg-primary { background-color: #409eff; color: #fff; }
.bg-success { background-color: #67c23a; color: #fff; }
.bg-warning { background-color: #e6a23c; color: #fff; }
.bg-error   { background-color: #f56c6c; color: #fff; }
.bg-info    { background-color: #909399; color: #fff; }
```

* **bg-***：常用背景色类
* **color: #fff**：文字白色保证可读性
* **应用场景**：按钮、标签、状态标识、卡片背景

---

**使用示例**

```
<div class="bg-primary">主色背景</div>
<div class="bg-success">成功背景</div>
```

---

### Tooltip 方向

```
.tooltip-top .tooltip-text {
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
}

.tooltip-bottom .tooltip-text {
  top: 125%;
  left: 50%;
  transform: translateX(-50%);
}

.tooltip-left .tooltip-text {
  right: 125%;
  top: 50%;
  transform: translateY(-50%);
}

.tooltip-right .tooltip-text {
  left: 125%;
  top: 50%;
  transform: translateY(-50%);
}
```

* **tooltip-***：提示框方向
* **top / bottom / left / right**：控制提示框位置
* **transform**：偏移到中心位置
* **其他常用值**：可以结合 `margin` 或 `translate` 微调位置

---

**使用示例**

```
<div class="tooltip tooltip-top">
  悬停我
  <span class="tooltip-text">上方提示</span>
</div>
```

---

### 表格固定列

```
.table-fixed th, .table-fixed td {
  position: sticky;
  left: 0;
  background-color: #fff;
  z-index: 1;
}
```

* **table-fixed**：固定表格列
* **position: sticky**：粘性定位
* **left: 0**：固定左边
* **background-color**：保证列覆盖内容可读
* **z-index: 1**：显示在其他单元格之上

---

**使用示例**

```
<table class="table-fixed">
  <tr>
    <th>姓名</th>
    <th>邮箱</th>
  </tr>
</table>
```

---

### 弹窗滚动内容

```
.modal-content {
  max-height: 400px;
  overflow-y: auto;
  padding: 16px;
}
```

* **modal-content**：弹窗内容区
* **max-height**：最大高度
* **overflow-y: auto**：超出时出现纵向滚动条
* **padding**：内部留白

---

**使用示例**

```
<div class="modal">
  <div class="modal-content">
    <p>很多内容很多内容很多内容...</p>
  </div>
</div>
```

---

### 按钮禁用提示

```
.btn[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
```

* **btn[disabled]**：禁用状态按钮
* **opacity: 0.6**：半透明提示不可点击
* **cursor: not-allowed**：鼠标显示禁止符号

---

**使用示例**

```
<button class="btn primary" disabled>提交</button>
```

---

### Tab 响应式

```
.tab-responsive {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.tab-responsive .tab-item {
  flex: 1 1 auto;
  text-align: center;
}
```

* **tab-responsive**：响应式 Tab 容器
* **flex-wrap: wrap**：超出自动换行
* **gap**：Tab 间距
* **flex: 1 1 auto**：自动平分宽度
* **text-align: center**：文字居中

---

**使用示例**

```
<div class="tab-responsive">
    <div class="tab-item active">Tab1</div>
    <div class="tab-item">Tab2</div>
    <div class="tab-item">Tab3</div>
</div>
```

---

### 图片懒加载占位

```
.img-lazy {
  background-color: #f5f7fa;
  display: block;
  width: 100%;
  height: 150px;
  object-fit: cover;
}
```

* **img-lazy**：图片未加载占位
* **background-color**：背景颜色
* **display: block / width / height**：固定容器尺寸
* **object-fit: cover**：保持比例填充

---

**使用示例**

```
<img class="img-lazy" data-src="pic.jpg" alt="懒加载图片"/>
```

---

### 提示标签

```
.tag {
  display: inline-block;
  padding: 2px 6px;
  font-size: 12px;
  color: #fff;
  background-color: #409eff;
  border-radius: 4px;
}
```

* **tag**：小标签，状态、类别使用
* **padding**：内边距
* **font-size**：文字大小
* **color / background-color**：文字和背景
* **border-radius**：圆角

---

**使用示例**

```
<span class="tag">新用户</span>
```

---

### 卡片阴影变化

```
.card-hover {
  transition: box-shadow 0.3s ease;
}
.card-hover:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
}
```

* **card-hover**：卡片悬停变化
* **transition**：动画平滑
* **box-shadow**：鼠标悬停增强阴影

---

**使用示例**

```
<div class="card-shadow card-hover">
    <p>悬停卡片</p>
</div>
```

---

### 列表边框

```
.list-bordered .list-item {
  border-bottom: 1px solid #ebeef5;
}
.list-bordered .list-item:last-child {
  border-bottom: none;
}
```

* **list-bordered**：带边框列表
* **border-bottom**：分隔每一行
* **:last-child**：最后一行去掉边框

---

**使用示例**

```
<div class="list-bordered">
    <div class="list-item">行1</div>
    <div class="list-item">行2</div>
</div>
```

---

### 小组件统一字体

```
.text-base {
  font-size: 14px;
  color: #606266;
  line-height: 1.5;
}
```

* **text-base**：小组件通用文字
* **font-size**：文字大小
* **color**：文字颜色
* **line-height**：行高

---

**使用示例**

```
<p class="text-base">这是统一字体的文本</p>
```

---

### 列表悬停高亮

```
.list-hover .list-item {
  padding: 8px 16px;
  cursor: pointer;
}
.list-hover .list-item:hover {
  background-color: #f0f2f5;
}
```

* **list-hover**：带悬停效果的列表
* **padding**：内部间距
* **cursor: pointer**：鼠标手型
* **:hover background-color**：鼠标悬停高亮

  * 其他常用值：不同背景色可根据设计稿调整

---

**使用示例**

```
<div class="list-hover">
  <div class="list-item">菜单1</div>
  <div class="list-item">菜单2</div>
</div>
```

---

### 通用边距类

```
.m-8 { margin: 8px; }
.mt-8 { margin-top: 8px; }
.mb-8 { margin-bottom: 8px; }
.ml-8 { margin-left: 8px; }
.mr-8 { margin-right: 8px; }
```

* **m-* / mt-* / mb-* / ml-* / mr-***：快速设置外边距
* **使用场景**：组件间统一间距，方便快速布局

---

**使用示例**

```
<div class="card m-8">卡片1</div>
<div class="card m-8">卡片2</div>
```

---

### 通用内边距类

```
.p-8 { padding: 8px; }
.pt-8 { padding-top: 8px; }
.pb-8 { padding-bottom: 8px; }
.pl-8 { padding-left: 8px; }
.pr-8 { padding-right: 8px; }
```

* **p-* / pt-* / pb-* / pl-* / pr-***：快速设置内边距
* **使用场景**：保持组件内部统一留白

---

**使用示例**

```
<div class="card p-8">带内边距的卡片</div>
```

---

### 水平分隔线

```
.hr {
  border: none;
  border-top: 1px solid #ebeef5;
  margin: 16px 0;
}
```

* **hr**：水平分隔线
* **border-top**：使用上边框实现
* **margin**：上下间距
* **其他常用值**：颜色、粗细可根据设计稿调整

---

**使用示例**

```
<p>段落1</p>
<hr class="hr">
<p>段落2</p>
```

---

### 文字居中

```
.text-center {
  text-align: center;
}
```

* **text-center**：文字水平居中
* **其他常用值**：

  * `text-left`：左对齐
  * `text-right`：右对齐

---

**使用示例**

```
<p class="text-center">居中文本</p>
```

---

### 水平垂直居中容器

```
.center-box {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

* **center-box**：水平垂直居中
* **display: flex**：弹性布局
* **justify-content: center**：水平居中
* **align-items: center**：垂直居中
* 其他常用值：

  * `justify-content: flex-start / flex-end / space-between / space-around`
  * `align-items: flex-start / flex-end / stretch`

---

**使用示例**

```
<div class="center-box" style="height:100px; border:1px solid #ccc;">
  <button class="btn">居中按钮</button>
</div>
```

---

### 溢出隐藏与滚动

```
.overflow-auto {
  overflow: auto;
}
.overflow-hidden {
  overflow: hidden;
}
```

* **overflow-auto**：内容超出显示滚动条
* **overflow-hidden**：内容超出隐藏
* 适用于弹窗内容、表格、滚动列表等

---

**使用示例**

```
<div class="overflow-auto" style="height: 100px; border: 1px solid #ccc;">
  <p>很多内容...</p>
</div>
```

---

### 背景渐变色

```
.bg-gradient {
  background: linear-gradient(90deg, #409eff, #67c23a);
}
```

* **bg-gradient**：线性渐变背景
* **linear-gradient**：渐变方向和颜色
* 可用于按钮、卡片或 banner 背景

---

**使用示例**

```
<div class="bg-gradient p-8">渐变背景卡片</div>
```

---

### 圆形头像

```
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}
```

* **avatar**：圆形头像
* **width / height**：固定尺寸
* **border-radius: 50%**：圆形
* **object-fit: cover**：保持图片比例

---

**使用示例**

```
<img class="avatar" src="avatar.jpg" alt="头像"/>
```

---

### 按钮尺寸

```
.btn-small { padding: 4px 12px; font-size: 12px; height: 28px; }
.btn-medium { padding: 6px 16px; font-size: 14px; height: 32px; }
.btn-large { padding: 8px 20px; font-size: 16px; height: 40px; }
```

* **btn-small / medium / large**：不同尺寸按钮
* **padding / font-size / height**：统一高度与文字大小

---

**使用示例**

```
<button class="btn btn-small">小按钮</button>
<button class="btn btn-medium">中按钮</button>
<button class="btn btn-large">大按钮</button>
```

---

### 标签状态色

```
.tag-primary { background-color: #409eff; color: #fff; }
.tag-success { background-color: #67c23a; color: #fff; }
.tag-warning { background-color: #e6a23c; color: #fff; }
.tag-error { background-color: #f56c6c; color: #fff; }
```

* **tag-***：常用状态标签
* **background-color**：背景颜色
* **color**：文字颜色，保证可读性
* **应用场景**：状态标识、分类标签

---

**使用示例**

```
<span class="tag-primary">进行中</span>
<span class="tag-success">成功</span>
<span class="tag-error">失败</span>
```

---

### 表格排序指示

```
.table th {
  cursor: pointer;
  position: relative;
}
.table th:after {
  content: '▲▼';
  font-size: 10px;
  position: absolute;
  right: 8px;
  color: #c0c4cc;
}
```

* **table th**：表头单元格
* **cursor: pointer**：鼠标手型
* **position: relative / :after**：添加排序箭头
* **content**：显示上下箭头
* **color / font-size**：箭头颜色和大小

---

**使用示例**

```
<table class="table">
  <tr>
    <th>姓名</th>
    <th>邮箱</th>
  </tr>
</table>
```

---

### 弹窗关闭按钮

```
.modal-close {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 16px;
  cursor: pointer;
  color: #909399;
}
.modal-close:hover {
  color: #f56c6c;
}
```

* **modal-close**：弹窗右上角关闭按钮
* **position: absolute / top / right**：固定位置
* **cursor: pointer**：鼠标手型
* **hover color**：悬停颜色变化

---

**使用示例**

```
<div class="modal">
  <span class="modal-close">×</span>
  <div class="modal-content">弹窗内容</div>
</div>
```

---

### 折叠面板增强

```
.collapse-header {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.collapse-header::after {
  content: '▼';
  transition: transform 0.3s;
}
.collapse.active .collapse-header::after {
  transform: rotate(-180deg);
}
```

* **collapse-header**：可点击折叠标题
* **justify-content / align-items**：内容水平分布和垂直居中
* **::after content**：箭头指示
* **transition / transform**：动画旋转

---

**使用示例**

```
<div class="collapse">
  <div class="collapse-header">标题</div>
  <div class="collapse-body">内容</div>
</div>
```

---

### 响应式栅格

```
.col-6 { width: 50%; }
.col-4 { width: 33.3333%; }
.col-3 { width: 25%; }

@media (max-width: 768px) {
  .col-6, .col-4, .col-3 { width: 100%; }
}
```

* **col-***：栅格列宽
* **@media**：响应式适配
* **应用场景**：多列布局，自适应小屏

---

**使用示例**

```
<div class="row">
  <div class="col-6"><div class="card">列1</div></div>
  <div class="col-6"><div class="card">列2</div></div>
</div>
```

---

### 悬浮提示按钮

```
.btn-tooltip {
  position: relative;
}
.btn-tooltip:hover .tooltip-text {
  visibility: visible;
}
.tooltip-text {
  visibility: hidden;
  position: absolute;
  top: -28px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #303133;
  color: #fff;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 1000;
}
```

* **btn-tooltip**：带提示的按钮
* **tooltip-text**：提示框
* **visibility**：默认隐藏，悬停显示
* **position / transform**：定位
* **background-color / padding / border-radius**：样式

---

**使用示例**

```
<div class="btn-tooltip">
  <button class="btn">悬停</button>
  <span class="tooltip-text">提示信息</span>
</div>
```

---

### 弹性容器换行

```
.flex-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
```

* **flex-wrap**：允许子元素换行
* **gap**：元素间距
* **应用场景**：按钮组、标签堆叠、卡片列表

---

**使用示例**

```
<div class="flex-wrap">
  <div class="card">卡片1</div>
  <div class="card">卡片2</div>
  <div class="card">卡片3</div>
</div>
```

---

### 图片圆角与阴影

```
.img-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  object-fit: cover;
}
```

* **border-radius**：圆角
* **box-shadow**：投影，增加卡片感
* **object-fit: cover**：保持比例填充

---

**使用示例**

```
<img class="img-card" src="pic.jpg" alt="图片" width="200" height="150"/>
```

---

### 提示信息框

```
.alert {
  padding: 12px 16px;
  border-radius: 4px;
  margin-bottom: 16px;
  font-size: 14px;
}
.alert-success { background-color: #f0f9eb; color: #67c23a; }
.alert-warning { background-color: #fdf6ec; color: #e6a23c; }
.alert-error { background-color: #fef0f0; color: #f56c6c; }
```

* **alert**：提示框基础样式
* **padding / border-radius / font-size / margin**：统一样式
* **alert-***：不同状态颜色

---

**使用示例**

```
<div class="alert alert-success">操作成功</div>
<div class="alert alert-warning">请注意</div>
<div class="alert alert-error">操作失败</div>
```

---

### 表单校验状态

```
.input-error {
  border-color: #f56c6c;
  background-color: #fff0f0;
}
.input-success {
  border-color: #67c23a;
  background-color: #f0f9eb;
}
```

* **input-error / input-success**：输入框校验状态
* **border-color**：边框颜色提示状态
* **background-color**：背景颜色
* **应用场景**：表单校验提示

---

**使用示例**

```
<input class="input input-error" placeholder="错误示例"/>
<input class="input input-success" placeholder="正确示例"/>
```

---

### 下拉选中高亮

```
.select-item {
  padding: 6px 12px;
  cursor: pointer;
}
.select-item:hover, .select-item.active {
  background-color: #f5f7fa;
}
```

* **select-item**：下拉项
* **padding**：内边距
* **cursor: pointer**：鼠标手型
* **hover / active 背景色**：高亮显示

---

**使用示例**

```
<div class="select-item">选项1</div>
<div class="select-item active">选项2</div>
```

---

### 栅格偏移

```
.offset-3 { margin-left: 25%; }
.offset-2 { margin-left: 16.6667%; }
```

* **offset-***：列偏移，常用于栅格布局
* **margin-left**：左侧偏移比例
* **应用场景**：布局调整、居中或对齐

---

**使用示例**

```
<div class="row">
  <div class="col-6 offset-3"><div class="card">偏移列</div></div>
</div>
```

---

### 卡片悬停阴影

```
.card-hover-shadow {
  transition: box-shadow 0.3s ease;
}
.card-hover-shadow:hover {
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}
```

* **card-hover-shadow**：鼠标悬停卡片效果
* **transition**：平滑过渡
* **box-shadow**：悬停增强阴影

---

**使用示例**

```
<div class="card-shadow card-hover-shadow">
  <p>悬停卡片阴影</p>
</div>
```

---

### 小组件边框

```
.border-box {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 8px;
}
```

* **border-box**：通用小组件边框
* **border / border-radius**：边框和圆角
* **padding**：内部间距

---

**使用示例**

```
<div class="border-box">小组件内容</div>
```

---

### 流式文字

```
.text-flow {
  white-space: normal;
  word-break: break-word;
}
```

* **text-flow**：文字自动换行
* **white-space: normal**：允许换行
* **word-break: break-word**：长单词换行
* **应用场景**：表格单元格、卡片内容

---

**使用示例**

```
<p class="text-flow">这是一段很长的文字，超过容器宽度时会自动换行显示。</p>
```

---

### 多行省略

```
.text-ellipsis-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

* **text-ellipsis-2**：多行文本溢出显示省略号
* **-webkit-line-clamp: 2**：限制显示行数
* **overflow: hidden**：隐藏溢出内容
* **应用场景**：卡片内容、列表描述

---

**使用示例**

```
<p class="text-ellipsis-2">这是一段很长的文字内容，用于演示多行溢出省略效果。</p>
```

---

### 按钮图标位置

```
.btn-icon-left {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.btn-icon-left i {
  order: -1;
}
```

* **btn-icon-left**：图标在文字左侧按钮
* **display: inline-flex / align-items / gap**：水平排列和间距
* **i order: -1**：图标在文字前面

---

**使用示例**

```
<button class="btn btn-icon-left"><i class="icon-search"></i>搜索</button>
```

---

### 标签组合

```
.tag-group {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
```

* **tag-group**：多个标签组合
* **flex-wrap: wrap**：换行
* **gap: 4px**：标签间距

---

**使用示例**

```
<div class="tag-group">
  <span class="tag-primary">标签1</span>
  <span class="tag-success">标签2</span>
  <span class="tag-warning">标签3</span>
</div>
```

---

### 列表分组

```
.list-group {
  border: 1px solid #ebeef5;
  border-radius: 4px;
}
.list-group .list-item {
  padding: 8px 16px;
  border-bottom: 1px solid #ebeef5;
}
.list-group .list-item:last-child {
  border-bottom: none;
}
```

* **list-group**：分组列表容器
* **list-item**：分组内每一项
* **border / padding**：边框与间距
* **last-child**：最后一行去掉下边框

---

**使用示例**

```
<div class="list-group">
  <div class="list-item">分组项1</div>
  <div class="list-item">分组项2</div>
</div>
```

---

