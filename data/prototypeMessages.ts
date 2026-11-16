export type MessageCategory = 'order' | 'account' | 'platform'
export type MessageFilter = 'all' | MessageCategory

export interface PrototypeMessage {
	id: string
	category: MessageCategory
	title: string
	content: string
	time: string
	actionLabel: string
	actionUrl: string
	isDemo: true
	read: boolean
}

// 展示用的静态示例，不代表真实订单、资金或审核结果。
export const prototypeMessages: PrototypeMessage[] = [
	{
		id: 'demo-order-accepted', category: 'order', title: '抢单成功',
		content: '您已成功接取一笔陪诊服务，请及时查看预约信息并做好服务准备。',
		time: '2026-09-26 10:30', actionLabel: '查看订单', actionUrl: '/pages/orders/index', isDemo: true, read: false
	},
	{
		id: 'demo-order-reminder', category: 'order', title: '服务即将开始',
		content: '您有一笔陪诊服务即将开始，请提前确认预约时间和医院地点。',
		time: '2026-09-26 09:00', actionLabel: '查看订单', actionUrl: '/pages/orders/index', isDemo: true, read: false
	},
	{
		id: 'demo-order-cancelled', category: 'order', title: '订单已取消',
		content: '一笔陪诊服务订单已取消，具体情况请以订单详情为准。',
		time: '2026-09-25 16:20', actionLabel: '查看订单', actionUrl: '/pages/orders/index', isDemo: true, read: false
	},
	{
		id: 'demo-withdraw-review', category: 'account', title: '提现审核通过',
		content: '您的提现申请已通过审核，正在处理中，请留意到账情况。',
		time: '2026-09-25 14:30', actionLabel: '查看提现记录', actionUrl: '/pages/withdraw-records/index', isDemo: true, read: false
	},
	{
		id: 'demo-withdraw-success', category: 'account', title: '提现成功',
		content: '一笔提现申请已处理完成，请查看提现记录及收款账户。',
		time: '2026-09-24 15:40', actionLabel: '查看提现记录', actionUrl: '/pages/withdraw-records/index', isDemo: true, read: true
	},
	{
		id: 'demo-dispute-pending', category: 'platform', title: '争议待回应',
		content: '您有一条服务争议待处理，请查看详情，并在截止时间前提交说明。',
		time: '2026-09-24 11:20', actionLabel: '查看争议', actionUrl: '/pages/disputes/index', isDemo: true, read: true
	},
	{
		id: 'demo-certification', category: 'platform', title: '认证审核通过',
		content: '您的陪诊师认证已通过，现在可以查看平台派单。',
		time: '2026-09-23 10:00', actionLabel: '查看首页', actionUrl: '/pages/index/index', isDemo: true, read: true
	}
]
