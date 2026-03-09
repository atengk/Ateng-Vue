<template>
  <div class="dashboard">
    <div class="pdf-wrapper" ref="cardRef">
      <div class="profile-card">
        <button class="ignore-in-pdf action-btn" @click="editProfile">编辑</button>

        <div class="user-content">
          <div class="avatar-box">
            <div class="avatar-placeholder"></div>
          </div>
          <div class="details">
            <h3 class="user-name">测试用户</h3>
            <p class="user-job">职位：全栈开发工程师</p>
            <div class="badge-tag">已认证</div>
          </div>
        </div>

        <div class="divider"></div>

        <div class="stats-grid">
          <div class="stat-item">
            <span class="label">项目数</span>
            <span class="value">12</span>
          </div>
          <div class="stat-item">
            <span class="label">贡献值</span>
            <span class="value">856</span>
          </div>
        </div>
      </div>
    </div>

    <div class="controls">
      <button @click="exportCard" class="btn-save">修复版导出</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import dompdf from 'dompdf.js';
import "@/assets/fonts/SourceHanSansSC-Normal-Min-normal.js";

const cardRef = ref<HTMLElement | null>(null);

const editProfile = () => console.log('Edit clicked');

const exportCard = async () => {
  if (!cardRef.value) return;

  const blob = await dompdf(cardRef.value, {
    useCORS: true,
    // 增加内部 padding 修正
    addPageOptions: {
      orientation: 'p',
      unit: 'mm',
      format: 'a4'
    },
    skipNode: (node: HTMLElement) => {
      return node.classList?.contains('ignore-in-pdf');
    },
    fontConfig: {
      fontFamily: "SourceHanSansSC-Normal-Min",
      fontBase64: (window as any).fontBase64,
      fontStyle: "normal",
      fontWeight: 400
    }
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "优化版名片.pdf";
  a.click();
  URL.revokeObjectURL(url);
};
</script>

<style scoped>
/* 关键优化：给导出目标一个干净的上下文 */
.pdf-wrapper {
  padding: 20px; /* 缓冲区域，防止边缘裁剪 */
  background: white;
  display: inline-block;
}

.profile-card {
  width: 380px;
  min-height: 200px;
  /* 尽量使用标准背景色和渐变配合 */
  background-color: #667eea;
  background-image: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 25px;
  border-radius: 12px;
  position: relative;
  overflow: hidden; /* 确保渐变不溢出圆角 */
}

.user-content {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.avatar-placeholder {
  width: 60px;
  height: 60px;
  background: #fff;
  border-radius: 50%;
  margin-right: 20px;
}

.user-name { font-size: 20px; margin: 0 0 5px 0; }
.user-job { font-size: 14px; opacity: 0.9; margin: 0 0 10px 0; }

.badge-tag {
  background: #42b883;
  padding: 2px 8px;
  font-size: 12px;
  border-radius: 4px;
  display: inline-block;
}

.divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.3);
  margin: 15px 0;
}

.stats-grid {
  display: flex;
  justify-content: space-between;
}

.label { display: block; font-size: 12px; opacity: 0.8; }
.value { display: block; font-size: 18px; font-weight: bold; margin-top: 5px; }

.ignore-in-pdf {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
}
</style>