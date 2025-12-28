# SCSS

**SCSS（Sassy CSS）** 是 CSS 的一种预处理语言，是 Sass 的一种语法形式。它在 CSS 的基础上增加了变量、嵌套规则、Mixin（可复用样式块）、函数、继承等特性，使样式代码更具可维护性和可复用性。通过 SCSS，可以避免重复书写、管理复杂层级样式，并支持模块化拆分，便于大型项目中统一管理主题、颜色、间距等。编译后生成标准 CSS，直接被浏览器识别，在企业级项目中常用于构建规范化、可扩展的样式体系。



## 基础配置

安装依赖

```
pnpm add scss@0.2.4 --filter @apps/scss
```

目录结构（实际项目开发可供参考）

```
src/
├─ styles/
│  ├─ tokens/                 # 设计 Token（核心）
│  │  ├─ color.scss           # 颜色体系
│  │  ├─ size.scss            # 尺寸 & 间距
│  │  ├─ font.scss            # 字体体系
│  │  └─ radius.scss          # 圆角、边框
│  │
│  ├─ base/
│  │  ├─ reset.scss           # 重置样式
│  │  ├─ typography.scss      # 排版
│  │  └─ base.scss            # html/body 全局
│  │
│  ├─ components/             # 通用组件样式（Button / Card）
│  │  ├─ button.scss
│  │  ├─ card.scss
│  │  └─ form.scss
│  │
│  ├─ common/
│  │  ├─ transition.scss
│  │  ├─ typography.scss
│  │  └─ utilities.scss    # 工具类
│  │
│  └─ index.scss           # 样式总入口
│
├─ views/
│  └─ user/
│     └─ index.vue         # 只写极少 scoped 样式
```



## 基础样式

---

### 变量与嵌套基础

```
@use "sass:color";

$primary-color: #409eff;       // 主色，用于按钮、标题等
$secondary-color: #67c23a;     // 次色，用于成功状态
$padding-base: 12px;           // 基础内边距

.card {
  background-color: #fff;                          // 卡片背景色
  padding: $padding-base;                          // 使用变量设置内边距
  border: 1px solid color.adjust(
          $primary-color,
      $lightness: 40%
  );                                                // 边框颜色：主色亮度增加 40%
  border-radius: 4px;                              // 卡片圆角

  .card-title {
    font-size: 16px;        // 标题文字大小
    font-weight: 600;       // 半粗体
    color: $primary-color;  // 标题颜色使用主色
    margin-bottom: 8px;     // 下方间距
  }

  .card-content {
    font-size: 14px;        // 内容文字大小
    color: #606266;         // 内容文字颜色
    line-height: 1.5;       // 行高，保证可读性
  }
}
```

* **$primary-color / $secondary-color / $padding-base**：SCSS 变量，可以在多个地方复用，方便统一管理
* **background-color**：元素背景颜色
* **padding**：内部留白
* **border**：边框样式
* **lighten($color, 40%)**：SCSS 内置函数，将颜色亮度提高40%，方便生成边框或悬浮颜色
* **border-radius**：圆角
* **font-size**：文字大小
* **font-weight**：文字粗细
* **color**：文字颜色
* **margin-bottom**：下间距
* **line-height**：行高
* **嵌套规则**（`.card .card-title`）：避免重复写完整选择器，清晰层级

---

**使用示例**

```
<div class="card">
  <div class="card-title">用户信息</div>
  <div class="card-content">这里是卡片内容</div>
</div>
```

---

### 运算与 Mixin 基础

```
@use "sass:color";

$base-font-size: 14px;         // 基础字体大小
$scale-factor: 1.2;            // 放大比例，用于标题字体计算
$primary-color: #409eff;       // 主色
$padding-base: 12px;           // 基础内边距

// 定义一个可复用的 Mixin
@mixin card-style($bg-color, $border-color) {
  background-color: $bg-color;                     // 背景颜色
  border: 1px solid $border-color;                // 边框颜色
  border-radius: 4px;                              // 圆角
  padding: $padding-base;                           // 内边距使用基础变量
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);          // 阴影效果
}

.card {
  @include card-style(#fff, 1px solid color.adjust( $primary-color, $lightness: 40%) );  // 使用 Mixin，并通过运算调整边框颜色

  .card-title {
    font-size: $base-font-size * $scale-factor;   // 字体大小 = 基础字体 * 放大比例
    font-weight: 600;                             // 半粗体
    color: $primary-color;                        // 标题颜色
    margin-bottom: 8px;                           // 下方间距
  }

  .card-content {
    font-size: $base-font-size;                   // 内容字体大小
    color: #606266;                               // 内容文字颜色
    line-height: 1.5;                             // 行高
  }
}
```

