<script setup lang="ts">
import { computed } from 'vue'
import type { PrototypeMessage } from '@/data/prototypeMessages'

const props = defineProps<{ message: PrototypeMessage }>()
const emit = defineEmits<{ open: [message: PrototypeMessage] }>()

const iconKind = computed(() => {
  if (props.message.category === 'account') return 'account'
  if (props.message.category === 'platform') return 'platform'
  if (props.message.title.includes('取消')) return 'cancel'
  if (/提醒|即将|开始|时间/.test(props.message.title)) return 'reminder'
  return 'order'
})
const iconSource = computed(() => `/static/images/message-${iconKind.value}.png`)
const displayTime = computed(() => {
  const value = props.message.time
  return value.startsWith(`${new Date().getFullYear()}-`) ? value.slice(5) : value
})
</script>

<template>
  <view
    class="message-card"
    role="button"
    :aria-label="`${props.message.read ? '已读' : '未读'}，${props.message.title}，${props.message.content}，${props.message.time}`"
    hover-class="message-card--pressed"
    hover-stay-time="70"
    @tap="emit('open', props.message)"
  >
    <view class="message-card__main">
      <image class="message-card__icon" :src="iconSource" mode="aspectFit" aria-hidden="true" />

      <view class="message-card__body">
        <view class="message-card__heading">
          <view class="message-card__title-wrap">
            <text class="message-card__title">{{ props.message.title }}</text>
            <view v-if="!props.message.read" class="message-card__unread" aria-hidden="true" />
          </view>
          <text class="message-card__time">{{ displayTime }}</text>
        </view>
        <text class="message-card__content">{{ props.message.content }}</text>
      </view>
    </view>

    <view v-if="props.message.actionLabel" class="message-card__footer">
      <text>{{ props.message.actionLabel }}</text>
      <view class="message-card__chevron" aria-hidden="true" />
    </view>
  </view>
</template>

<style scoped>
.message-card {
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;
  padding: 36rpx 26rpx 0;
  border: 1rpx solid #edf2f8;
  border-radius: 20rpx;
  background: #ffffff;
  box-shadow: 0 8rpx 26rpx rgba(48, 76, 112, .045);
}
.message-card--pressed { opacity: .75; }
.message-card__main { display: flex; align-items: center; gap: 26rpx; min-height: 118rpx; padding: 0 6rpx 27rpx; }
.message-card__icon {
  display: block;
  width: 104rpx;
  height: 104rpx;
  flex: 0 0 104rpx;
}
.message-card__body { flex: 1; min-width: 0; }
.message-card__heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 12rpx; }
.message-card__title-wrap { display: flex; flex: 1; min-width: 0; align-items: center; gap: 10rpx; }
.message-card__title { color: #18263b; font-size: 31rpx; font-weight: 700; line-height: 46rpx; overflow-wrap: anywhere; }
.message-card__unread { width: 12rpx; height: 12rpx; flex: 0 0 12rpx; border-radius: 50%; background: #4c87f5; }
.message-card__time { flex: 0 0 auto; padding-top: 4rpx; color: #8491a3; font-size: 23rpx; line-height: 36rpx; white-space: nowrap; }
.message-card__content { display: block; margin-top: 10rpx; color: #59697e; font-size: 27rpx; line-height: 43rpx; overflow-wrap: anywhere; }
.message-card__footer {
  display: flex;
  min-height: 78rpx;
  align-items: center;
  justify-content: flex-start;
  gap: 8rpx;
  border-top: 1rpx solid #edf1f5;
  color: #59667b;
  font-size: 26rpx;
  line-height: 38rpx;
}
.message-card__chevron { width: 11rpx; height: 11rpx; border-top: 3rpx solid #68778c; border-right: 3rpx solid #68778c; transform: rotate(45deg); }
@media screen and (max-width: 360px) {
  .message-card { padding-right: 20rpx; padding-left: 20rpx; }
  .message-card__main { gap: 20rpx; }
  .message-card__icon { width: 94rpx; height: 94rpx; flex-basis: 94rpx; }
  .message-card__time { font-size: 11px; }
  .message-card__title { font-size: 15px; }
  .message-card__content { font-size: 14px; line-height: 1.55; }
  .message-card__footer { font-size: 13px; }
}
</style>
