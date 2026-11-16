<script setup lang="ts">
import AppNavigationBar from '@/components/AppNavigationBar.vue'
import { computed, reactive, shallowRef } from 'vue'
import { onBackPress, onLoad } from '@dcloudio/uni-app'
import ApplicationBasicInfoStep from '@/components/application/ApplicationBasicInfoStep.vue'
import ApplicationCredentialsStep from '@/components/application/ApplicationCredentialsStep.vue'
import ApplicationWorkInfoStep from '@/components/application/ApplicationWorkInfoStep.vue'
import { usePrototypeSession } from '@/composables/usePrototypeSession'

type ApplicationStep = 0 | 1 | 2

const step = shallowRef<ApplicationStep>(0)
const form = reactive({
  name: '',
  gender: 'male',
  phone: '',
  currentLocation: '',
  region: '',
  idCard: '',
  portraitPhoto: '',
  identityFront: '',
  identityBack: '',
  attendantCertificate: '',
  otherCertificate: '',
  familiarHospital: '',
  familiarDepartment: '',
  experience: ''
})

const stepLabels = ['基础信息', '资质证书', '从业信息']
const progressWidth = computed(() => ((step.value + 0.5) / stepLabels.length) * 100)
const { certify } = usePrototypeSession()

onLoad((options) => {
  const requestedStep = Number(options?.step)
  if (requestedStep === 1 || requestedStep === 2) {
    step.value = requestedStep
  }
})

onBackPress(() => {
  if (step.value === 0) return false
  goBack()
  return true
})

function selectStep(index: number) {
  if (index >= 0 && index <= 2) step.value = index as ApplicationStep
}

function goBack() {
  if (step.value > 0) {
    step.value = (step.value - 1) as ApplicationStep
  }
}

function handleNavigationBack() {
  if (step.value > 0) {
    goBack()
    return
  }

  uni.navigateBack({
    fail: () => uni.reLaunch({ url: '/pages/index/index' })
  })
}

function goToPreviousStep() {
  if (step.value > 0) step.value = (step.value - 1) as ApplicationStep
}

function goToNextStep() {
  if (step.value < 2) step.value = (step.value + 1) as ApplicationStep
}

function submitApplication() {
  certify()
  uni.showToast({ title: '申请已提交', icon: 'success', duration: 650 })
  setTimeout(() => {
    uni.reLaunch({ url: '/pages/index/index' })
  }, 650)
}
</script>

<template>
  <view class="application-page">
    <AppNavigationBar title="陪诊师申请入驻" :show-back="true" :intercept-back="true" @back="handleNavigationBack" />

    <view class="application-progress">
      <view class="application-progress__track">
        <view class="application-progress__fill" :style="{ width: `${progressWidth}%` }" />
      </view>
      <view class="application-progress__steps" aria-label="申请步骤">
        <view
          v-for="(label, index) in stepLabels"
          :key="label"
          class="application-progress__step"
          :class="{ 'application-progress__step--active': step === index }"
          role="button"
          :aria-current="step === index ? 'step' : undefined"
          @tap="selectStep(index)"
        >{{ label }}</view>
      </view>
    </view>

    <scroll-view class="application-page__scroll" scroll-y>
      <ApplicationBasicInfoStep
        v-if="step === 0"
        v-model:name="form.name"
        v-model:gender="form.gender"
        v-model:phone="form.phone"
        v-model:current-location="form.currentLocation"
        v-model:region="form.region"
        v-model:portrait-photo="form.portraitPhoto"
      />
      <ApplicationCredentialsStep
        v-else-if="step === 1"
        v-model:id-card="form.idCard"
        v-model:identity-front="form.identityFront"
        v-model:identity-back="form.identityBack"
        v-model:attendant-certificate="form.attendantCertificate"
        v-model:other-certificate="form.otherCertificate"
      />
      <ApplicationWorkInfoStep
        v-else
        v-model:hospital="form.familiarHospital"
        v-model:department="form.familiarDepartment"
        v-model:experience="form.experience"
      />
    </scroll-view>

    <view class="application-footer">
      <view v-if="step > 0" class="application-footer__button application-footer__button--secondary" role="button" @tap="goToPreviousStep">
        <text>上一步</text>
      </view>
      <view
        v-if="step < 2"
        class="application-footer__button application-footer__button--primary"
        role="button"
        @tap="goToNextStep"
      >下一步</view>
      <view v-else class="application-footer__button application-footer__button--primary" role="button" @tap="submitApplication">
        <text>提交</text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.application-page {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100vh;
  height: 100dvh;
  min-height: 0;

  overflow: hidden;
  background: linear-gradient(180deg, #ecf7ff 0%, #f7fbff 100%);
}

.application-progress {
  flex: 0 0 auto;
  margin: 28rpx 24rpx 22rpx;
  padding: 36rpx 36rpx 30rpx;
  border-radius: 32rpx;
  background: linear-gradient(118deg, #49b6f5 0%, #407ff1 100%);
  box-shadow: 0 12rpx 28rpx rgba(59, 135, 225, 0.12);
}

.application-progress__track {
  box-sizing: border-box;
  width: 100%;
  height: 32rpx;
  overflow: hidden;
  border: 4rpx solid rgba(255, 255, 255, 0.95);
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.84);
}

.application-progress__fill {
  height: 100%;
  border-radius: inherit;
  background: #378df0;
  transition: width 0.2s ease;
}

.application-progress__steps {
  display: flex;
  margin-top: 24rpx;
}

.application-progress__step {
  display: flex;
  flex: 1;
  min-width: 0;
  align-items: center;
  justify-content: center;
  min-height: 68rpx;
  color: rgba(255, 255, 255, 0.8);
  font-size: 30rpx;
  line-height: 42rpx;
  text-align: center;
}

.application-progress__step--active {
  color: #ffffff;
  font-weight: 700;
}

.application-page__scroll {
  flex: 1;
  min-height: 0;
  width: 100%;
  padding-bottom: calc(124rpx + env(safe-area-inset-bottom));
}

.application-footer {
  position: fixed;
  z-index: 80;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  box-sizing: border-box;
  min-height: 118rpx;
  align-items: center;
  gap: 18rpx;
  padding: 14rpx 30rpx calc(14rpx + env(safe-area-inset-bottom));
  border-radius: 26rpx 26rpx 0 0;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 -8rpx 24rpx rgba(50, 90, 130, 0.06);
}

.application-footer__button {
  display: flex;
  flex: 1;
  min-width: 0;
  min-height: 78rpx;
  align-items: center;
  justify-content: center;
  border-radius: 999rpx;
  font-size: 31rpx;
  font-weight: 600;
}

.application-footer__button--primary {
  color: #ffffff;
  background: linear-gradient(105deg, #438cf5 0%, #276ee8 100%);
}

.application-footer__button--secondary {
  color: #29303b;
  background: #f0f1f3;
}

@media screen and (max-width: 360px) {
  .application-progress { padding-right: 24rpx; padding-left: 24rpx; }
  .application-progress__step { font-size: 27rpx; }
  .application-footer { padding-right: 18rpx; padding-left: 18rpx; }
}
</style>
