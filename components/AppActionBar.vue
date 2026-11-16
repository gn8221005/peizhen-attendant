<script setup lang="ts">
type ActionTone = 'blue' | 'green' | 'secondary'

interface ActionItem {
  key: string
  label: string
  tone: ActionTone
}

const props = defineProps<{
  actions: ActionItem[]
}>()

const emit = defineEmits<{
  action: [key: string]
}>()

function buttonClass(action: ActionItem) {
  return ['app-action-bar__button', `app-action-bar__button--${action.tone}`]
}
</script>

<template>
  <view class="app-action-bar">
    <view
      v-for="action in props.actions"
      :key="action.key"
      :class="buttonClass(action)"
      role="button"
      :aria-label="action.label"
      hover-class="app-action-bar__button--pressed"
      hover-stay-time="70"
      @tap="emit('action', action.key)"
    >
      <text class="app-action-bar__label">{{ action.label }}</text>
    </view>
  </view>
</template>

<style scoped>
.app-action-bar {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 95;
  display: flex;
  box-sizing: border-box;
  min-height: 140rpx;
  gap: 32rpx;
  padding: 20rpx 32rpx calc(20rpx + env(safe-area-inset-bottom));
  background: #ffffff;
  box-shadow: 0 -8rpx 22rpx rgba(38, 105, 141, 0.08);
}

.app-action-bar__button {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  min-width: 0;
  height: 88rpx;
  border-radius: 48rpx;
  transition: opacity 0.16s ease;
}

.app-action-bar__button--blue {
  background: #3d7ffc;
  color: #ffffff;
}

.app-action-bar__button--green {
  background: #58c995;
  color: #ffffff;
}

.app-action-bar__button--secondary {
  background: #f1f1f1;
  color: #252525;
}

.app-action-bar__button--pressed {
  opacity: 0.64;
}

.app-action-bar__label {
  overflow: hidden;
  color: currentColor;
  font-size: 36rpx;
  line-height: 50rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
