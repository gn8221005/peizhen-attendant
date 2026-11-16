<script setup lang="ts">
import AppNavigationBar from '@/components/AppNavigationBar.vue'
import FinanceRecordCard from '@/components/FinanceRecordCard.vue'
import { incomeRecords } from '@/data/financeRecords'
</script>

<template>
  <view class="income-detail-page">
    <AppNavigationBar title="收益明细" :show-back="true" />
    <scroll-view class="income-detail-page__scroll" scroll-y>
      <view class="income-detail-list">
        <view v-for="record in incomeRecords" :key="record.id" class="income-detail-list__row">
          <FinanceRecordCard
            :title="record.title"
            :time="record.time"
            :amount="record.amount"
            :status-label="record.statusLabel"
            tone="income"
          />
        </view>
      </view>
      <view class="income-detail-page__bottom-space" />
    </scroll-view>
  </view>
</template>

<style scoped>
.income-detail-page {
  display: flex;
  box-sizing: border-box;
  height: 100vh;
  height: 100dvh;
  min-height: 0;
  flex-direction: column;

  overflow: hidden;
  background: linear-gradient(180deg, #eaf8f1 0%, #f7f9f8 33%, #fafafa 100%);
}

.income-detail-page__scroll { flex: 1; min-height: 0; width: 100%; }
.income-detail-list { position: relative; box-sizing: border-box; margin: 42rpx 18rpx 18rpx; padding: 0 14rpx; overflow: hidden; border-radius: 28rpx; background: #ffffff; box-shadow: 0 12rpx 30rpx rgba(24, 42, 70, 0.05); }
.income-detail-list__row { position: relative; padding: 0; }
.income-detail-list__row + .income-detail-list__row { border-top: 1rpx solid #eef1ef; }
.income-detail-list :deep(.finance-record-card--income) { padding: 0; }
.income-detail-list__bottom-space { height: 24rpx; }
.income-detail-page__bottom-space { height: 26rpx; }

@media screen and (max-width: 360px) {
  .income-detail-list { margin-right: 12rpx; margin-left: 12rpx; }
}
</style>
