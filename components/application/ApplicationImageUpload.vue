<script setup lang="ts">
type UploadSize = 'portrait' | 'compact' | 'certificate'

const props = withDefaults(defineProps<{
  label: string
  placeholder: string
  size?: UploadSize
}>(), {
  size: 'compact'
})

const imagePath = defineModel<string>({ default: '' })

function selectImage() {
  // #ifdef MP-WEIXIN
  uni.chooseMedia({
    count: 1,
    mediaType: ['image'],
    sourceType: ['album', 'camera'],
    sizeType: ['compressed'],
    success: (result) => {
      const selectedPath = result.tempFiles[0]?.tempFilePath
      if (selectedPath) imagePath.value = selectedPath
    }
  })
  // #endif

  // #ifndef MP-WEIXIN
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (result) => {
      const selectedPath = result.tempFilePaths[0]
      if (selectedPath) imagePath.value = selectedPath
    }
  })
  // #endif
}

function previewImage() {
  if (!imagePath.value) return
  uni.previewImage({ current: imagePath.value, urls: [imagePath.value] })
}
</script>

<template>
  <view
    class="application-image-upload"
    :class="`application-image-upload--${props.size}`"
    role="button"
    :aria-label="props.label"
    @tap="selectImage"
  >
    <image
      v-if="imagePath"
      class="application-image-upload__preview"
      :src="imagePath"
      mode="aspectFill"
      aria-label="已选择的图片，点击预览"
      @tap.stop="previewImage"
    />
    <template v-else>
      <image class="application-image-upload__cover" :src="props.placeholder" mode="aspectFit" aria-hidden="true" />
      <text class="application-image-upload__label">{{ props.label }}</text>
    </template>
    <view v-if="imagePath" class="application-image-upload__replace">点击更换</view>
  </view>
</template>

<style scoped>
.application-image-upload {
  position: relative;
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  overflow: hidden;
  border: 2rpx dashed #c9d5e4;
  border-radius: 18rpx;
  color: #8290a8;
  background: #f8fafc;
  font-size: 20rpx;
  text-align: center;
}

.application-image-upload--portrait {
  width: 206rpx;
  height: 186rpx;
  margin: 8rpx 0 18rpx 24rpx;
  font-size: 24rpx;
}

.application-image-upload--compact {
  width: 100%;
  height: 188rpx;
  flex: 0 0 auto;
  padding: 8rpx;
}

.application-image-upload--certificate {
  width: 250rpx;
  height: 188rpx;
}

.application-image-upload__cover {
  display: block;
  width: 100rpx;
  height: 100rpx;
  flex: 0 0 auto;
}

.application-image-upload__label {
  max-width: 100%;
  color: #8290a8;
  font-size: 20rpx;
  line-height: 28rpx;
  white-space: nowrap;
}

.application-image-upload__preview {
  display: block;
  width: 100%;
  height: 100%;
}

.application-image-upload__replace {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 7rpx 0;
  color: #ffffff;
  background: rgba(24, 36, 58, 0.58);
  font-size: 20rpx;
  line-height: 28rpx;
}

@media screen and (max-width: 360px) {
  .application-image-upload--compact { height: 170rpx; }
  .application-image-upload--certificate { width: 220rpx; height: 170rpx; }
  .application-image-upload__cover { width: 90rpx; height: 90rpx; }
  .application-image-upload__label { font-size: 18rpx; }
}
</style>
