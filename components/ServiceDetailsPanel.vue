<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue'
import ServiceInfoCard from './ServiceInfoCard.vue'
import ServiceProgressCard from './ServiceProgressCard.vue'
import type { DispatchOrder, OrderRecord } from '@/data/prototypeOrders'

type ServiceStage = 'waiting' | 'pending' | 'serving' | 'completed' | 'cancelled'

interface ServiceInfoRow {
  label: string
  value: string
  tone?: 'default' | 'link'
}

interface ServiceCard {
  title: string
  rows?: ServiceInfoRow[]
  body?: string
  amountLabel?: string
  amount?: string
}

interface Props {
  stage: ServiceStage
  order?: OrderRecord
  dispatch?: DispatchOrder
  cancellation?: { cancelledAt: string; cancelledBy: string; cancelledReason: string }
}

const props = defineProps<Props>()

const emit = defineEmits<{
  stageChange: [stage: ServiceStage]
}>()

const steps: Array<{ key: ServiceStage; label: string }> = [
  { key: 'waiting', label: '待接单' },
  { key: 'pending', label: '待服务' },
  { key: 'serving', label: '服务中' },
  { key: 'completed', label: '已完成' }
]

const progressWidth = computed(() => {
  const activeIndex = props.stage === 'cancelled'
    ? steps.length - 1
    : steps.findIndex((step) => step.key === props.stage)
  return ((activeIndex + 0.5) / steps.length) * 100
})

const bookingRows: ServiceInfoRow[] = [
  { label: '服务项目', value: '陪诊服务' },
  { label: '医院名称', value: '九江市第一人民医院（总院）' },
  { label: '就诊科室', value: '心内科' },
  { label: '预约时间', value: '2025-12-10 08:00:00' },
  { label: '就诊人', value: '钟离  男  0岁' },
  { label: '联系电话', value: '17888888888' },
  { label: '就诊内容', value: '门诊陪同' }
]

const orderRows: ServiceInfoRow[] = [
  { label: '下单时间', value: '2025-12-08 21:12:32' },
  { label: '订单编号', value: '176519955185111001', tone: 'link' }
]

const cards = computed<ServiceCard[]>(() => {
  if (props.order || props.dispatch) {
    const order = props.order
    const dispatch = props.dispatch
    const record = order || dispatch!
    const fallback = '未提供'
    const result: ServiceCard[] = [{ title: '预约信息', rows: [
      { label: '服务项目', value: record.serviceName },
      { label: '医院名称', value: record.hospital },
      { label: '就诊科室', value: record.department || fallback },
      { label: '预约时间', value: record.appointmentAt },
      { label: '就诊人', value: record.patient },
      { label: '联系电话', value: record.phone || fallback },
      { label: '就诊内容', value: order?.visitContent || dispatch?.serviceNeed || fallback }
    ] }]
    if (props.stage !== 'waiting') {
      const rows: ServiceInfoRow[] = [
        { label: '下单时间', value: order?.orderedAt || dispatch?.orderedAt || fallback },
        { label: '订单编号', value: order?.orderNo || dispatch?.orderNo || fallback, tone: order?.orderNo || dispatch?.orderNo ? 'link' : 'default' }
      ]
      if (props.stage === 'cancelled') {
        rows.push(
          { label: '取消方', value: order?.cancelledBy || props.cancellation?.cancelledBy || fallback },
          { label: '取消时间', value: order?.cancelledAt || props.cancellation?.cancelledAt || fallback }
        )
        const reason = order?.cancelledReason || props.cancellation?.cancelledReason
        if (reason?.trim()) rows.push({ label: '取消原因', value: reason })
      }
      result.push({ title: '订单信息', rows })
    }
    result.push({ title: '服务需求', body: record.serviceNeed || fallback })
    if (record.earnings !== undefined && props.stage !== 'cancelled' && order?.status !== 'cancelled') {
      result.push({ title: '收益信息', amountLabel: props.stage === 'completed' ? '订单收益' : '预期收益', amount: record.earnings })
    }
    return result
  }
  if (props.stage === 'waiting') {
    return [
      { title: '预约信息', rows: bookingRows },
      { title: '服务需求', body: '456' },
      { title: '收益信息', amountLabel: '预期收益', amount: '49.50' }
    ]
  }

  const incomeLabel = props.stage === 'completed' ? '订单收益' : '预期收益'
  const result: ServiceCard[] = [
    { title: '预约信息', rows: bookingRows },
    { title: '订单信息', rows: props.stage === 'cancelled'
      ? [...orderRows, { label: '取消方', value: props.cancellation?.cancelledBy || '未提供' }, { label: '取消时间', value: props.cancellation?.cancelledAt || '2026-08-24 09:20' }, ...(props.cancellation?.cancelledReason?.trim() ? [{ label: '取消原因', value: props.cancellation.cancelledReason }] : [])]
      : orderRows },
    { title: '服务需求', body: '456' }
  ]

  if (props.stage !== 'cancelled') {
    result.push({ title: '收益信息', amountLabel: incomeLabel, amount: '49.50' })
  }

  return result
})

const canOpenProgress = computed(() => props.order?.source !== 'dispute' && props.stage !== 'waiting')
const activeTab = shallowRef<'details' | 'progress'>('details')

watch(canOpenProgress, (canOpen) => {
  if (!canOpen) activeTab.value = 'details'
})

function selectStage(stage: ServiceStage) {
  if (props.order?.source === 'dispute' || props.stage === 'cancelled') return
  emit('stageChange', stage)
}

