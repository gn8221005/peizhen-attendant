<script setup lang="ts">
import AppNavigationBar from '@/components/AppNavigationBar.vue'
import { computed, shallowRef } from 'vue'
import AppBottomNav from '@/components/AppBottomNav.vue'
import OrderRecordCard from '@/components/OrderRecordCard.vue'
import type { OrderStatus } from '@/data/prototypeOrders'
import { onShow } from '@dcloudio/uni-app'
import { useOrderRecords } from '@/composables/useOrderRecords'

const { orders, refresh } = useOrderRecords()
onShow(refresh)

type OrderFilter = 'all' | OrderStatus

const activeFilter = shallowRef<OrderFilter>('all')
const filters: Array<{ key: OrderFilter; label: string }> = [
  { key: 'all', label: '全部订单' },
  { key: 'pending', label: '待服务' },
  { key: 'serving', label: '服务中' },
  { key: 'completed', label: '已完成' },
  { key: 'cancelled', label: '已取消' }
]

const visibleOrders = computed(() =>
  activeFilter.value === 'all'
    ? orders.value
    : orders.value.filter((order) => order.status === activeFilter.value)
)

function openOrder(id: string) {
  uni.navigateTo({ url: `/pages/service/index?orderId=${encodeURIComponent(id)}` })
}
</script>

<template>
  <view class="orders-page">
    <AppNavigationBar title="订单" :show-back="false" />

    <view class="orders-filter" role="tablist" aria-label="订单状态筛选">
      <view
        v-for="filter in filters"
        :key="filter.key"
        class="orders-filter__item"
        :class="{ 'orders-filter__item--active': activeFilter === filter.key }"
        role="tab"
        :aria-selected="activeFilter === filter.key"
        @tap="activeFilter = filter.key"
      >
        <text>{{ filter.label }}</text>
        <view v-if="activeFilter === filter.key" class="orders-filter__indicator" />
      </view>
    </view>

    <scroll-view class="orders-page__scroll" scroll-y>
      <view v-if="visibleOrders.length" class="orders-page__list">
        <OrderRecordCard
          v-for="order in visibleOrders"
          :key="order.id"
          :order="order"
          @open="openOrder(order.id)"
        />
      </view>
      <view v-else class="orders-empty-state">
        <view class="orders-empty-state__icon" aria-hidden="true">✓</view>
        <text>当前分类暂无订单</text>
      </view>
    </scroll-view>

    <AppBottomNav active="orders" />
  </view>
</template>

<style scoped>
.orders-page {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100vh;
  height: 100dvh;
  min-height: 0;

  padding-bottom: calc(112rpx + env(safe-area-inset-bottom));
  overflow: hidden;
  background: #f5f5f7;
}

.orders-filter {
  display: flex;
  flex: 0 0 94rpx;
  align-items: stretch;
  justify-content: space-around;
  border-bottom: 1rpx solid #e8eaf0;
  background: #ffffff;
}

.orders-filter__item {
  position: relative;
  display: flex;
  flex: 1;
  min-width: 0;
  align-items: center;
  justify-content: center;
  color: #252c37;
  font-size: 27rpx;
  white-space: nowrap;
}

.orders-filter__item--active {
  color: #111827;
  font-weight: 700;
}

.orders-filter__indicator {
  position: absolute;
  bottom: 6rpx;
  left: 50%;
  width: 54rpx;
  height: 8rpx;
  border-radius: 999rpx;
  background: #5b8af1;
  transform: translateX(-50%);
}

.orders-page__scroll {
  flex: 1;
  min-height: 0;
  width: 100%;
}

.orders-page__list {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
  box-sizing: border-box;
  padding: 18rpx 16rpx 28rpx;
}

.orders-empty-state {
  display: flex;
  min-height: 420rpx;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #98a1af;
  font-size: 28rpx;
}

.orders-empty-state__icon {
  display: flex;
  width: 84rpx;
  height: 84rpx;
  align-items: center;
  justify-content: center;
  margin-bottom: 18rpx;
  border-radius: 50%;
  color: #ffffff;
  background: #9cc5b2;
  font-size: 46rpx;
}

@media screen and (max-width: 360px) {
  .orders-filter__item { font-size: 24rpx; }
  .orders-page__list { padding-right: 12rpx; padding-left: 12rpx; }
}
</style>
