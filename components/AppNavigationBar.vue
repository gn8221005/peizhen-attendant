<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: string
  showBack?: boolean
  interceptBack?: boolean
}>(), {
  showBack: false,
  interceptBack: false
})

const emit = defineEmits<{
  back: []
}>()

function handleBack() {
  if (props.interceptBack) {
    emit('back')
    return
  }

  uni.navigateBack({
    delta: 1,
    fail: () => uni.reLaunch({ url: '/pages/index/index' })
  })
}
</script>

<template>
  <view class="app-navigation-bar">
    <view class="app-navigation-bar__status" aria-hidden="true" />
    <view class="app-navigation-bar__row">
      <view
        v-if="props.showBack"
        class="app-navigation-bar__back"
        role="button"
        aria-label="返回"
        @tap="handleBack"
      >
        <view class="app-navigation-bar__back-icon" aria-hidden="true" />
      </view>
      <text class="app-navigation-bar__title">{{ props.title }}</text>
    </view>
  </view>
</template>

<style scoped>
.app-navigation-bar {
  position: relative;
  z-index: 20;
  box-sizing: border-box;
  flex: 0 0 auto;
  background: #ffffff;
}

.app-navigation-bar__status {
  height: var(--status-bar-height, 0px);
}

.app-navigation-bar__row {
  position: relative;
  display: flex;
  box-sizing: border-box;
  height: 88rpx;
  align-items: center;
  justify-content: center;
}

.app-navigation-bar__title {
  position: absolute;
  left: 50%;
  max-width: calc(100% - 220rpx);
  overflow: hidden;
  color: #111827;
  font-size: 34rpx;
  font-weight: 600;
  line-height: 48rpx;
  text-align: center;
  text-overflow: ellipsis;
  transform: translateX(-50%);
  white-space: nowrap;
}

.app-navigation-bar__back {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 24rpx;
  display: flex;
  width: 72rpx;
  align-items: center;
  justify-content: flex-start;
}

.app-navigation-bar__back-icon {
  box-sizing: border-box;
  width: 20rpx;
  height: 20rpx;
  border-bottom: 4rpx solid #202a39;
  border-left: 4rpx solid #202a39;
  transform: rotate(45deg);
}
</style>
