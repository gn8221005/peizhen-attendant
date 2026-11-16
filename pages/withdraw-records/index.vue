<script setup lang="ts">
import AppNavigationBar from '@/components/AppNavigationBar.vue'
import { computed, shallowRef } from 'vue'
import FinanceRecordCard from '@/components/FinanceRecordCard.vue'
import { withdrawRecords, type FinanceRecordStatus } from '@/data/financeRecords'

type WithdrawalFilter = 'all' | FinanceRecordStatus

const activeTab = shallowRef<WithdrawalFilter>('all')
const tabs: { key: WithdrawalFilter; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'processing', label: '提现中' },
  { key: 'success', label: '提现成功' },
  { key: 'failed', label: '提现失败' }
]

const visibleRecords = computed(() =>
  activeTab.value === 'all'
    ? withdrawRecords
    : withdrawRecords.filter((record) => record.status === activeTab.value)
)

</script>

<template>
  <view class="withdraw-records-page">
    <AppNavigationBar title="提现记录" :show-back="true" />

    <view class="withdraw-records-tabs" role="tablist" aria-label="提现状态筛选">
      <view
        v-for="tab in tabs"
        :key="tab.key"
        class="withdraw-records-tabs__tab"
        :class="{ 'withdraw-records-tabs__tab--active': activeTab === tab.key }"
        role="tab"
        :aria-selected="activeTab === tab.key"
        @tap="activeTab = tab.key"
      >{{ tab.label }}</view>
    </view>

    <scroll-view class="withdraw-records-page__scroll" scroll-y>
      <view v-if="visibleRecords.length" class="withdraw-records-list">
        <FinanceRecordCard
          v-for="record in visibleRecords"
          :key="record.id"
          :title="record.title"
          :time="record.time"
          :amount="record.amount"
          :tone="record.status"
        />
      </view>
      <view v-else class="withdraw-records-empty">
        <view class="withdraw-records-empty__icon" aria-hidden="true">◷</view>
        <text>暂无提现记录</text>
      </view>
      <view class="withdraw-records-page__bottom-space" />
    </scroll-view>
  </view>
</template>

<style scoped>
.withdraw-records-page {
  display: flex;
  box-sizing: border-box;
  height: 100vh;
  height: 100dvh;
  min-height: 0;
  flex-direction: column;

  overflow: hidden;
  background: #f8f8f8;
}

.withdraw-records-tabs { display: flex; flex: 0 0 auto; align-items: stretch; padding: 0 18rpx; background: #ffffff; }
.withdraw-records-tabs__tab { position: relative; display: flex; flex: 1; min-width: 0; min-height: 92rpx; align-items: center; justify-content: center; color: #252a32; font-size: 25rpx; white-space: nowrap; }
.withdraw-records-tabs__tab--active { font-weight: 700; }
.withdraw-records-tabs__tab--active::after { position: absolute; bottom: 10rpx; left: 50%; width: 48rpx; height: 7rpx; border-radius: 9rpx; content: ''; background: #5b8af1; transform: translateX(-50%); }
.withdraw-records-page__scroll { flex: 1; min-height: 0; width: 100%; }
.withdraw-records-list { display: flex; flex-direction: column; gap: 22rpx; padding: 24rpx 22rpx 0; }
.withdraw-records-empty { display: flex; min-height: 400rpx; align-items: center; justify-content: center; flex-direction: column; gap: 12rpx; color: #a4a9b1; font-size: 28rpx; }
.withdraw-records-empty__icon { display: flex; width: 90rpx; height: 90rpx; align-items: center; justify-content: center; border-radius: 50%; color: #aab2be; background: #eff1f4; font-size: 54rpx; }
.withdraw-records-page__bottom-space { height: 28rpx; }

@media screen and (max-width: 360px) {
  .withdraw-records-tabs { padding-right: 8rpx; padding-left: 8rpx; }
  .withdraw-records-tabs__tab { font-size: 22rpx; }
  .withdraw-records-list { padding-right: 12rpx; padding-left: 12rpx; }
}
</style>