---

**参数和概念说明**

* **$base-font-size / $scale-factor / $primary-color / $padding-base**：变量，用于统一管理字体、颜色、间距等
* **@mixin card-style($bg-color, $border-color)**：定义可复用样式块

  * **$bg-color**：背景颜色参数
  * **$border-color**：边框颜色参数
* **@include card-style(...)**：使用 Mixin 并传入具体参数
* **lighten($primary-color, 40%)**：颜色运算，将主色亮度增加40%
* **font-size: $base-font-size * $scale-factor**：数值运算，动态计算字体大小
* **border-radius / box-shadow / padding**：基础排版和视觉效果
* **嵌套规则**：保持层级清晰，减少选择器重复

---

**使用示例**

```
<div class="card">
  <div class="card-title">运算与 Mixin 示例</div>
  <div class="card-content">这是一个可复用的卡片组件</div>
</div>
```

---

### 继承与占位符 %extend 基础

```
@use "sass:color";

$primary-color: #409eff;      // 主色
$padding-base: 12px;          // 基础内边距

// 定义一个占位符，通用卡片基础样式
%card-base {
  background-color: #fff;                   // 背景颜色
  border: 1px solid color.adjust( $primary-color, $lightness: 40%) ;  // 边框颜色，主色亮度加40%
  border-radius: 4px;                       // 圆角
  padding: $padding-base;                   // 内边距
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);   // 阴影效果
}

// 定义不同类型的卡片，通过继承占位符
.card-primary {
  @extend %card-base;                       // 继承通用卡片样式
  border-color: $primary-color;             // 覆盖边框颜色为主色
}

.card-secondary {
  @extend %card-base;                       // 继承通用卡片样式
  border-color: color.adjust( $primary-color, $lightness: 60%) ; // 覆盖边框颜色为更浅主色
}
```

---

**参数和概念说明**

* **$primary-color / $padding-base**：SCSS 变量，用于统一管理颜色和间距
* **%card-base**：占位符（Placeholder Selector），定义可继承的基础样式
* **@extend %card-base**：继承占位符样式，避免重复书写
* **background-color**：背景颜色
* **border**：边框样式
* **lighten($primary-color, 40%) / 60%)**：颜色运算，生成不同亮度的边框
* **border-radius**：圆角
* **padding**：内边距
* **box-shadow**：阴影效果
* **应用场景**：企业级项目中，多种卡片类型、消息框、面板都可以复用基础样式

---

**使用示例**

```
<div class="card-primary">
  主色卡片内容
</div>

<div class="card-secondary">
  次色卡片内容
</div>
```

---

### 条件与循环基础

```
@use "sass:color";

$colors: (primary: #409eff, success: #67c23a, warning: #e6a23c, error: #f56c6c);
$padding-base: 12px;

// 循环生成不同状态的按钮颜色
@each $name, $color in $colors {
  .btn-#{$name} {
    background-color: $color;          // 背景颜色使用循环变量
    color: #fff;                        // 文字颜色统一为白色
    padding: $padding-base 16px;        // 内边距，左右固定16px，上下使用变量
    border: none;                        // 边框去掉
    border-radius: 4px;                  // 圆角
    cursor: pointer;                     // 鼠标手型

    &:hover {
      @if $name == primary {
        background-color: color.adjust($color, $lightness: -10%);  // 主色悬停变暗
      } @else if $name == success {
        background-color: color.adjust($color, $lightness: 10%); // 成功色悬停变亮
      } @else {
        background-color: $color;               // 其他颜色不变
      }
    }
  }
}

// @for 循环生成间距类
@for $i from 1 through 5 {
  .m-#{$i} {
    margin: $i * 4px;   // 外边距 4px、8px、12px、16px、20px
  }
}
```

---

**参数和概念说明**

