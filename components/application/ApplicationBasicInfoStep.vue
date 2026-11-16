<script setup lang="ts">
import ApplicationImageUpload from './ApplicationImageUpload.vue'

const name = defineModel<string>('name', { default: '' })
const gender = defineModel<string>('gender', { default: 'male' })
const phone = defineModel<string>('phone', { default: '' })
const currentLocation = defineModel<string>('currentLocation', { default: '' })
const region = defineModel<string>('region', { default: '' })
const portraitPhoto = defineModel<string>('portraitPhoto', { default: '' })

const locations = ['九江市', '南昌市', '赣州市']
const regions = ['浔阳区', '濂溪区', '柴桑区']

function chooseGender(value: string) {
  gender.value = value
}

function chooseValue(values: string[], update: (value: string) => void) {
  uni.showActionSheet({
    itemList: values,
    success: ({ tapIndex }) => update(values[tapIndex])
  })
}

function chooseLocation() {
  chooseValue(locations, (value) => { currentLocation.value = value })
}

function chooseRegion() {
  chooseValue(regions, (value) => { region.value = value })
}

</script>

<template>
  <view class="application-step-card">
    <text class="application-step-card__title">基础信息</text>

    <view class="application-field application-field--photo">
      <text class="application-field__label"><text class="application-field__required">*</text>形象照片</text>
      <ApplicationImageUpload
        v-model="portraitPhoto"
        label="点击上传形象照片"
        placeholder="/static/images/application-upload-photo.png"
        size="portrait"
      />
    </view>

    <view class="application-field">
      <text class="application-field__label"><text class="application-field__required">*</text>姓名</text>
      <input v-model="name" class="application-input" placeholder="请输入姓名" aria-label="姓名" />
    </view>

    <view class="application-field">
      <text class="application-field__label"><text class="application-field__required">*</text>性别</text>
      <view class="application-gender" role="radiogroup" aria-label="性别">
        <view
          class="application-gender__option"
          :class="{ 'application-gender__option--active': gender === 'male' }"
          role="radio"
          aria-label="男"
          :aria-checked="gender === 'male'"
          @tap="chooseGender('male')"
        >男</view>
        <view
          class="application-gender__option"
          :class="{ 'application-gender__option--active': gender === 'female' }"
          role="radio"
          aria-label="女"
          :aria-checked="gender === 'female'"
          @tap="chooseGender('female')"
        >女</view>
      </view>
    </view>

    <view class="application-field">
      <text class="application-field__label"><text class="application-field__required">*</text>手机号</text>
      <input v-model="phone" class="application-input" type="number" maxlength="11" placeholder="请输入手机号" aria-label="手机号" />
    </view>

    <view class="application-field">
      <text class="application-field__label"><text class="application-field__required">*</text>常驻位置</text>
      <view class="application-picker" role="button" aria-label="常驻位置" @tap="chooseLocation">
        <text :class="{ 'application-picker__value': currentLocation }">{{ currentLocation || '请选择常驻位置' }}</text>
        <text class="application-picker__arrow" aria-hidden="true">›</text>
      </view>
    </view>

    <view class="application-field application-field--last">
      <text class="application-field__label"><text class="application-field__required">*</text>所在区域</text>
      <view class="application-picker" role="button" aria-label="所在区域" @tap="chooseRegion">
        <text :class="{ 'application-picker__value': region }">{{ region || '请选择所在区域' }}</text>
        <text class="application-picker__arrow" aria-hidden="true">›</text>
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
  padding-bottom: 12rpx;
  border-bottom: 1rpx solid #e9eef4;
  color: #17233a;
  font-size: 36rpx;
  font-weight: 700;
  line-height: 50rpx;
}

.application-field {
  display: flex;
  box-sizing: border-box;
  min-height: 128rpx;
  align-items: center;
  gap: 18rpx;
  border-bottom: 1rpx solid #edf1f5;
}

.application-field--photo {
  display: block;
  min-height: 0;
  padding: 0;
}

.application-field--photo .application-field__label { margin-top: 8rpx; }

.application-field--last { border-bottom: 0; }

.application-field__label {
  display: flex;
  flex: 0 0 150rpx;
  align-items: center;
  color: #19243a;
  font-size: 30rpx;
  font-weight: 600;
  line-height: 44rpx;
}

.application-field__required {
  margin-right: 8rpx;
  color: #f04e56;
  font-size: 34rpx;
}

.application-input,
.application-picker,
.application-gender {
  flex: 1;
  min-width: 0;
  box-sizing: border-box;
  min-height: 88rpx;
  border-radius: 16rpx;
  background: #f3f6fa;
}

.application-input {
  padding: 0 18rpx;
  color: #1b2944;
  font-size: 31rpx;
}

.application-picker {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18rpx;
  color: #929db0;
  font-size: 30rpx;
}

.application-picker__value { color: #1b2944; }

.application-picker__arrow {
  color: #8290a4;
  font-size: 42rpx;
  line-height: 1;
}

.application-gender {
  display: flex;
  padding: 4rpx;
}

.application-gender__option {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  border-radius: 13rpx;
  color: #2b3341;
  font-size: 31rpx;
}

.application-gender__option--active {
  color: #1766ed;
  background: #dcecff;
  font-weight: 600;
}

@media screen and (max-width: 360px) {
  .application-step-card { margin-right: 14rpx; margin-left: 14rpx; padding-right: 16rpx; padding-left: 16rpx; }
  .application-field { gap: 10rpx; }
  .application-field__label { flex-basis: 130rpx; font-size: 27rpx; }
  .application-input, .application-picker { padding-right: 12rpx; padding-left: 12rpx; font-size: 28rpx; }
}
</style>
