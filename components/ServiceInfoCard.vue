<script setup lang="ts">
type InfoValueTone = 'default' | 'link'

interface ServiceInfoRow {
  label: string
  value: string
  tone?: InfoValueTone
}

interface Props {
  title: string
  rows?: ServiceInfoRow[]
  body?: string
  amountLabel?: string
  amount?: string
}

const props = withDefaults(defineProps<Props>(), {
  rows: () => [],
  body: '',
  amountLabel: '',
  amount: ''
})
</script>

<template>
  <view class="service-info-card">
    <text class="service-info-card__title">{{ props.title }}</text>

    <view v-if="props.rows.length" class="service-info-card__rows">
      <view
        v-for="row in props.rows"
        :key="`${row.label}-${row.value}`"
        class="service-info-card__row"
      >
        <text class="service-info-card__label">{{ row.label }}</text>
        <text
          :class="[
            'service-info-card__value',
            { 'service-info-card__value--link': row.tone === 'link' }
          ]"
        >
          {{ row.value }}
        </text>
      </view>
    </view>

    <view v-if="props.body" class="service-info-card__body">
      <text class="service-info-card__body-text">{{ props.body }}</text>
    </view>

    <view v-if="props.amount" class="service-info-card__row service-info-card__row--income">
      <text class="service-info-card__label">{{ props.amountLabel }}</text>
      <text class="service-info-card__amount">¥ {{ props.amount }}</text>
    </view>
  </view>
</template>

<style scoped>
.service-info-card {
  box-sizing: border-box;
  width: 100%;
  padding: 28rpx 28rpx 22rpx;
  border: 1rpx solid rgba(226, 235, 242, 0.92);
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 10rpx 30rpx rgba(47, 119, 162, 0.07);
}

.service-info-card__title {
  display: block;
  color: #111827;
  font-size: 40rpx;
  font-weight: 700;
  line-height: 56rpx;
  letter-spacing: 0.5rpx;
}

.service-info-card__rows {
  width: 100%;
}

.service-info-card__row {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  min-height: 78rpx;
  padding: 18rpx 0;
  border-top: 1rpx solid #e9eef2;
}

.service-info-card__title + .service-info-card__rows,
.service-info-card__title + .service-info-card__body {
  margin-top: 8rpx;
}

.service-info-card__label,
.service-info-card__value,
.service-info-card__body-text,
.service-info-card__amount {
  color: #1f2937;
}

.service-info-card__label {
  flex: 0 0 27%;
  font-size: 30rpx;
  font-weight: 400;
  line-height: 46rpx;
}

.service-info-card__value {
  flex: 1;
  min-width: 0;
  font-size: 32rpx;
  font-weight: 400;
  line-height: 46rpx;
  text-align: right;
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-all;
}

.service-info-card__value--link {
  color: #2563eb;
}

.service-info-card__body {
  box-sizing: border-box;
  margin-top: 12rpx;
  padding: 20rpx 22rpx;
  border-radius: 16rpx;
  background: #f4f6f8;
}

.service-info-card__body-text {
  display: block;
  font-size: 30rpx;
  line-height: 46rpx;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.service-info-card__row--income {
  margin-top: 8rpx;
}

.service-info-card__amount {
  flex: 1;
  min-width: 0;
  color: #159447;
  font-size: 40rpx;
  font-weight: 700;
  line-height: 52rpx;
  text-align: right;
}
</style>
