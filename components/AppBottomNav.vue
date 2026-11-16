<script setup>
import { computed } from 'vue'

const props = defineProps({
  /**
   * Currently highlighted navigation item key.
   */
  active: {
    type: String,
    default: 'home'
  },
  /**
   * Override the standard five-item navigation mapping when a host app uses
   * different page paths.
   */
  items: {
    type: Array,
    default: () => [
      { key: 'home', label: '首页', path: '/pages/index/index' },
      { key: 'orders', label: '订单', path: '/pages/orders/index' },
      { key: 'assistant', label: '陪诊小助手', path: '/pages/assistant/index' },
      { key: 'messages', label: '消息', path: '/pages/messages/index' },
      { key: 'profile', label: '我的', path: '/pages/profile/index' }
    ]
  },
  /**
   * Keep the navigation bar attached to the viewport.
   */
  fixed: {
    type: Boolean,
    default: true
  },
  activeColor: {
    type: String,
    default: '#3976f6'
  },
  inactiveColor: {
    type: String,
    default: '#8a95a8'
  },
})

const emit = defineEmits(['change', 'navigate', 'navigationError'])

const navStyle = computed(() => ({
  '--app-bottom-nav-active': props.activeColor,
  '--app-bottom-nav-inactive': props.inactiveColor
}))

function itemClass(item) {
  return [
    'app-bottom-nav__item',
    {
      'app-bottom-nav__item--active': item.key === props.active
    }
  ]
}

const icons = {
  home: ['\ue965', '\ue964'],
  orders: ['\ue663', '\ue665'],
  assistant: ['\ue656', '\ue656'],
  messages: ['\ue620', '\ue61e'],
  profile: ['\ue628', '\ue614']
}

function iconFor(item) {
  const pair = icons[item.key]
  return pair ? pair[item.key === props.active ? 1 : 0] : ''
}

function handleTap(item) {
  emit('change', item)

  if (!item.path || item.key === props.active || typeof uni === 'undefined') {
    return
  }

  const options = {
    url: item.path,
    success: () => emit('navigate', item),
    fail: (error) => emit('navigationError', { item, error })
  }

  uni.reLaunch(options)
}
</script>

<template>
  <view
    class="app-bottom-nav"
    :class="{ 'app-bottom-nav--fixed': props.fixed }"
    :style="navStyle"
  >
    <view class="app-bottom-nav__items">
      <view
        v-for="item in props.items"
        :key="item.key"
        :class="itemClass(item)"
        role="button"
        :aria-label="item.label"
        :aria-current="item.key === props.active ? 'page' : undefined"
        hover-class="app-bottom-nav__item--pressed"
        hover-stay-time="70"
        @tap="handleTap(item)"
      >
        <view class="app-bottom-nav__icon-wrap" aria-hidden="true">
          <view v-if="item.key === 'assistant'" class="app-bottom-nav__assistant-icon">
            <image class="app-bottom-nav__assistant-image" src="/static/images/assistant-mascot.png" mode="aspectFill" />
          </view>
          <text v-else class="app-bottom-nav__icon">{{ iconFor(item) }}</text>
        </view>
        <text class="app-bottom-nav__label">{{ item.label }}</text>
      </view>
    </view>
  </view>
</template>

<style>
@import "./bottom-nav-icons.css";
</style>

<style scoped>
.app-bottom-nav {
  box-sizing: border-box;
  width: 100%;
  min-height: 112rpx;
  padding-bottom: env(safe-area-inset-bottom);
  background: #ffffff;
  border-top: 1rpx solid #edf0f5;
  box-shadow: 0 -8rpx 24rpx rgba(31, 55, 88, 0.04);
  z-index: 90;
}

.app-bottom-nav--fixed {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
}

.app-bottom-nav__items {
  display: flex;
  align-items: stretch;
  justify-content: space-around;
  min-height: 112rpx;
}

.app-bottom-nav__item {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--app-bottom-nav-inactive);
  transition: opacity 0.16s ease;
}

.app-bottom-nav__item--active {
  color: var(--app-bottom-nav-active);
}

.app-bottom-nav__item--pressed {
  opacity: 0.62;
}

.app-bottom-nav__icon-wrap {
  position: relative;
  display: flex;
  width: 76rpx;
  height: 56rpx;
  align-items: center;
  justify-content: center;
  margin-bottom: 4rpx;
}

.app-bottom-nav__item--active .app-bottom-nav__icon-wrap::before {
  position: absolute;
  inset: 0;
  border-radius: 28rpx;
  background: currentColor;
  opacity: 0.1;
  content: '';
}

.app-bottom-nav__icon {
  position: relative;
  font-family: 'app-bottom-nav-icons';
  font-size: 50rpx;
  font-weight: normal;
  line-height: 1;
}

.app-bottom-nav__assistant-icon {
  position: relative;
  display: flex;
  width: 56rpx;
  height: 56rpx;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 50%;
}

.app-bottom-nav__assistant-image {
  width: 68rpx;
  height: 68rpx;
  flex: 0 0 68rpx;
}

.app-bottom-nav__label {
  max-width: 140rpx;
  overflow: hidden;
  color: currentColor;
  font-size: 22rpx;
  line-height: 30rpx;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.app-bottom-nav__item--active .app-bottom-nav__label {
  font-weight: 600;
}
</style>
