<script setup lang="ts">
type MessageFilter = 'all' | 'order' | 'account' | 'platform'

const props = withDefaults(defineProps<{
  active: MessageFilter
  counts?: Partial<Record<MessageFilter, number>>
  unreadCount?: number
}>(), { counts: () => ({}), unreadCount: 0 })

const emit = defineEmits<{ change: [key: MessageFilter]; readAll: [] }>()

const filters: Array<{ key: MessageFilter; label: string }> = [
  { key: 'all', label: '全部' },
  { key: 'order', label: '订单' },
  { key: 'account', label: '账户' },
  { key: 'platform', label: '平台' }
]
</script>

<template>
  <view class="message-filters">
    <view class="message-filters__tabs" role="tablist" aria-label="消息分类">
      <view
        v-for="filter in filters"
        :key="filter.key"
        class="message-filters__item"
        :class="{ 'message-filters__item--active': props.active === filter.key }"
        role="tab"
        :aria-selected="props.active === filter.key"
        :aria-label="`${filter.label}${props.counts[filter.key] ? `，${props.counts[filter.key]}条未读` : ''}`"
        hover-class="message-filters__item--pressed"
        @tap="emit('change', filter.key)"
      >
        <text>{{ filter.label }}</text>
      </view>
    </view>
    <view
      class="message-filters__read-all"
      :class="{ 'message-filters__read-all--disabled': props.unreadCount === 0 }"
      role="button"
      :aria-disabled="props.unreadCount === 0"
      aria-label="全部消息标为已读"
      hover-class="message-filters__read-all--pressed"
      @tap="props.unreadCount > 0 && emit('readAll')"
    >全部已读</view>
  </view>
</template>

<style scoped>
.message-filters {
  display: flex;
  box-sizing: border-box;
  width: 100%;
  max-width: 760px;
  align-items: center;
  gap: 16rpx;
  margin: 0 auto;
  padding: 24rpx 24rpx 0;
  background: #ffffff;
}
.message-filters__tabs {
  display: flex;
  box-sizing: border-box;
  min-width: 0;
  min-height: 76rpx;
  flex: 1;
  align-items: stretch;
  overflow: hidden;
  border-radius: 9999px;
  background: #ffffff;
  box-shadow: inset 0 0 0 1rpx #eaf0f8;
}
.message-filters__item {
  display: flex;
  min-width: 0;
  flex: 1;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  color: #617087;
  font-size: 27rpx;
  font-weight: 500;
  line-height: 40rpx;
  white-space: nowrap;
}
.message-filters__item--active {
  color: #ffffff;
  background: #4e85ef;
}
.message-filters__item--pressed { opacity: .72; }
.message-filters__read-all {
  display: flex;
  box-sizing: border-box;
  min-height: 76rpx;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  padding: 0 12rpx;
  border: 1rpx solid #4e85ef;
  border-radius: 9999px;
  color: #ffffff;
  background: #4e85ef;
  font-size: 25rpx;
  line-height: 36rpx;
  white-space: nowrap;
}
.message-filters__read-all--disabled {
  border-color: #edf0f4;
  color: #a7b1bf;
  background: #f7f8fa;
}
.message-filters__read-all--pressed { opacity: .65; }
@media screen and (max-width: 360px) {
  .message-filters { gap: 10rpx; padding-right: 18rpx; padding-left: 18rpx; }
  .message-filters__item { font-size: 12px; }
  .message-filters__read-all { padding-right: 8rpx; padding-left: 8rpx; font-size: 12px; }
}
</style>
