<script setup lang="ts">
interface Conversation {
	threadId: string
	title: string
	updateTime: string
}

const props = withDefaults(defineProps<{
	conversations?: readonly Conversation[]
	currentThreadId?: string
	loading?: boolean
	disabled?: boolean
	error?: string
}>(), {
	conversations: () => [],
	currentThreadId: '',
	loading: false,
	disabled: false,
	error: ''
})

const emit = defineEmits<{
	close: []
	create: []
	select: [conversation: Conversation]
	manage: [conversation: Conversation]
	retry: []
}>()

function selectConversation(conversation: Conversation) {
	emit('select', conversation)
	emit('close')
}
</script>

<template>
	<view class="drawer-overlay" @tap="emit('close')">
		<view class="drawer" @tap.stop>
			<view class="drawer-header">
				<view>
					<text class="drawer-title">历史会话</text>
					<text class="drawer-subtitle">继续之前的咨询</text>
				</view>
				<button class="close-button" aria-label="关闭会话列表" hover-class="icon-button--pressed" @tap="emit('close')">×</button>
			</view>

			<button class="new-conversation-button" :disabled="props.disabled" hover-class="new-conversation-button--pressed" @tap="emit('create')">
				<text class="new-conversation-button__plus" aria-hidden="true">＋</text>
				<text>开始新对话</text>
			</button>

			<view v-if="props.loading" class="drawer-state" aria-label="正在加载历史会话">
				<view class="loading-indicator" aria-hidden="true" />
				<text class="empty-description">正在加载...</text>
			</view>
			<view v-else-if="props.error" class="drawer-state">
				<view class="empty-icon empty-icon--error" aria-hidden="true">!</view>
				<text class="empty-title">会话加载失败</text>
				<text class="empty-description">{{ props.error }}</text>
				<button class="retry-button" @tap="emit('retry')">重新加载</button>
			</view>
			<scroll-view v-else-if="props.conversations.length" class="conversation-scroll" scroll-y>
				<view class="conversation-list">
					<view v-for="conversation in props.conversations" :key="conversation.threadId" class="conversation-item" :class="{ 'conversation-item--active': conversation.threadId === props.currentThreadId, 'conversation-item--disabled': props.disabled }" role="button" :aria-label="`打开会话：${conversation.title || '未命名会话'}`" @tap="!props.disabled && selectConversation(conversation)">
						<view class="conversation-icon" aria-hidden="true"><view class="conversation-icon__bubble" /></view>
						<view class="conversation-main">
							<text class="conversation-title">{{ conversation.title || '未命名会话' }}</text>
							<text class="conversation-time">{{ conversation.updateTime.length >= 16 ? conversation.updateTime.slice(5, 16) : conversation.updateTime }}</text>
						</view>
						<button class="manage-button" :disabled="props.disabled" :aria-label="`管理会话：${conversation.title || '未命名会话'}`" @tap.stop="emit('manage', conversation)">···</button>
					</view>
				</view>
			</scroll-view>
			<view v-else class="drawer-state">
				<view class="empty-icon" aria-hidden="true"><view class="history-icon" /></view>
				<text class="empty-title">暂无历史会话</text>
				<text class="empty-description">发送第一条消息后，会话会保存在这里</text>
			</view>

			<view class="drawer-footer">会话仅对当前登录账号可见</view>
		</view>
	</view>
</template>

