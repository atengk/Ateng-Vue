<script setup lang="ts">

import '@videojs/html/video/player'
import '@videojs/html/video/skin'
import '@videojs/html/video/skin.css'

</script>

<template>

  <div class="player-wrapper">

    <video-player>

      <video-skin>

        <video
            slot="media"
            preload="metadata"
            autoplay
            muted
            loop
            playsinline
            poster="https://peach.blender.org/wp-content/uploads/title_anouncement.jpg"
        >

          <source
              src="https://stream.mux.com/BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM/highest.mp4"
              type="video/mp4"
          />

        </video>

      </video-skin>

    </video-player>

  </div>

</template>

<style scoped>

.player-wrapper {
  width: 640px;
  aspect-ratio: 16 / 9;
}

video-player {
  width: 100%;
  height: 100%;
  display: block;
}

</style>