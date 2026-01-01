# UEditorPlus

基于 UEditor 二次开发的富文本编辑器

- [官网地址](https://open-doc.modstart.com/ueditor-plus/)



## 基础配置

**安装依赖**

```
pnpm add vue-ueditor-wrap@3.0.8 --filter @apps/ueditor-plus
```

**下载项目**

```typescript
wget https://gitee.com/modstart-lib/ueditor-plus/repository/archive/v4.4.0.zip
```

**拷贝 dist-min 目录**

复制 `dist-min` 到项目 `public/static/UEditorPlus/` 目录

```
cp ueditor-plus-v4.4.0/dist-main public/static/UEditorPlus
```

**引入组件**

```vue
import {createApp} from 'vue'
import App from './App.vue'
import VueUeditorWrap from 'vue-ueditor-wrap';

const app = createApp(App);

app.use(VueUeditorWrap)

app.mount('#app')
```



## 最小示例

```vue
<template>
  <div>
    <vue-ueditor-wrap v-model="content"
                      editor-id="editor"
                      :config="editorConfig"
                      :editorDependencies="['ueditor.config.js','ueditor.all.js']"
                      style="height:500px;"/>
  </div>
</template>

<script setup>
import {ref} from 'vue';

const content = ref('<p>Hello UEditorPlus</p>');
const editorConfig = {
  UEDITOR_HOME_URL: '/static/UEditorPlus/',
  UEDITOR_CORS_URL: '/static/UEditorPlus/',
  // 显示哪些按钮，隐藏 ai
  toolbarShows: {
    ai: false,
  },

  // 如果你也看不见快捷菜单里的 AI，可以设置：
  shortcutMenuShows: {
    ai: false,
  },
}
</script>
```

## 只读模式

```
<template>
  <div>
    <vue-ueditor-wrap
        v-model="content"
        editor-id="editor-form"
        :config="editorConfig"
        :editorDependencies="deps"
        style="height: 400px"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const content = ref('')

const editorConfig = {
  UEDITOR_HOME_URL: '/static/UEditorPlus/',
  UEDITOR_CORS_URL: '/static/UEditorPlus/',
  readonly: true,
  toolbars: [],
}

const deps = ['ueditor.config.js', 'ueditor.all.js']


</script>
```

## 自定义工具栏

参考：[官网文档](https://open-doc.modstart.com/ueditor-plus/manual.html#toolbars)

```vue
<template>
  <div>
    <vue-ueditor-wrap
        v-model="content"
        editor-id="editor-form"
        :config="editorConfig"
        :editorDependencies="deps"
        style="height: 400px"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const content = ref('')

const editorConfig = {
  UEDITOR_HOME_URL: '/static/UEditorPlus/',
  UEDITOR_CORS_URL: '/static/UEditorPlus/',
  toolbars: [[
    'bold',
    'italic',
    'underline',
    'forecolor',
    'insertimage',
    'link',
    'undo',
    'redo'
  ]]
}

const deps = ['ueditor.config.js', 'ueditor.all.js']


</script>
```

## 多个编辑器实例

```vue
<template>
  <div>
    <vue-ueditor-wrap
        v-for="item in editors"
        :key="item.id"
        v-model="item.content"
        :editor-id="item.id"
        :config="editorConfig"
        :editorDependencies="deps"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const editors = ref([
  { id: 'editor-1', content: '<p>A</p>' },
  { id: 'editor-2', content: '<p>B</p>' },
])

const editorConfig = {
  UEDITOR_HOME_URL: '/static/UEditorPlus/',
  UEDITOR_CORS_URL: '/static/UEditorPlus/'
}

const deps = ['ueditor.config.js', 'ueditor.all.js']


</script>
```

## 内容变化监听

```vue
<template>
  <vue-ueditor-wrap
      v-model="content"
      editor-id="editor"
      :config="editorConfig"
      :editorDependencies="deps"
      @ready="onReady"
  />
</template>

<script setup>
import { ref } from 'vue'

const content = ref('')
const editorConfig = {
  UEDITOR_HOME_URL: '/static/UEditorPlus/',
  UEDITOR_CORS_URL: '/static/UEditorPlus/',
}
const deps = ['ueditor.config.js', 'ueditor.all.js']

function onReady(editor) {
  // 监听 contentchange 事件
  editor.addListener('contentchange', () => {
    console.log('纯文本',editor.getContentTxt())
    console.log('HTML',editor.getContent())
    console.log('完整HTML',editor.getAllHtml())
  })
}

</script>
```

## 图片视频文件上传

### 前端代码参考

```vue
<template>
  <vue-ueditor-wrap
      v-model="content"
      editor-id="editor"
      :config="editorConfig"
      :editorDependencies="deps"
  />
  <div>
    {{content}}
  </div>
</template>

<script setup>
import { ref } from 'vue'

const content = ref('')
const editorConfig = {
  UEDITOR_HOME_URL: '/static/UEditorPlus/',
  UEDITOR_CORS_URL: '/static/UEditorPlus/',
  serverUrl: 'http://localhost:12342/api/ueditor',
  serverHeaders: {
    'Authorization': 'Bearer 2385569970'
  },
  toolbars: [[
    'insertimage',
    'insertvideo',
    'attachment',
  ]]

}
const deps = ['ueditor.config.js', 'ueditor.all.js']

</script>
```

### 后端代码参考

```java
package local.ateng.java.config.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ueditor")
public class UEditorController {

    @RequestMapping
    public void handle(HttpServletRequest request, HttpServletResponse response) throws Exception {
        String action = request.getParameter("action");

        if ("config".equals(action)) {
            writeConfig(request, response);
            return;
        }

        if ("uploadimage".equals(action)) {
            writeJson(response, uploadImage());
            return;
        }

        if ("uploadvideo".equals(action)) {
            writeJson(response, uploadVideo());
            return;
        }

        if ("uploadfile".equals(action)) {
            writeJson(response, uploadFile());
            return;
        }

        writeJson(response, error("unsupported action: " + action));
    }

    private Map<String, Object> uploadFile() {
        Map<String, Object> result = new HashMap<>();
        result.put("state", "SUCCESS");
        result.put("url", "/uploads/demo.pdf");
        result.put("title", "demo.pdf");
        result.put("original", "demo.pdf");
        return result;
    }

    private void writeConfig(HttpServletRequest request, HttpServletResponse response) throws Exception {
        String callback = request.getParameter("callback");
        Map<String, Object> config = config();

        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/javascript");

        String json = toJson(config);

        if (callback != null && !callback.isEmpty()) {
            response.getWriter().write(callback + "(" + json + ");");
        } else {
            response.getWriter().write(json);
        }
    }

    private void writeJson(HttpServletResponse response, Map<String, Object> data) throws Exception {
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json");
        response.getWriter().write(toJson(data));
    }

    private String toJson(Object obj) {
        try {
            return new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }


    /**
     * 编辑器配置（最小 fake 版）
     */
    private Map<String, Object> config() {
        Map<String, Object> config = new HashMap<>();

        /* ---------- 图片 ---------- */
        config.put("imageActionName", "uploadimage");
        config.put("imageFieldName", "upfile");
        config.put("imageMaxSize", 5 * 1024 * 1024);
        config.put("imageAllowFiles", new String[]{
                ".png", ".jpg", ".jpeg", ".gif"
        });
        config.put("imageUrlPrefix", "");
        config.put("imagePathFormat", "/image/{yyyy}{mm}{dd}/{time}{rand:6}");

        /* ---------- 视频 ---------- */
        config.put("videoActionName", "uploadvideo");
        config.put("videoFieldName", "upfile");
        config.put("videoMaxSize", 50 * 1024 * 1024);
        config.put("videoAllowFiles", new String[]{
                ".mp4", ".webm", ".ogg"
        });
        config.put("videoUrlPrefix", "");
        config.put("videoPathFormat", "/video/{yyyy}{mm}{dd}/{time}{rand:6}");

        /* ---------- 文件 ---------- */
        config.put("fileActionName", "uploadfile");
        config.put("fileFieldName", "upfile");
        config.put("fileMaxSize", 20 * 1024 * 1024);
        config.put("fileAllowFiles", new String[]{
                ".pdf", ".doc", ".docx", ".xls", ".xlsx",
                ".zip", ".rar", ".txt"
        });
        config.put("fileUrlPrefix", "");
        config.put("filePathFormat", "/file/{yyyy}{mm}{dd}/{time}{rand:6}");

        return config;
    }

    /**
     * fake 图片上传
     */
    private Map<String, Object> uploadImage() {
        Map<String, Object> result = new HashMap<>();

        result.put("state", "SUCCESS");
        result.put("url", "/uploads/demo.png");
        result.put("title", "demo.png");
        result.put("original", "demo.png");

        return result;
    }

    /**
     * fake 视频上传
     */
    private Map<String, Object> uploadVideo() {
        Map<String, Object> result = new HashMap<>();

        result.put("state", "SUCCESS");
        result.put("url", "/uploads/demo.mp4");
        result.put("title", "demo.mp4");
        result.put("original", "demo.mp4");

        return result;
    }

    private Map<String, Object> error(String msg) {
        Map<String, Object> result = new HashMap<>();
        result.put("state", msg);
        return result;
    }
}
```

## 自定义文件上传

serverUrl 必须配置，不然不允许上传文件

```vue
<script setup>
import { ref } from 'vue'

const content = ref('')

const editorConfig = {
  UEDITOR_HOME_URL: '/static/UEditorPlus/',
  UEDITOR_CORS_URL: '/static/UEditorPlus/',
  serverUrl: 'http://localhost:12342/api/ueditor',
  serverHeaders: {
    'Authorization': 'Bearer 2385569970'
  },
  uploadServiceEnable: true,

  uploadServiceUpload(type, file, callback, option) {
    console.log('自定义上传类型:', type, file, option)

    // live pre-upload progress
    callback.progress(0.2)

    // 自己调用你的 API 上传
    const formData = new FormData()
    formData.append('file', file)

    fetch('http://localhost:12342/api/upload/file', {
      method: 'POST',
      body: formData,
    })
        .then(res => res.json())
        .then(data => {
          // 👇 返回给编辑器成功结构
          callback.success({
            state: 'SUCCESS',
            url: data.url,
            title: data.name,
            original: file.name,
          })
        })
        .catch(err => {
          callback.error('上传失败')
        })
  },
}

const deps = ['ueditor.config.js', 'ueditor.all.js']
</script>

<template>
  <vue-ueditor-wrap
      v-model="content"
      editor-id="editor-upload-service"
      :config="editorConfig"
      :editorDependencies="deps"
      style="height: 400px;"
  />
  <div>
    {{content}}
  </div>
</template>
```

