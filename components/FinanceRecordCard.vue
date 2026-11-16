<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: string
  time: string
  amount: string
  tone: 'income' | 'processing' | 'success' | 'failed'
  statusLabel?: string
}>(), { statusLabel: '' })

const iconSources = {
  income: '/static/images/finance-income-wallet.png',
  processing: '/static/images/finance-withdraw-processing.png',
  success: '/static/images/finance-withdraw-success.png',
  failed: '/static/images/finance-withdraw-failed.png'
} as const

const iconSource = iconSources[props.tone]
</script>

<template>
  <view class="finance-record-card" :class="`finance-record-card--${tone}`">
    <image class="finance-record-card__icon" :class="{ 'finance-record-card__icon--income': tone === 'income' }" :src="iconSource" mode="aspectFit" aria-hidden="true" />

    <view class="finance-record-card__copy">
      <view class="finance-record-card__heading">
        <text class="finance-record-card__title">{{ title }}</text>
        <text v-if="tone === 'income' && statusLabel" class="finance-record-card__income-tag">{{ statusLabel }}</text>
      </view>
      <text class="finance-record-card__time">{{ time }}</text>
    </view>

    <view class="finance-record-card__meta">
      <text class="finance-record-card__amount" :class="{ 'finance-record-card__amount--income': tone === 'income' }">
        {{ tone === 'income' ? '+' : '' }}{{ amount }}
      </text>
      <text v-if="tone !== 'income'" class="finance-record-card__status" :class="`finance-record-card__status--${tone}`">
        {{ statusLabel || title }}
      </text>
    </view>
  </view>
</template>

<style scoped>
.finance-record-card {
  display: flex;
  box-sizing: border-box;
  width: 100%;
  min-height: 178rpx;
  align-items: center;
  padding: 26rpx 28rpx;
  border-radius: 28rpx;
  background: #ffffff;
  box-shadow: 0 8rpx 24rpx rgba(24, 42, 70, 0.04);
}

.finance-record-card--income { min-height: 238rpx; box-shadow: none; }

.finance-record-card__icon {
  display: block;
  flex: 0 0 auto;
  width: 84rpx;
  height: 84rpx;
}

.finance-record-card__icon--income { width: 108rpx; height: 108rpx; }

.finance-record-card__copy { display: flex; flex: 1; min-width: 0; flex-direction: column; margin-left: 24rpx; }
.finance-record-card__heading { display: flex; min-width: 0; align-items: center; gap: 14rpx; }
.finance-record-card__title { overflow: hidden; color: #121926; font-size: 31rpx; font-weight: 700; line-height: 44rpx; text-overflow: ellipsis; white-space: nowrap; }
.finance-record-card__income-tag { padding: 4rpx 14rpx; border-radius: 13rpx; color: #35b970; background: #e4f6eb; font-size: 24rpx; line-height: 36rpx; }
.finance-record-card__time { margin-top: 14rpx; color: #858d9b; font-size: 23rpx; line-height: 32rpx; white-space: nowrap; }
.finance-record-card__meta { display: flex; flex: 0 0 auto; flex-direction: column; align-items: flex-end; margin-left: 12rpx; }
.finance-record-card__amount { color: #121926; font-size: 36rpx; font-weight: 700; line-height: 44rpx; }
.finance-record-card__amount--income { color: #ed423b; font-size: 38rpx; font-weight: 500; }
.finance-record-card__status { box-sizing: border-box; min-width: 122rpx; margin-top: 16rpx; padding: 7rpx 14rpx; border-radius: 28rpx; font-size: 23rpx; font-weight: 700; line-height: 28rpx; text-align: center; }
.finance-record-card__status--processing { color: #4780f3; background: #e6eeff; }
.finance-record-card__status--success { color: #27b567; background: #e3f7ea; }
.finance-record-card__status--failed { color: #e05c5c; background: #fde8e8; }

@media screen and (max-width: 360px) {
  .finance-record-card { padding-right: 18rpx; padding-left: 18rpx; }
  .finance-record-card__copy { margin-left: 16rpx; }
  .finance-record-card__time { font-size: 20rpx; }
}
</style>
