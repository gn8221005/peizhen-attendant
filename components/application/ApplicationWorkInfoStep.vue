<script setup lang="ts">
const hospital = defineModel<string>('hospital', { default: '' })
const department = defineModel<string>('department', { default: '' })
const experience = defineModel<string>('experience', { default: '' })

const hospitals = ['省人民医院', '市一医院', '妇幼保健院']
const departments = ['心内科', '妇产科', '儿科', '骨科', '普通内科']

function chooseValue(values: string[], update: (value: string) => void) {
  uni.showActionSheet({
    itemList: values,
    success: ({ tapIndex }) => update(values[tapIndex])
  })
}

function chooseHospital() {
  chooseValue(hospitals, (value) => { hospital.value = value })
}

function chooseDepartment() {
  chooseValue(departments, (value) => { department.value = value })
}
</script>

<template>
  <view class="application-step-card application-work-step">
    <text class="application-step-card__title">从业信息</text>

    <view class="application-field application-work-step__field">
      <text class="application-field__label"><text class="application-field__required">*</text>熟悉医院</text>
      <view class="application-picker" role="button" aria-label="选择熟悉医院" @tap="chooseHospital">
        <text :class="{ 'application-picker__value': hospital }">{{ hospital || '请选择熟悉医院' }}</text>
        <text class="application-picker__arrow" aria-hidden="true">›</text>
      </view>
    </view>

    <view class="application-field application-work-step__field">
      <text class="application-field__label"><text class="application-field__required">*</text>熟悉科室</text>
      <view class="application-picker" role="button" aria-label="选择熟悉科室" @tap="chooseDepartment">
        <text :class="{ 'application-picker__value': department }">{{ department || '请选择熟悉科室' }}</text>
        <text class="application-picker__arrow" aria-hidden="true">›</text>
      </view>
    </view>

    <view class="application-experience">
      <text class="application-field__label"><text class="application-field__required">*</text>服务经验</text>
      <view class="application-experience__box">
        <textarea
          v-model="experience"
          class="application-experience__input"
          maxlength="500"
          placeholder="请输入服务经验"
          aria-label="服务经验"
        />
        <text class="application-experience__count">{{ experience.length }}/500</text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.application-step-card {
  box-sizing: border-box;
  margin: 20rpx 24rpx 30rpx;
  padding: 28rpx 26rpx 10rpx;
  border: 1rpx solid #dcebf9;
  border-radius: 28rpx;
  background: #ffffff;
  box-shadow: 0 10rpx 26rpx rgba(65, 125, 185, 0.06);
}

.application-step-card__title {
  display: block;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #e9eef4;
  color: #17233a;
  font-size: 36rpx;
  font-weight: 700;
  line-height: 50rpx;
}

.application-work-step__field {
  display: flex;
  min-height: 128rpx;
  align-items: center;
  gap: 18rpx;
  border-bottom: 1rpx solid #edf1f5;
}

.application-field__label {
  display: flex;
  flex: 0 0 176rpx;
  align-items: center;
  color: #19243a;
  font-size: 29rpx;
  font-weight: 600;
  line-height: 44rpx;
}

.application-field__required { margin-right: 7rpx; color: #f04e56; font-size: 34rpx; }

.application-picker {
  display: flex;
  flex: 1;
  min-width: 0;
  min-height: 88rpx;
  box-sizing: border-box;
  align-items: center;
  justify-content: space-between;
  padding: 0 18rpx;
  border-radius: 16rpx;
  color: #929db0;
  background: #f3f6fa;
  font-size: 30rpx;
}

.application-picker__value { color: #1b2944; }
.application-picker__arrow { color: #8290a4; font-size: 42rpx; line-height: 1; }

.application-experience { padding: 30rpx 0 20rpx; }
.application-experience > .application-field__label { margin-bottom: 16rpx; }

.application-experience__box {
  position: relative;
  box-sizing: border-box;
  min-height: 330rpx;
  padding: 18rpx 18rpx 54rpx;
  border-radius: 18rpx;
  background: #f3f6fa;
}

.application-experience__input {
  display: block;
  width: 100%;
  height: 248rpx;
  color: #1b2944;
  font-size: 29rpx;
  line-height: 1.55;
}

.application-experience__count {
  position: absolute;
  right: 20rpx;
  bottom: 14rpx;
  color: #8b97ad;
  font-size: 26rpx;
}

@media screen and (max-width: 360px) {
  .application-step-card { margin-right: 14rpx; margin-left: 14rpx; padding-right: 16rpx; padding-left: 16rpx; }
  .application-work-step__field { gap: 10rpx; }
  .application-field__label { flex-basis: 146rpx; font-size: 26rpx; }
  .application-picker { padding-right: 12rpx; padding-left: 12rpx; font-size: 25rpx; }
}
</style>