* **$colors**：SCSS Map 类型变量，存放不同状态的颜色
* **@each $name, $color in $colors**：遍历 Map，生成对应状态按钮
* **.btn-#{$name}**：使用 `#{$}` 插值语法动态生成类名
* **background-color / color / padding / border / border-radius / cursor**：基础样式
* **&:hover**：嵌套伪类，表示按钮悬停
* **@if / @else if / @else**：条件判断，针对不同按钮状态定义悬停样式
* **darken($color, 10%) / lighten($color, 10%)**：SCSS 内置颜色函数
* **@for $i from 1 through 5**：循环生成类，方便批量定义间距
* **margin: $i * 4px**：数值运算，生成统一外边距类

---

**使用示例**

```
<button class="btn-primary">主按钮</button>
<button class="btn-success">成功按钮</button>
<button class="btn-warning">警告按钮</button>
<button class="btn-error">错误按钮</button>

<div class="m-1">外边距 4px</div>
<div class="m-3">外边距 12px</div>
<div class="m-5">外边距 20px</div>
```

---

### 响应式和媒体查询基础

```
$breakpoint-sm: 576px;
$breakpoint-md: 768px;
$breakpoint-lg: 992px;
$padding-base: 12px;

.container {
  padding: $padding-base;

  // 小屏幕
  @media (max-width: $breakpoint-sm) {
    background-color: #f5f7fa; // 背景变浅
    font-size: 10px;            // 文字缩小
  }

  // 中屏幕
  @media (min-width: calc(#{$breakpoint-sm} + 1px)) and (max-width: $breakpoint-md) {
    background-color: #e6f0ff;
    font-size: 20px;
  }

  // 中大屏（769px ~ 991px）
  @media (min-width: calc(#{$breakpoint-md} + 1px)) and (max-width: calc(#{$breakpoint-lg} - 1px)) {
    background-color: #e6f0ff;
    font-size: 30px;
  }

  // 大屏幕
  @media (min-width: $breakpoint-lg) {
    background-color: #fff;
    font-size: 40px;
  }
}
```

---

**参数和概念说明**

* **$breakpoint-sm / $breakpoint-md / $breakpoint-lg**：响应式断点变量，用于不同屏幕尺寸
* **$padding-base**：基础内边距变量
* **.container**：容器类，用于演示响应式布局
* **padding**：内部留白
* **@media (max-width: …)**：小屏幕样式规则
* **@media (min-width: …) and (max-width: …)**：中屏幕样式规则
* **@media (min-width: …)**：大屏幕样式规则
* **background-color / font-size**：在不同屏幕下改变背景和文字大小，实现响应式

---

**使用示例**

```
<div class="container">
  响应式容器内容，根据屏幕大小改变背景色和字体大小
</div>
```

---

## 基础示例

### Mixin 生成不同大小按钮

```
@use "sass:math";

$padding-base: 12px;
$border-radius: 4px;

@mixin btn-size($size) {
  @if $size == small {
    padding: math.div($padding-base, 2) 8px; // 小按钮内边距
    font-size: 12px;                // 小按钮文字大小
  } @else if $size == medium {
    padding: $padding-base 16px;    // 中按钮内边距
    font-size: 14px;                // 中按钮文字大小
  } @else if $size == large {
    padding: math.div($padding-base * 3, 2) 20px; // 大按钮内边距
    font-size: 16px;                  // 大按钮文字大小
  }
  border-radius: $border-radius;     // 圆角统一
  border: none;                      // 去掉边框
  cursor: pointer;                   // 鼠标手型
}

.btn-small {
  @include btn-size(small);
  background-color: #409eff;
  color: #fff;
}

.btn-medium {
  @include btn-size(medium);
  background-color: #67c23a;
  color: #fff;
}

.btn-large {
  @include btn-size(large);
  background-color: #e6a23c;
  color: #fff;
}
```

---

**参数和概念说明**

* **$padding-base / $border-radius**：基础变量，用于统一内边距和圆角
* **@mixin btn-size($size)**：定义可复用按钮大小 Mixin
* **$size 参数**：传入 small / medium / large 来生成不同大小按钮
* **@if / @else if / @else**：根据参数选择对应样式
* **padding / font-size / border-radius / border / cursor**：按钮基础样式
* **@include btn-size(...)**：调用 Mixin 并传入不同参数
* **background-color / color**：为每个按钮设置不同背景色和文字颜色

