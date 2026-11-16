<script setup lang="ts">
import AppNavigationBar from '@/components/AppNavigationBar.vue'
import { computed, shallowRef } from 'vue'

const selectedAmount = shallowRef<number | null>(null)
const quickAmounts = [1, 10, 50, 100, 200, 500]

const selectedAmountLabel = computed(() => (selectedAmount.value ?? 0).toFixed(2))
const feeLabel = computed(() => ((selectedAmount.value ?? 0) * 0.1).toFixed(2))

function selectAmount(amount: number) {
  selectedAmount.value = amount
}

function confirmWithdraw() {
  if (selectedAmount.value === null) {
    uni.showToast({ title: '请选择提现金额', icon: 'none' })
    return
  }

  uni.showModal({
    title: '确认提现',
    content: `提现 ${selectedAmountLabel.value} 元，手续费 ${feeLabel.value} 元，确认提现至微信零钱？`,
    confirmText: '确认提现',
    success: ({ confirm }) => {
      if (confirm) uni.showToast({ title: '提现申请已提交', icon: 'success' })
    }
  })
}

function openWithdrawRecords() {
  uni.navigateTo({ url: '/pages/withdraw-records/index' })
}
</script>

<template>
  <view class="withdraw-page">
    <AppNavigationBar title="提现" :show-back="true" />
    <scroll-view class="withdraw-page__scroll" scroll-y>
      <view class="withdraw-card withdraw-card--amount">
        <text class="withdraw-card__title">提现金额</text>
        <view class="withdraw-amount-display">
          <text class="withdraw-amount-display__currency">¥</text>
          <text class="withdraw-amount-display__value">{{ selectedAmountLabel }}</text>
        </view>

        <view class="withdraw-quick-amounts" aria-label="选择提现金额">
          <view
            v-for="amount in quickAmounts"
            :key="amount"
            class="withdraw-quick-amount"
            :class="{ 'withdraw-quick-amount--selected': selectedAmount === amount }"
            role="radio"
            :aria-checked="selectedAmount === amount"
            :aria-label="`${amount.toFixed(2)}元`"
            @tap="selectAmount(amount)"
          >{{ amount.toFixed(2) }}元</view>
        </view>

        <view class="withdraw-fee-summary">
          <view class="withdraw-fee-summary__row">
            <text>可提现余额</text><text class="withdraw-fee-summary__available">15.20</text>
          </view>
          <view class="withdraw-fee-summary__row">
            <text>实际手续费</text><text class="withdraw-fee-summary__fee">{{ feeLabel }}</text>
          </view>
          <text class="withdraw-fee-summary__hint">ⓘ 手续费率 10%</text>
        </view>
      </view>

      <view class="withdraw-card withdraw-card--method">
        <text class="withdraw-card__title">到账方式</text>
        <view class="withdraw-method">
          <image class="withdraw-method__icon" src="/static/images/withdraw-wechat.png" mode="aspectFit" aria-hidden="true" />
          <view class="withdraw-method__copy">
            <text class="withdraw-method__title">提现至微信</text>
            <text class="withdraw-method__description">提现至微信零钱</text>
          </view>
          <view class="withdraw-method__selected" aria-hidden="true">✓</view>
        </view>
      </view>

      <view class="withdraw-actions">
        <view class="withdraw-confirm" role="button" aria-label="确认提现" @tap="confirmWithdraw">确认提现</view>
        <view class="withdraw-records-link" role="button" @tap="openWithdrawRecords">提现记录</view>
      </view>
      <view class="withdraw-page__bottom-space" />
    </scroll-view>
  </view>
</template>

<style scoped>
.withdraw-page {
  display: flex;
  box-sizing: border-box;
  height: 100vh;
  height: 100dvh;
  min-height: 0;
  flex-direction: column;

  overflow: hidden;
  background: #f5f5f5;
}

.withdraw-page__scroll { flex: 1; min-height: 0; width: 100%; }
.withdraw-card { box-sizing: border-box; margin: 18rpx 18rpx; padding: 30rpx 32rpx; border-radius: 24rpx; background: #ffffff; }
.withdraw-card__title { display: block; color: #171c25; font-size: 34rpx; font-weight: 700; line-height: 48rpx; }
.withdraw-amount-display { display: flex; min-height: 174rpx; align-items: center; justify-content: center; color: #333333; }
.withdraw-amount-display__currency { margin: 12rpx 12rpx 0 0; color: #666666; font-size: 38rpx; font-weight: 700; }
.withdraw-amount-display__value { font-size: 72rpx; font-weight: 700; line-height: 1.2; }

.withdraw-quick-amounts { display: flex; flex-wrap: wrap; gap: 18rpx; }
.withdraw-quick-amount {
  display: flex;
  box-sizing: border-box;
  width: calc((100% - 36rpx) / 3);
  min-height: 88rpx;
  align-items: center;
  justify-content: center;
  border: 3rpx solid #dedede;
  border-radius: 16rpx;
  color: #626a72;
  background: #ffffff;
  font-size: 27rpx;
}

.withdraw-quick-amount--selected { border-color: #5caf60; color: #299950; background: #f2fbf3; }
.withdraw-fee-summary { margin-top: 30rpx; padding: 20rpx 24rpx; border-radius: 20rpx; color: #606974; background: linear-gradient(115deg, #f7f8f9, #eef0f1); }
.withdraw-fee-summary__row { display: flex; min-height: 60rpx; align-items: center; justify-content: space-between; font-size: 27rpx; }
.withdraw-fee-summary__available { color: #5caf60; font-size: 37rpx; font-weight: 700; }
.withdraw-fee-summary__fee { color: #f5a129; font-size: 32rpx; font-weight: 700; }
.withdraw-fee-summary__hint { display: block; margin-top: 12rpx; color: #9aa1a8; font-size: 24rpx; }

.withdraw-card--method { margin-top: 30rpx; }
.withdraw-method { display: flex; box-sizing: border-box; min-height: 144rpx; align-items: center; gap: 18rpx; margin-top: 22rpx; padding: 18rpx 20rpx; border: 3rpx solid #67af60; border-radius: 22rpx; background: #fafffa; }
.withdraw-method__icon { display: block; flex: 0 0 auto; width: 76rpx; height: 76rpx; }
.withdraw-method__copy { display: flex; flex: 1; min-width: 0; flex-direction: column; gap: 6rpx; }
.withdraw-method__title { color: #20242b; font-size: 30rpx; font-weight: 700; }
.withdraw-method__description { color: #69717b; font-size: 25rpx; }
.withdraw-method__selected { display: flex; width: 34rpx; height: 34rpx; align-items: center; justify-content: center; border-radius: 50%; color: #ffffff; background: #59b96f; font-size: 22rpx; }

.withdraw-actions { padding: 18rpx 46rpx 0; }
.withdraw-confirm { display: flex; min-height: 84rpx; align-items: center; justify-content: center; border-radius: 999rpx; color: #ffffff; background: linear-gradient(105deg, #68cba4, #5bc998); font-size: 32rpx; font-weight: 600; }
.withdraw-records-link { padding: 28rpx 0 8rpx; color: #89929e; font-size: 28rpx; text-align: center; }
.withdraw-page__bottom-space { height: 24rpx; }

@media screen and (max-width: 360px) {
  .withdraw-card { margin-right: 12rpx; margin-left: 12rpx; padding-right: 22rpx; padding-left: 22rpx; }
  .withdraw-quick-amount { font-size: 24rpx; }
  .withdraw-actions { padding-right: 28rpx; padding-left: 28rpx; }
}
</style>
