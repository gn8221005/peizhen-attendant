<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue'

const props = defineProps<{ visible: boolean }>()
const emit = defineEmits<{
  close: []
  confirm: [reason: string]
}>()

const options = ['时间冲突', '无法按时到达', '身体原因', '其他原因'] as const
const selected = shallowRef<(typeof options)[number] | ''>('')
const otherReason = shallowRef('')
const reason = computed(() => selected.value === '其他原因' ? otherReason.value.trim() : selected.value)

watch(() => props.visible, (visible) => {
  if (visible) {
    selected.value = ''
    otherReason.value = ''
  }
})

function confirm() {
  if (reason.value) emit('confirm', reason.value)
}
</script>

<template>
  <view v-if="props.visible" class="cancel-order-overlay" @tap="emit('close')">
    <view class="cancel-order-dialog" role="dialog" aria-modal="true" aria-label="取消订单" @tap.stop>
      <text class="cancel-order-dialog__title">取消订单</text>
      <text class="cancel-order-dialog__subtitle">请选择取消原因</text>

      <view class="cancel-order-dialog__options" role="radiogroup" aria-label="取消原因">
        <view
          v-for="option in options"
          :key="option"
          class="cancel-order-dialog__option"
          role="radio"
          :aria-checked="selected === option"
          @tap="selected = option"
        >
          <view :class="['cancel-order-dialog__radio', { 'cancel-order-dialog__radio--selected': selected === option }]" aria-hidden="true">
            <view v-if="selected === option" class="cancel-order-dialog__radio-dot" />
          </view>
          <text class="cancel-order-dialog__option-label">{{ option }}</text>
        </view>
      </view>

      <input
        v-if="selected === '其他原因'"
        v-model="otherReason"
        class="cancel-order-dialog__input"
        type="text"
        maxlength="100"
        placeholder="请输入取消原因"
        placeholder-class="cancel-order-dialog__placeholder"
        aria-label="请输入取消原因"
      />

      <view class="cancel-order-dialog__actions">
        <button class="cancel-order-dialog__button cancel-order-dialog__button--secondary" @tap="emit('close')">暂不取消</button>
        <button
          class="cancel-order-dialog__button cancel-order-dialog__button--confirm"
          :disabled="!reason"
          @tap="confirm"
        >确认取消</button>
      </view>
    </view>
  </view>
</template>

<style scoped>
.cancel-order-overlay {
  position: fixed;
  z-index: 200;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 32rpx;
  background: rgba(18, 29, 43, 0.58);
}
.cancel-order-dialog {
  box-sizing: border-box;
  width: 100%;
  max-width: 620rpx;
  max-height: calc(100vh - 64rpx);
  overflow-y: auto;
  padding: 36rpx 28rpx 30rpx;
  border-radius: 28rpx;
  background: #fff;
  box-shadow: 0 20rpx 60rpx rgba(18, 29, 43, 0.2);
}
.cancel-order-dialog__title { display: block; color: #111827; font-size: 40rpx; font-weight: 700; line-height: 56rpx; text-align: center; }
.cancel-order-dialog__subtitle { display: block; margin-top: 10rpx; color: #7c8795; font-size: 29rpx; line-height: 42rpx; text-align: center; }
.cancel-order-dialog__options { margin-top: 20rpx; }
.cancel-order-dialog__option { display: flex; align-items: center; box-sizing: border-box; min-height: 76rpx; padding: 10rpx 8rpx; border-bottom: 1rpx solid #edf0f3; }
.cancel-order-dialog__option:last-child { border-bottom: 0; }
.cancel-order-dialog__radio { display: flex; flex: 0 0 36rpx; align-items: center; justify-content: center; box-sizing: border-box; width: 36rpx; height: 36rpx; border: 2rpx solid #aab2be; border-radius: 50%; background: #fff; }
.cancel-order-dialog__radio--selected { border-color: #307bf5; }
.cancel-order-dialog__radio-dot { width: 22rpx; height: 22rpx; border-radius: 50%; background: #307bf5; }
.cancel-order-dialog__option-label { margin-left: 24rpx; color: #172033; font-size: 31rpx; line-height: 44rpx; }
.cancel-order-dialog__input { box-sizing: border-box; width: 100%; height: 76rpx; margin-top: 8rpx; padding: 0 20rpx; border: 2rpx solid #dce2ea; border-radius: 14rpx; color: #172033; font-size: 29rpx; background: #fff; }
.cancel-order-dialog__placeholder { color: #a6b0bf; }
.cancel-order-dialog__actions { display: flex; gap: 20rpx; margin-top: 32rpx; }
.cancel-order-dialog__button { display: flex; flex: 1; align-items: center; justify-content: center; box-sizing: border-box; min-width: 0; height: 78rpx; margin: 0; padding: 0 12rpx; border: 0; border-radius: 999rpx; font-size: 30rpx; line-height: 42rpx; }
.cancel-order-dialog__button::after { border: 0; }
.cancel-order-dialog__button--secondary { color: #252525; background: #f1f1f1; }
.cancel-order-dialog__button--confirm { color: #fff; background: #58c995; }
.cancel-order-dialog__button--confirm[disabled] { color: #fff; background: #a9dfc7; }
</style>