---

**使用示例**

```
<button class="btn-small">小按钮</button>
<button class="btn-medium">中按钮</button>
<button class="btn-large">大按钮</button>
```

---

### 嵌套 + 伪类 + 动画基础

```
@use "sass:color";

$primary-color: #409eff;
$padding-base: 12px;

.card {
  background-color: #fff;
  padding: $padding-base;
  border-radius: 4px;
  border: 1px solid color.scale($primary-color, $lightness: 40%);
  transition: transform 0.3s ease, box-shadow 0.3s ease; // 动画效果

  &:hover {
    transform: translateY(-4px);                  // 鼠标悬停时向上移动
    box-shadow: 0 4px 16px rgba(0,0,0,0.2);     // 悬停阴影变化

    .card-title::after {
      opacity: 1;              // 悬停才显示
      transform: scale(1);
    }
  }

  .card-title {
    font-size: 16px;
    font-weight: 600;
    color: $primary-color;
    margin-bottom: 8px;

    &:after {
      opacity: 0;        // 默认隐藏
      content: "★";                               // 添加伪元素
      margin-left: 4px;
      color: gold;
    }
  }

  .card-content {
    font-size: 14px;
    color: #606266;
    line-height: 1.5;
  }
}
```

---

**参数和概念说明**

* **$primary-color / $padding-base**：变量，用于统一主色和间距
* **border-radius / border / background-color**：基础卡片样式
* **transition: transform 0.3s ease, box-shadow 0.3s ease**：动画属性，平滑过渡
* **&:hover**：伪类，鼠标悬停时触发的样式
* **transform: translateY(-4px)**：卡片上移 4px
* **box-shadow**：悬停阴影效果
* **嵌套规则**：`.card .card-title`、`.card .card-content`
* **&:after**：伪元素，用于在标题后添加装饰符号
* **content / margin-left / color**：伪元素样式

---

**使用示例**

```
<div class="card">
  <div class="card-title">交互卡片</div>
  <div class="card-content">鼠标悬停时有上移和阴影效果，标题后有星号</div>
</div>
```

---

### 函数 + 数值运算 + 动态颜色生成

```
@use "sass:color";

$primary-color: #409eff;
$padding-base: 12px;

// 定义一个 SCSS 函数，根据比例生成不同亮度颜色
@function adjust-lightness($color, $percent) {
  @return color.scale($color, $lightness: $percent);
}

.card {
  background-color: adjust-lightness($primary-color, 50%); // 亮度增加50%
  padding: $padding-base;
  border-radius: 4px;
  border: 1px solid adjust-lightness($primary-color, -20%); // 边框变暗20%
  color: adjust-lightness($primary-color, -50%);           // 文字变暗50%
}
```

---

**参数和概念说明**

* **@use "sass:color"**：导入 SCSS 内置颜色模块
* **$primary-color / $padding-base**：变量，用于统一主题色和内边距
* **@function adjust-lightness($color, $percent)**：自定义函数，用于动态调整颜色亮度
* **color.scale($color, $lightness: $percent)**：调整颜色亮度，正值变亮，负值变暗
* **background-color / border / color**：使用函数生成动态颜色
* **padding / border-radius**：基础布局样式

---

**使用示例**

```
<div class="card">
  动态颜色卡片，背景亮度增加50%，边框和文字变暗
</div>
```

---

### Flex 布局 + gap 变量化

```
$gap-base: 16px;

.flex-wrap {
  display: flex;             // 弹性布局
  flex-wrap: wrap;           // 超出宽度自动换行
  gap: $gap-base;            // 使用变量控制子元素间距
  align-items: center;       // 垂直居中
  justify-content: flex-start; // 水平左对齐
}
```

**参数和概念说明**

* **$gap-base**：SCSS 变量，方便全局统一间距
* **gap: $gap-base**：通过变量设置弹性布局间距
* **display: flex / flex-wrap / align-items / justify-content**：弹性布局属性

**使用示例**

```
<div class="flex-wrap">
  <div>元素1</div>
  <div>元素2</div>
</div>
```

---

### 栅格布局 + 嵌套运算