function isStepActive(step: ServiceStage) {
  return props.stage === step || (props.stage === 'cancelled' && step === 'completed')
}

function openProgress() {
  if (canOpenProgress.value) {
    activeTab.value = 'progress'
  }
}
</script>

<template>
  <view class="service-details-panel">
    <view v-if="props.order?.source === 'dispute'" class="service-details-panel__source">订单信息来自争议记录</view>
    <view class="service-details-panel__status">
      <view class="service-details-panel__progress-track" aria-hidden="true">
        <view
          class="service-details-panel__progress-fill"
          :style="{ width: `${progressWidth}%` }"
        />
      </view>

      <view class="service-details-panel__steps" aria-label="服务状态">
        <view
          v-for="step in steps"
          :key="step.key"
          :class="[
            'service-details-panel__step',
            { 'service-details-panel__step--active': isStepActive(step.key) }
          ]"
          :role="props.order?.source === 'dispute' || props.stage === 'cancelled' ? undefined : 'button'"
          :aria-label="`查看${step.label}状态`"
          @tap="selectStage(step.key)"
        >
          <text class="service-details-panel__step-label">{{ step.label }}</text>
        </view>
      </view>
    </view>

    <view v-if="props.stage !== 'waiting'" class="service-details-panel__tabs" aria-label="详情页签">
      <view
        :class="['service-details-panel__tab', { 'service-details-panel__tab--active': activeTab === 'details' }]"
        role="tab"
        :aria-selected="activeTab === 'details'"
        @tap="activeTab = 'details'"
      >
        <text>基本信息</text>
      </view>
      <view
        :class="[
          'service-details-panel__tab',
          { 'service-details-panel__tab--disabled': !canOpenProgress, 'service-details-panel__tab--active': activeTab === 'progress' }
        ]"
        role="tab"
        :aria-selected="activeTab === 'progress'"
        :aria-disabled="!canOpenProgress"
        @tap="openProgress"
      >
        <text>服务进度</text>
      </view>
    </view>

    <view v-if="activeTab === 'details'" class="service-details-panel__cards">
      <view
        v-for="card in cards"
        :key="card.title"
        class="service-details-panel__card"
      >
        <ServiceInfoCard
          :title="card.title"
          :rows="card.rows"
          :body="card.body"
          :amount-label="card.amountLabel"
          :amount="card.amount"
        />
      </view>
    </view>
    <ServiceProgressCard v-else :stage="props.stage" :paid-at="props.stage === 'cancelled' && props.order ? props.order.paidAt || '未提供' : undefined" :accepted-at="props.stage === 'cancelled' && props.order ? props.order.acceptedAt || '未提供' : undefined" :cancelled-at="props.stage === 'cancelled' ? props.order ? props.order.cancelledAt || '未提供' : props.cancellation?.cancelledAt : undefined" />
  </view>
</template>

<style scoped>
.service-details-panel {
  box-sizing: border-box;
  width: 100%;
  padding: 0 24rpx 40rpx;
}

.service-details-panel__source { margin: 20rpx 0 -8rpx; color: #71829a; font-size: 24rpx; line-height: 36rpx; }

.service-details-panel__status {
  box-sizing: border-box;
  margin: 20rpx 0 0;
  padding: 38rpx 28rpx 28rpx;
  border-radius: 28rpx;
  background: linear-gradient(140deg, #66cff8 0%, #4f94f2 100%);
  box-shadow: 0 10rpx 24rpx rgba(47, 119, 162, 0.12);
}


.service-details-panel__progress-track {
  box-sizing: border-box;
  width: 100%;
  margin: 0 auto;
  height: 28rpx;
  overflow: hidden;
  border: 3rpx solid rgba(255, 255, 255, 0.96);
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.82);
}

.service-details-panel__progress-fill {
  height: 100%;
  border-radius: inherit;
  background: #5f9ff0;
  transition: width 0.2s ease;
}

.service-details-panel__steps {
  display: flex;
  align-items: center;
  margin-top: 22rpx;
}

.service-details-panel__step {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  min-height: 56rpx;
  border-radius: 16rpx;
  color: rgba(255, 255, 255, 0.86);
  transition: background-color 0.2s ease, color 0.2s ease;
}

.service-details-panel__step--active {
  color: #ffffff;
  font-weight: 700;
}

.service-details-panel__step-label {
  font-size: 32rpx;
  line-height: 46rpx;
  white-space: nowrap;
}

.service-details-panel__tabs {
  display: flex;
  gap: 20rpx;
  margin: 20rpx 0;
}

.service-details-panel__tab {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  min-height: 96rpx;
  border-radius: 20rpx;
  color: #76808c;
  font-size: 32rpx;
  line-height: 46rpx;
  background: #ffffff;
  box-shadow: 0 8rpx 20rpx rgba(47, 119, 162, 0.06);
}

.service-details-panel__tab--active {
  color: #111827;
  font-weight: 700;
  box-shadow: 0 8rpx 0 #5faaf5, 0 12rpx 24rpx rgba(47, 119, 162, 0.08);
}

.service-details-panel__tab--disabled {
  color: #a9b2bb;
  background: #ffffff;
}

.service-details-panel__cards {
  width: 100%;
}

.service-details-panel__status + .service-details-panel__cards {
  margin-top: 20rpx;
}

.service-details-panel__card:not(:first-child) {
  margin-top: 26rpx;
}
</style>
