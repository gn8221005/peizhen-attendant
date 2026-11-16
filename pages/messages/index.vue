<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import AppNavigationBar from '@/components/AppNavigationBar.vue'
import AppBottomNav from '@/components/AppBottomNav.vue'
import MessageCard from './components/MessageCard.vue'
import MessageFilters from './components/MessageFilters.vue'
import { usePrototypeMessages } from '@/composables/usePrototypeMessages'
import type { MessageFilter, PrototypeMessage } from '@/data/prototypeMessages'

const activeFilter = shallowRef<MessageFilter>('all')
const { messages, unreadCount, unreadByCategory, markRead, markAllRead, refresh } = usePrototypeMessages()

const visibleMessages = computed(() => activeFilter.value === 'all'
  ? messages.value
  : messages.value.filter((message) => message.category === activeFilter.value))
const counts = computed(() => ({ all: unreadCount.value, ...unreadByCategory.value }))

onShow(refresh)

function openMessage(message: PrototypeMessage) {
  markRead(message.id)
  if (!message.actionUrl) return

  const options = {
    url: message.actionUrl,
    fail: () => uni.showToast({ title: '页面暂时无法打开', icon: 'none' as const })
  }
  if (message.actionUrl === '/pages/orders/index' || message.actionUrl === '/pages/index/index') {
    uni.reLaunch(options)
  } else {
    uni.navigateTo(options)
  }
}
</script>

<template>
  <view class="messages-page">
    <AppNavigationBar title="消息" :show-back="false" />

    <MessageFilters :active="activeFilter" :counts="counts" :unread-count="unreadCount" @change="activeFilter = $event" @read-all="markAllRead" />

    <scroll-view class="messages-page__scroll" scroll-y>
      <view class="messages-page__content">
        <view class="messages-page__section-heading">
          <text class="messages-page__section-title">{{ activeFilter === 'all' ? '全部消息' : activeFilter === 'order' ? '订单消息' : activeFilter === 'account' ? '账户消息' : '平台消息' }}</text>
        </view>
        <view v-if="visibleMessages.length" class="messages-page__list">
          <MessageCard v-for="message in visibleMessages" :key="message.id" :message="message" @open="openMessage" />
        </view>
        <view v-else class="messages-empty" aria-label="当前分类暂无消息">
          <view class="messages-empty__icon" aria-hidden="true"><view class="messages-empty__dots" /></view>
          <text class="messages-empty__title">暂无消息</text>
          <text class="messages-empty__description">有新的消息时会在这里通知你</text>
        </view>
      </view>
    </scroll-view>

    <AppBottomNav active="messages" />
  </view>
</template>

<style scoped>
.messages-page {
  display: flex;
  box-sizing: border-box;
  height: 100vh;
  height: 100dvh;
  min-height: 0;
  flex-direction: column;
  overflow: hidden;
  padding-bottom: calc(112rpx + env(safe-area-inset-bottom));
  background: #ffffff;
}
.messages-page__scroll { width: 100%; min-height: 0; flex: 1; }
.messages-page__content { box-sizing: border-box; max-width: 760px; margin: 0 auto; padding: 28rpx 28rpx 40rpx; }
.messages-page__section-heading { display: flex; align-items: center; justify-content: space-between; margin: 0 4rpx 24rpx; }
.messages-page__section-title { color: #5f6b7d; font-size: 29rpx; font-weight: 500; line-height: 42rpx; }
.messages-page__list { display: flex; flex-direction: column; gap: 24rpx; }
.messages-empty { display: flex; min-height: 480rpx; flex-direction: column; align-items: center; justify-content: center; }
.messages-empty__icon { position: relative; box-sizing: border-box; width: 112rpx; height: 88rpx; border: 5rpx solid #a7c4f7; border-radius: 35rpx; background: #f2f7ff; }
.messages-empty__icon::after { position: absolute; bottom: -15rpx; left: 20rpx; width: 24rpx; height: 24rpx; content: ''; border-bottom: 5rpx solid #a7c4f7; border-left: 5rpx solid #a7c4f7; background: #fff; transform: skewY(-32deg); }
.messages-empty__dots { position: absolute; top: 37rpx; left: 26rpx; width: 9rpx; height: 9rpx; border-radius: 50%; background: #7ca7ef; box-shadow: 23rpx 0 #7ca7ef, 46rpx 0 #7ca7ef; }
.messages-empty__title { margin-top: 34rpx; color: #55657a; font-size: 30rpx; font-weight: 600; }
.messages-empty__description { margin-top: 12rpx; color: #8995a6; font-size: 25rpx; }
</style>