```
$gutter: 16px;

.row {
  display: flex;
  margin-left: -($gutter / 2);   // 使用运算抵消列内 padding
  margin-right: -($gutter / 2);

  > .col {
    flex: 1;
    padding: $gutter / 2;         // 内边距变量化
  }
}
```

**参数和概念说明**

* **$gutter / $gutter / 2**：使用 SCSS 数值运算计算左右 padding
* **> .col**：嵌套选择器
* **flex: 1**：等分宽度

**使用示例**

```
<div class="row">
  <div class="col">列1</div>
  <div class="col">列2</div>
</div>
```

---

### 循环生成网格列

```
$cols: 4;

@for $i from 1 through $cols {
  .col-#{$i} {
    width: (100% / $cols) * $i; // 动态计算宽度
    padding: 8px;
    box-sizing: border-box;
  }
}
```

**参数和概念说明**

* **@for $i from 1 through $cols**：循环生成列类
* **width: (100% / $cols) * $i**：数值运算生成百分比宽度
* **插值 #{$i}**：动态生成类名

**使用示例**

```
<div class="col-1">1/4</div>
<div class="col-2">2/4</div>
```

---

### 动态按钮主题颜色 + 条件

```
$colors: (primary: #409eff, success: #67c23a);
@use "sass:color";

@each $name, $color in $colors {
  .btn-#{$name} {
    background-color: $color;
    color: #fff;
    padding: 8px 16px;
    border-radius: 4px;

    &:hover {
      @if $name == primary {
        background-color: color.scale($color, $lightness: -10%);
      } @else {
        background-color: color.scale($color, $lightness: 10%);
      }
    }
  }
}
```

**参数和概念说明**

* **@each 遍历 Map**：循环生成不同主题按钮
* **插值 #{$name}**：动态生成类名
* **@if 条件判断**：根据按钮类型修改悬停颜色
* **color.scale($color, $lightness: ±10%)**：SCSS 动态颜色调整

**使用示例**

```
<button class="btn-primary">主按钮</button>
<button class="btn-success">成功按钮</button>
```

---

### Mixin 参数化按钮大小

```
$padding-base: 12px;

@mixin btn-size($size) {
  @if $size == small {
    padding: $padding-base / 2 8px;
    font-size: 12px;
  } @else if $size == medium {
    padding: $padding-base 16px;
    font-size: 14px;
  } @else {
    padding: $padding-base * 1.5 20px;
    font-size: 16px;
  }
  border-radius: 4px;
}

.btn-small { @include btn-size(small); background: #409eff; color: #fff; }
.btn-medium { @include btn-size(medium); background: #67c23a; color: #fff; }
.btn-large { @include btn-size(large); background: #e6a23c; color: #fff; }
```

**参数和概念说明**

* **@mixin + 参数**：复用样式并传入尺寸参数
* **@include btn-size(...)**：调用 Mixin
* **运算 / 条件判断**：动态设置 padding 和 font-size

**使用示例**

```
<button class="btn-small">小</button>
<button class="btn-medium">中</button>
<button class="btn-large">大</button>
```

---

### 函数生成动态亮度颜色

```
@use "sass:color";
$primary-color: #409eff;

@function adjust($color, $percent) {
  @return color.scale($color, $lightness: $percent);
}

.card {
  background-color: adjust($primary-color, 50%);
  border: 1px solid adjust($primary-color, -20%);
  color: adjust($primary-color, -50%);
  padding: 12px;
  border-radius: 4px;
}
```

**参数和概念说明**

* **@function**：自定义函数生成动态颜色
* **color.scale**：调整亮度
* **变量 + 函数结合**：实现动态主题

**使用示例**

```
<div class="card">动态颜色卡片</div>
```

---

### 响应式 + 变量化断点

```
$break-sm: 576px;
$break-md: 768px;

.container {
  padding: 12px;

  @media (max-width: $break-sm) { font-size: 12px; }
  @media (min-width: $break-sm + 1px) and (max-width: $break-md) { font-size: 14px; }
  @media (min-width: $break-md + 1px) { font-size: 16px; }
}
```

**参数和概念说明**

* **$break-sm / $break-md**：断点变量
* **运算 + 插值**：计算中屏范围
* **@media 嵌套**：SCSS 嵌套媒体查询

**使用示例**

```
<div class="container">响应式文字</div>
```

---

### 循环生成间距类