<style scoped>
.drawer-overlay { position: fixed; z-index: 100; inset: 0; display: flex; background: rgba(10, 24, 45, .48); }
.drawer { display: flex; box-sizing: border-box; width: 86vw; height: 100%; flex-direction: column; padding: calc(28rpx + env(safe-area-inset-top)) 24rpx calc(24rpx + env(safe-area-inset-bottom)); background: #f6f8fb; }
.drawer-header { display: flex; min-height: 88rpx; align-items: center; justify-content: space-between; gap: 24rpx; }
.drawer-title, .drawer-subtitle { display: block; }
.drawer-title { color: #172b4d; font-size: 38rpx; font-weight: 600; line-height: 1.4; }
.drawer-subtitle { margin-top: 4rpx; color: #75869a; font-size: 24rpx; }
.close-button { display: flex; width: 88rpx; height: 88rpx; flex-shrink: 0; align-items: center; justify-content: center; margin: 0; padding: 0; border: 0; border-radius: 22rpx; color: #43546a; background: transparent; font-size: 48rpx; font-weight: 300; line-height: 1; }
.close-button::after, .new-conversation-button::after, .manage-button::after, .retry-button::after { border: 0; }
.icon-button--pressed { background: #e7eef7; }
.new-conversation-button { display: flex; box-sizing: border-box; width: 100%; min-height: 88rpx; align-items: center; justify-content: center; gap: 12rpx; margin: 28rpx 0 22rpx; padding: 0; border: 2rpx solid #b9d6fb; border-radius: 22rpx; color: #1268d6; background: #edf6ff; font-size: 28rpx; font-weight: 500; line-height: 1.4; }
.new-conversation-button--pressed { background: #dfedff; }
.new-conversation-button[disabled] { opacity: .5; }
.new-conversation-button__plus { color: #1677ff; font-size: 36rpx; line-height: 1; }
.drawer-state { display: flex; min-height: 360rpx; flex: 1; flex-direction: column; align-items: center; justify-content: center; gap: 18rpx; text-align: center; }
.loading-indicator { box-sizing: border-box; width: 48rpx; height: 48rpx; border: 4rpx solid #d7e8fd; border-top-color: #1677ff; border-radius: 50%; animation: drawer-spin .8s linear infinite; }
@keyframes drawer-spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .loading-indicator { animation: none; } }
.empty-icon { display: flex; width: 92rpx; height: 92rpx; align-items: center; justify-content: center; border-radius: 28rpx; background: #e8eef6; }
.empty-icon--error { color: #d92d20; background: #fff0ef; font-size: 44rpx; font-weight: 600; }
.history-icon { position: relative; box-sizing: border-box; width: 42rpx; height: 42rpx; border: 4rpx solid #8fa2b8; border-radius: 50%; }
.history-icon::before { position: absolute; top: 7rpx; left: 17rpx; width: 4rpx; height: 13rpx; border-radius: 4rpx; background: #8fa2b8; content: ''; }
.history-icon::after { position: absolute; top: 18rpx; left: 17rpx; width: 11rpx; height: 4rpx; border-radius: 4rpx; background: #8fa2b8; content: ''; }
.empty-title { color: #3f5065; font-size: 28rpx; font-weight: 500; }
.empty-description { max-width: 400rpx; color: #8493a6; font-size: 24rpx; line-height: 1.6; }
.retry-button { min-width: 184rpx; min-height: 80rpx; margin: 10rpx 0 0; padding: 0 28rpx; border: 2rpx solid #b9d6fb; border-radius: 20rpx; color: #1268d6; background: #edf6ff; font-size: 27rpx; line-height: 80rpx; }
.conversation-scroll { min-height: 0; flex: 1; }
.conversation-list { display: flex; flex-direction: column; gap: 12rpx; padding-bottom: 24rpx; }
.conversation-item { display: flex; box-sizing: border-box; min-height: 104rpx; align-items: center; gap: 16rpx; padding: 12rpx 4rpx 12rpx 18rpx; border: 2rpx solid transparent; border-radius: 20rpx; background: #fff; }
.conversation-item--active { border-color: #b7d4f8; background: #eaf4ff; }
.conversation-item--disabled { opacity: .58; }
.conversation-icon { display: flex; width: 64rpx; height: 64rpx; flex-shrink: 0; align-items: center; justify-content: center; border-radius: 18rpx; background: #e8f3ff; }
.conversation-icon__bubble { box-sizing: border-box; width: 32rpx; height: 27rpx; border: 3rpx solid #1677ff; border-radius: 10rpx; }
.conversation-main { min-width: 0; flex: 1; }
.conversation-title { display: block; overflow: hidden; color: #26384d; font-size: 28rpx; font-weight: 500; line-height: 1.45; text-overflow: ellipsis; white-space: nowrap; }
.conversation-time { display: block; margin-top: 6rpx; color: #8291a3; font-size: 22rpx; }
.manage-button { display: flex; width: 80rpx; height: 80rpx; min-width: 80rpx; align-items: center; justify-content: center; margin: 0; padding: 0; color: #63758a; background: transparent; font-size: 36rpx; line-height: 1; }
.drawer-footer { padding-top: 16rpx; color: #8493a6; font-size: 22rpx; line-height: 1.5; text-align: center; }
</style>
