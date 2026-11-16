<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string]; clear: []; submit: [] }>()
const hasText = computed(() => !!props.modelValue.trim())

function updateInput(event: { detail: { value: string } }) {
  emit('update:modelValue', event.detail.value)
}
</script>

<template>
  <view class="composer">
    <view class="composer__row">
      <textarea
        class="composer__input"
        :value="props.modelValue"
        :maxlength="1000"
        auto-height
        confirm-type="send"
        cursor-spacing="16"
        placeholder="输入你想咨询的问题..."
        placeholder-class="composer__placeholder"
        aria-label="咨询内容"
        @input="updateInput"
        @confirm="emit('submit')"
      />
      <button class="composer__send" :disabled="!hasText" aria-label="发送消息" hover-class="composer__send--pressed" @tap="emit('submit')"><text>发送</text></button>
      <button class="composer__clear" :disabled="!hasText" aria-label="清空当前会话内容" hover-class="composer__clear--pressed" @tap="emit('clear')"><text>清空</text></button>
    </view>
    <text class="composer__tip">AI 生成内容仅供参考，医疗事项请遵医嘱</text>
  </view>
</template>

<style scoped>
.composer {
  flex-shrink: 0;
  padding: 18rpx 24rpx 16rpx;
  border-top: 2rpx solid #e7edf4;
  background-color: rgba(255, 255, 255, 0.98);
  box-shadow: 0 -10rpx 30rpx rgba(23, 43, 77, 0.05);
}

.composer__row { display: flex; align-items: flex-end; gap: 16rpx; }
.composer__input {
  min-width: 0;
  min-height: 88rpx;
  max-height: 220rpx;
  flex: 1;
  box-sizing: border-box;
  padding: 22rpx 24rpx;
  border: 2rpx solid #dce5ef;
  border-radius: 24rpx;
  background-color: #f7f9fc;
  color: #172b4d;
  font-size: 30rpx;
  line-height: 1.5;
}
:deep(.composer__placeholder) { color: #8795a7; }
.composer__send, .composer__clear {
  display: flex;
  width: 112rpx;
  height: 88rpx;
  min-width: 112rpx;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  border-radius: 24rpx;
  font-size: 28rpx;
  font-weight: 600;
  line-height: 88rpx;
}
.composer__send { color: #fff; background: linear-gradient(135deg, #1677ff, #0b62d6); box-shadow: 0 8rpx 20rpx rgba(22, 119, 255, .22); }
.composer__clear { color: #c43226; border: 2rpx solid #efb4ae; background: #fff5f4; }
.composer__send[disabled] { color: #fff; background: #a9c8ee; box-shadow: none; opacity: .72; }
.composer__clear[disabled] { color: #aa8581; border-color: #ead7d5; background: #f7f2f1; opacity: .55; }
.composer__send--pressed { opacity: .82; }
.composer__clear--pressed { background: #fee8e5; }
.composer__send::after, .composer__clear::after { border: 0; }
.composer__tip { display: block; margin-top: 12rpx; color: #78889b; font-size: 22rpx; line-height: 1.4; text-align: center; }
</style>