```
@for $i from 1 through 5 {
  .m-#{$i} { margin: $i * 4px; }
  .p-#{$i} { padding: $i * 4px; }
}
```

**参数和概念说明**

* **@for 循环**：批量生成类
* **插值 #{$i} + 运算**：动态生成样式和数值

**使用示例**

```
<div class="m-2 p-3">间距示例</div>
```

---

### 嵌套 + 伪类 + 插值

```
$colors: (primary: #409eff, success: #67c23a);

@each $name, $color in $colors {
  .btn-#{$name} {
    color: #fff;
    background: $color;
    &:hover { background: color.scale($color, $lightness: -10%); }
  }
}
```

**参数和概念说明**

* **嵌套 &:hover**：伪类嵌套
* **插值 #{$name}**：动态类名
* **@each 遍历 Map**：生成多主题按钮

**使用示例**

```
<button class="btn-primary">悬停变暗</button>
<button class="btn-success">悬停变暗</button>
```

---

### Mixin + 循环生成色阶按钮

```
@use "sass:color";
$base-color: #409eff;

@for $i from 1 through 5 {
  .btn-level-#{$i} {
    background-color: color.scale($base-color, $lightness: $i * 10%);
    color: #fff;
    padding: 8px 16px;
    border-radius: 4px;
  }
}
```

**参数和概念说明**

* **@for 循环**：生成 5 个色阶按钮
* **color.scale**：动态调整亮度
* **插值 #{$i}**：生成类名

**使用示例**

```
<button class="btn-level-1">亮度10%</button>
<button class="btn-level-5">亮度50%</button>
```

---

明白了，我们继续，整理 **21-30 个 SCSS 示例**，完全体现 SCSS 特性，适合企业项目使用，同时兼容 `"scss": "^0.2.4"` 版本。

---

### 响应式隐藏元素

```
$break-sm: 576px;

.hide-sm {
  display: block;

  @media (max-width: $break-sm) {
    display: none;   // 小屏幕隐藏
  }
}
```

**参数和概念说明**

* **$break-sm**：断点变量
* **@media 嵌套**：SCSS 嵌套媒体查询
* **display: none / block**：根据屏幕大小控制显示

**使用示例**

```
<div class="hide-sm">小屏幕隐藏的内容</div>
```

---

### 动态主题色变量 + Mixin

```
$themes: (primary: #409eff, success: #67c23a);

@mixin theme-bg($color-name) {
  @if map-has-key($themes, $color-name) {
    background-color: map-get($themes, $color-name);
  } @else {
    background-color: #ccc;
  }
  color: #fff;
  padding: 8px 16px;
  border-radius: 4px;
}
```

**参数和概念说明**

* **Map 类型 $themes**：存储主题色
* **@mixin theme-bg($color-name)**：动态选择主题色
* **map-has-key / map-get**：条件判断和取值
* **padding / border-radius / color**：基础样式

**使用示例**

```
<button class="primary-btn" style="@include theme-bg(primary);">主按钮</button>
```

---

### 卡片阴影深度循环

```
@for $i from 1 through 3 {
  .card-depth-#{$i} {
    box-shadow: 0 $i*2px $i*4px rgba(0,0,0,0.1*$i);
    padding: 12px;
    border-radius: 4px;
  }
}
```

**参数和概念说明**

* **@for 循环**：批量生成不同阴影深度类
* **插值 #{$i}**：动态类名
* **数值运算 $i*2px / $i*4px / 0.1*$i**：动态调整阴影

**使用示例**

```
<div class="card-depth-1">浅阴影</div>
<div class="card-depth-3">深阴影</div>
```

---

###  响应式列宽 + 变量 + 插值

```
$breakpoints: (sm: 576px, md: 768px, lg: 992px);

@each $name, $size in $breakpoints {
  @media (min-width: $size) {
    .col-#{$name} { width: $size / 12 * 100%; } // 动态计算宽度
  }
}
```

**参数和概念说明**

* **Map $breakpoints**：存储断点
* **@each 遍历 Map**：动态生成响应式类
* **插值 #{$name}**：生成类名
* **数值运算**：根据断点动态计算列宽

**使用示例**

```
<div class="col-sm">小屏列</div>
<div class="col-md">中屏列</div>
```

---

### 按钮带图标 + gap 变量

