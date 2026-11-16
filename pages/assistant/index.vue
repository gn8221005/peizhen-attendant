<script setup lang="ts">
import AppNavigationBar from '@/components/AppNavigationBar.vue'
import AppBottomNav from '@/components/AppBottomNav.vue'
import AssistantComposer from './components/AssistantComposer.vue'
import AssistantConversationDrawer from './components/AssistantConversationDrawer.vue'
import AssistantMessageList from './components/AssistantMessageList.vue'
import { shallowRef } from 'vue'

const drawerVisible = shallowRef(false)
const inputText = shallowRef('')

function startNewConversation() {
	inputText.value = ''
	drawerVisible.value = false
}

function showSendTip() {
	if (inputText.value.trim()) uni.showToast({ title: '消息发送功能尚未接入', icon: 'none' })
}
</script>

<template>
	<view class="assistant-page">
		<AppNavigationBar title="陪诊小助手" :show-back="false" />
		<view class="assistant-toolbar">
			<button class="toolbar-button" aria-label="打开历史会话" :aria-expanded="drawerVisible" hover-class="toolbar-button--pressed" @tap="drawerVisible = true">
				<view class="toolbar-history" aria-hidden="true" />
				<text>会话</text>
			</button>
			<view class="toolbar-title">
				<text class="toolbar-title__text">新对话</text>
				<view class="online-status"><view class="online-status__dot" /><text>在线</text></view>
			</view>
			<button class="toolbar-button" aria-label="开始新对话" hover-class="toolbar-button--pressed" @tap="startNewConversation">
				<view class="toolbar-add" aria-hidden="true">＋</view>
				<text>新对话</text>
			</button>
		</view>
		<view class="message-panel"><AssistantMessageList @suggestion="inputText = $event" /></view>
		<AssistantComposer v-model="inputText" @clear="inputText = ''" @submit="showSendTip" />
		<AppBottomNav active="assistant" />
		<AssistantConversationDrawer v-if="drawerVisible" @close="drawerVisible = false" @create="startNewConversation" />
	</view>
</template>

<style scoped>
.assistant-page { display: flex; box-sizing: border-box; height: 100vh; height: 100dvh; min-height: 0; flex-direction: column; overflow: hidden; padding-bottom: calc(112rpx + env(safe-area-inset-bottom)); background: radial-gradient(circle at 100% 0, rgba(74, 210, 196, .11), transparent 42%), #f4f7fb; }
.assistant-toolbar { display: grid; box-sizing: border-box; min-height: 108rpx; flex-shrink: 0; grid-template-columns: 150rpx minmax(0, 1fr) 150rpx; align-items: center; gap: 10rpx; padding: 14rpx 20rpx; border-bottom: 2rpx solid #e4eaf2; background: rgba(255, 255, 255, .96); }
.toolbar-button { display: flex; width: 100%; min-height: 80rpx; align-items: center; justify-content: center; gap: 8rpx; margin: 0; padding: 0; border: 0; border-radius: 20rpx; color: #33506f; background: transparent; font-size: 25rpx; line-height: 1.4; }
.toolbar-button::after { border: 0; }
.toolbar-button--pressed { background: #edf3fa; }
.toolbar-history { position: relative; box-sizing: border-box; width: 32rpx; height: 32rpx; border: 3rpx solid #33506f; border-radius: 50%; }
.toolbar-history::after { position: absolute; top: 6rpx; left: 12rpx; width: 7rpx; height: 9rpx; border-bottom: 2rpx solid #33506f; border-left: 2rpx solid #33506f; content: ''; }
.toolbar-add { display: flex; box-sizing: border-box; width: 32rpx; height: 32rpx; align-items: center; justify-content: center; border: 3rpx solid #33506f; border-radius: 50%; font-size: 26rpx; line-height: 1; }
.toolbar-title { display: flex; min-width: 0; flex-direction: column; align-items: center; }
.toolbar-title__text { max-width: 100%; overflow: hidden; color: #172b4d; font-size: 29rpx; font-weight: 600; line-height: 1.4; text-overflow: ellipsis; white-space: nowrap; }
.online-status { display: flex; align-items: center; gap: 8rpx; margin-top: 4rpx; color: #5f7185; font-size: 21rpx; }
.online-status__dot { width: 12rpx; height: 12rpx; border-radius: 50%; background: #20a872; box-shadow: 0 0 0 5rpx rgba(32, 168, 114, .1); }
.message-panel { min-height: 0; flex: 1; }
@media screen and (min-width: 768px) { .message-panel { width: 760px; max-width: 100%; align-self: center; } }
</style>
