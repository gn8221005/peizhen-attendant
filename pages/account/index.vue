<script setup lang="ts">
import AppNavigationBar from '@/components/AppNavigationBar.vue'

const metrics = [
  { label: '收益', amount: '29.50', kind: 'income', icon: '/static/images/account-metric-income.png' },
  { label: '可提现', amount: '15.20', kind: 'available', icon: '/static/images/account-metric-available.png' },
  { label: '已提现', amount: '0.00', kind: 'withdrawn', icon: '/static/images/account-metric-withdrawn.png' },
  { label: '提现中', amount: '0.00', kind: 'processing', icon: '/static/images/account-metric-processing.png' }
]

function openIncomeDetail() {
  uni.navigateTo({ url: '/pages/income-detail/index' })
}

function openWithdraw() {
  uni.navigateTo({ url: '/pages/withdraw/index' })
}
</script>

<template>
  <view class="account-page">
    <AppNavigationBar title="我的账户" :show-back="true" />

    <scroll-view class="account-page__scroll" scroll-y>
      <view class="account-card">
        <view class="account-card__hero">
          <view class="account-card__heading">
            <text class="account-card__title">收益信息</text>
            <view class="account-card__detail-link" role="button" aria-label="查看收益明细" @tap="openIncomeDetail">
              <text>收益明细</text><view class="account-card__chevron" aria-hidden="true" />
            </view>
          </view>
          <image class="account-art" src="/static/images/account-wallet.png" mode="aspectFit" aria-hidden="true" />
        </view>

        <view class="account-summary">
          <view
            v-for="(metric, index) in metrics"
            :key="metric.kind"
            class="account-metric"
            :class="[`account-metric--${metric.kind}`, { 'account-metric--right': index % 2 === 1, 'account-metric--bottom': index > 1 }]"
          >
            <image class="account-metric__icon" :src="metric.icon" mode="aspectFit" aria-hidden="true" />
            <view class="account-metric__copy">
              <text class="account-metric__label">{{ metric.label }}</text>
              <text class="account-metric__amount">{{ metric.amount }}</text>
            </view>
          </view>

          <view class="account-summary__actions">
            <view class="account-withdraw-button" role="button" aria-label="提现" @tap="openWithdraw">提现</view>
            <view class="account-security">
              <image class="account-security__shield" src="/static/images/account-security-shield.png" mode="aspectFit" aria-hidden="true" />
              <text>资金安全保障中</text>
            </view>
          </view>
        </view>
      </view>
      <view class="account-page__bottom-space" />
    </scroll-view>
  </view>
</template>

<style scoped>
.account-page {
  display: flex;
  box-sizing: border-box;
  height: 100vh;
  height: 100dvh;
  min-height: 0;
  flex-direction: column;

  overflow: hidden;
  background: #f4f6f5;
}

.account-page__scroll { flex: 1; min-height: 0; width: 100%; }
.account-card { box-sizing: border-box; margin: 42rpx 16rpx; padding: 0; border-radius: 32rpx; background: #fafffc; box-shadow: 0 14rpx 36rpx rgba(36, 59, 48, 0.1); }
.account-card__hero { position: relative; height: 440rpx; padding: 38rpx 22rpx 0; overflow: hidden; border-radius: 28rpx 28rpx 0 0; background: linear-gradient(140deg, #f6fbf6 0%, #edf8f2 100%); }
.account-card__heading { position: relative; z-index: 2; display: flex; align-items: center; justify-content: space-between; }
.account-card__title { color: #20242b; font-size: 38rpx; font-weight: 700; }
.account-card__detail-link { display: flex; align-items: center; color: #81878a; font-size: 28rpx; }
.account-card__chevron { box-sizing: border-box; width: 12rpx; height: 12rpx; margin-left: 10rpx; border-top: 2rpx solid currentColor; border-right: 2rpx solid currentColor; transform: rotate(45deg); }

.account-art { position: absolute; top: 106rpx; right: 20rpx; width: 420rpx; height: 300rpx; }

.account-summary { position: relative; z-index: 3; display: flex; flex-wrap: wrap; margin: -50rpx 20rpx 0; padding: 24rpx 18rpx 8rpx; border-radius: 30rpx; background: #ffffff; }
.account-metric { display: flex; box-sizing: border-box; width: 50%; min-height: 202rpx; align-items: center; gap: 20rpx; padding: 22rpx 12rpx; border-bottom: 1rpx solid #f0f2f3; }
.account-metric--right { border-left: 1rpx solid #f0f2f3; padding-left: 26rpx; }
.account-metric--bottom { border-bottom: 0; }
.account-metric__icon { display: block; flex: 0 0 auto; width: 112rpx; height: 112rpx; }
.account-metric__copy { display: flex; min-width: 0; flex-direction: column; }
.account-metric__label { color: #3c424a; font-size: 27rpx; line-height: 38rpx; white-space: nowrap; }
.account-metric__amount { margin-top: 8rpx; color: #20242b; font-size: 38rpx; font-weight: 700; line-height: 48rpx; white-space: nowrap; }
.account-summary__actions { width: 100%; padding: 30rpx 12rpx 8rpx; }
.account-withdraw-button { display: flex; min-height: 96rpx; align-items: center; justify-content: center; border-radius: 999rpx; color: #ffffff; background: linear-gradient(105deg, #27b66f 0%, #20b87b 100%); font-size: 34rpx; font-weight: 600; }
.account-security { display: flex; align-items: center; justify-content: center; gap: 12rpx; margin-top: 25rpx; color: #858b91; font-size: 25rpx; }
.account-security__shield { display: block; flex: 0 0 auto; width: 34rpx; height: 40rpx; }
.account-page__bottom-space { height: 20rpx; }

@media screen and (max-width: 360px) {
  .account-card { margin-right: 12rpx; margin-left: 12rpx; }
  .account-summary { margin-right: 12rpx; margin-left: 12rpx; }
  .account-card__hero { padding-right: 14rpx; padding-left: 14rpx; }
  .account-art { right: 8rpx; }
  .account-metric { gap: 12rpx; padding-right: 6rpx; padding-left: 6rpx; }
  .account-metric--right { padding-left: 14rpx; }
  .account-metric__icon { width: 94rpx; height: 94rpx; }
  .account-metric__amount { font-size: 34rpx; }
}
</style>