```
$btn-gap: 8px;

.btn {
  display: inline-flex;
  align-items: center;
  gap: $btn-gap;          // SCSS 变量控制间距
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}
```

**参数和概念说明**

* **gap: $btn-gap**：变量化控制图标与文字间距
* **inline-flex / align-items**：水平排列、垂直居中
* **padding / border / border-radius**：按钮基础样式

**使用示例**

```
<button class="btn">
  <span>🔍</span> 搜索
</button>
```

---

### 列表悬停 + 选中状态变量化

```
$hover-color: #f5f7fa;
$selected-color: #e6f0ff;

.list-item {
  padding: 8px 12px;
  cursor: pointer;

  &:hover { background-color: $hover-color; }
  &.selected { background-color: $selected-color; }
}
```

**参数和概念说明**

* **变量 $hover-color / $selected-color**：方便全局调整
* **&:hover / &.selected**：伪类和类选择器嵌套

**使用示例**

```
<div class="list-item">选项1</div>
<div class="list-item selected">选中选项</div>
```

---

###  嵌套卡片标题 + 伪元素

```
$primary-color: #409eff;

.card {
  padding: 12px;
  border-radius: 4px;
  background-color: #fff;

  .card-title {
    font-size: 16px;
    font-weight: 600;
    color: $primary-color;

    &:after {
      content: "★";
      margin-left: 4px;
      color: gold;
    }
  }
}
```

**参数和概念说明**

* **嵌套 .card-title**：保持层级清晰
* **&:after 伪元素**：标题装饰符号
* **变量 $primary-color**：统一主题色

**使用示例**

```
<div class="card">
  <div class="card-title">卡片标题</div>
</div>
```

---

### 头像组件 + 嵌套图片

```
$avatar-size: 50px;

.avatar {
  width: $avatar-size;
  height: $avatar-size;
  border-radius: 50%;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
```

**参数和概念说明**

* **$avatar-size**：变量控制统一尺寸
* **嵌套 img**：控制图片自适应
* **object-fit: cover**：保持比例裁剪

**使用示例**

```
<div class="avatar">
  <img src="avatar.jpg" />
</div>
```

---

### 动态色阶按钮循环

```
@use "sass:color";
$base-color: #409eff;

@for $i from 1 through 5 {
  .btn-level-#{$i} {
    background-color: color.scale($base-color, $lightness: $i * 10%);
    color: #fff;
    padding: 8px 16px;
    border-radius: 4px;
  }
}
```

**参数和概念说明**

* **@for 循环 + 插值**：生成多色阶按钮
* **color.scale**：动态亮度调整
* **变量 $base-color**：统一主题色

**使用示例**

```
<button class="btn-level-1">亮度10%</button>
<button class="btn-level-5">亮度50%</button>
```

---

### 动态生成 padding / margin 工具类

```
@for $i from 1 through 5 {
  .m-#{$i} { margin: $i * 4px; }
  .p-#{$i} { padding: $i * 4px; }
}
```

**参数和概念说明**

* **@for 循环 + 插值 #{$i}**：批量生成工具类
* **数值运算 $i*4px**：动态计算间距

**使用示例**

```
<div class="m-2 p-3">间距示例</div>
```

---



## 全局样式示例1

### 全局样式配置

`src/styles/tokens/_color.scss`

```scss
// 颜色变量
$primary-color: #409eff;
$text-color: #303133;
$bg-color: #f5f7fa;
```

`src/styles/base/_reset.scss`

```scss
@use "../tokens/color" as *;

/* 基础重置样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: Arial, Helvetica, sans-serif;
  background-color: $bg-color;
  color: $text-color;
}
```

`src/styles/components/_button.scss`

```scss
@use "../tokens/color" as *;

/* 通用按钮样式 */
.btn {
  padding: 6px 12px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  background-color: $primary-color;
  color: #fff;

  &:hover {
    opacity: 0.85;
  }
}
```

---

### 样式总入口

`src/styles/index.scss`

```scss
@use "./tokens/color";
@use "./base/reset";
@use "./components/button";
```

> **说明**
>
> * 通过 `@use` 统一导入变量、基础样式、组件样式
> * 保持企业级 SCSS 模块化管理
> * 页面只需要引入这个入口即可使用全局样式

---

### 页面调用示例

`src/views/user/index.vue`

```vue
<template>
  <div class="user-page">
    <h1>用户页面</h1>
    <button class="btn">保存</button>
  </div>
</template>

<script setup lang="ts">
// 无逻辑，仅展示样式
</script>

<style lang="scss" scoped>
.user-page {
  padding: 16px;

  h1 {
    margin-bottom: 12px;
    font-size: 20px;
  }
}
</style>
```

---

### 在主入口加载全局样式

`src/main.ts`

```ts
import { createApp } from 'vue';
import App from './App.vue';
import '@/styles/index.scss'; // 全局样式入口

createApp(App).mount('#app');
```

> **说明**
>
> * 通过主入口引入 `index.scss`，全局样式生效
> * 页面局部样式用 `scoped` 控制特定样式
> * SCSS 模块化、变量化、企业级可维护

---

## 全局样式示例2

### 全局样式配置

`src/styles/tokens/_color.scss`

```scss
// 颜色变量
$primary-color: #409eff;
$success-color: #67c23a;
$warning-color: #e6a23c;
$error-color: #f56c6c;
$text-color: #303133;
$bg-color: #f5f7fa;
$bg-dark: #1f1f1f;
$text-dark: #eaeaea;
```

`src/styles/base/_reset.scss`

```scss
@use "../tokens/color" as *;

/* 基础重置样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: Arial, Helvetica, sans-serif;
  background-color: $bg-color;
  color: $text-color;
}
```

`src/styles/components/_button.scss`

```scss
@use "../tokens/color" as *;
@use "sass:color";

/* 按钮通用样式 */
.btn {
  padding: 6px 12px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  color: #fff;
  font-size: 14px;

  &.primary { background-color: $primary-color; }
  &.success { background-color: $success-color; }
  &.warning { background-color: $warning-color; }
  &.error   { background-color: $error-color; }

  &:hover {
    opacity: 0.85;
  }
}

/* 暗黑模式按钮 */
body.dark {
  .btn.primary {
    background-color: color.adjust($primary-color, $lightness: 10%);
  }

  .btn.success {
    background-color: color.adjust($success-color, $lightness: 10%);
  }

  .btn.warning {
    background-color: color.adjust($warning-color, $lightness: 10%);
  }

  .btn.error {
    background-color: color.adjust($error-color, $lightness: 10%);
  }
}
```

`src/styles/components/_theme.scss`

```scss
@use "../tokens/color" as *;

/* 暗黑模式变量 */
body.dark {
  background-color: $bg-dark;
  color: $text-dark;
}

body.dark a {
  color: $primary-color;
}
```

---

### 样式总入口

`src/styles/index.scss`

```scss
@use "./tokens/color";
@use "./base/reset";
@use "./components/button";
@use "./components/theme";
```

> **说明**
>
> * 通过 `@use` 统一导入变量、基础样式、组件样式、主题样式
> * 支持暗黑模式切换
> * 页面只需要引入这个入口即可使用全局样式

---

### 页面调用示例

`src/views/user/index.vue`

```vue
<template>
  <div class="user-page">
    <h1>用户页面</h1>
    <div class="button-group">
      <button class="btn primary">主按钮</button>
      <button class="btn success">成功按钮</button>
      <button class="btn warning">警告按钮</button>
      <button class="btn error">错误按钮</button>
    </div>

    <div class="toggle-theme">
      <label>
        <input type="checkbox" v-model="darkMode" /> 暗黑模式
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const darkMode = ref(false);

watch(darkMode, (val) => {
  if (val) {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }
});
</script>

<style lang="scss" scoped>
.user-page {
  padding: 16px;

  h1 {
    margin-bottom: 16px;
    font-size: 20px;
  }

  .button-group {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
  }

  .toggle-theme {
    margin-top: 12px;
  }
}
</style>
```

---

### 在主入口加载全局样式

`src/main.ts`

```ts
import { createApp } from 'vue';
import App from './App.vue';
import '@/styles/index.scss'; // 全局样式入口

createApp(App).mount('#app');
```

> **说明**
>
> * `index.scss` 引入了所有全局样式和暗黑模式支持
> * 页面通过 `v-model` 控制暗黑模式 class，按钮样式自动适配
> * SCSS 模块化 + 变量化 + 暗黑模式 + 响应式可扩展

---

