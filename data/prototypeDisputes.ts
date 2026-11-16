export type DisputeStatus = 'pending-response' | 'processing' | 'established' | 'not-established'

export type DisputeResponseType =
	| '用户临时取消'
	| '用户未按时到场'
	| '已与用户协商'
	| '医院/不可抗力原因'
	| '投诉内容与事实不符'
	| '其他'

export interface DisputeOrderSnapshot {
	serviceName: string
	hospital: string
	appointmentAt: string
	patient: string
	status: string
}

export interface DisputeEvidence {
	id: string
	kind: 'hospital' | 'chat' | 'call' | 'route' | 'document' | 'image'
	label: string
	detail: string
	path?: string
}

export interface DisputeResponse {
	type: DisputeResponseType
	description: string
	submittedAt: string
	evidence: DisputeEvidence[]
}

export interface DisputeOutcome {
	breachType: string
	reputationAction: string
	orderFunds: string
	attendantIncome: string
	acceptanceRestriction: string
	handledAt: string
	platformExplanation: string
}

export interface DisputeRecord {
	id: string
	category: string
	orderNo: string
	filedAt: string
	status: DisputeStatus
	responseDeadline?: string
	order: DisputeOrderSnapshot
	complaint: {
		type: string
		occurredAt: string
		description: string
		evidence: DisputeEvidence[]
	}
	response?: DisputeResponse
	outcome?: DisputeOutcome
}

export interface DisputeResponseInput {
	type: DisputeResponseType
	description: string
	submittedAt: string
	evidence: DisputeEvidence[]
}

export interface ViolationRecord {
	id: string
	type: string
	orderNo: string
	handledAt: string
	summary: string
	relatedDisputeId?: string
}

export const responseTypes: DisputeResponseType[] = [
	'用户临时取消',
	'用户未按时到场',
	'已与用户协商',
	'医院/不可抗力原因',
	'投诉内容与事实不符',
	'其他'
]

function createViolationDispute(
	id: string,
	category: string,
	orderNo: string,
	filedAt: string,
	handledAt: string,
	description: string
): DisputeRecord {
	return {
		id,
		category,
		orderNo,
		filedAt,
		status: 'established',
		order: {
			serviceName: '陪诊就医服务',
			hospital: '九江市第一人民医院',
			appointmentAt: `${filedAt.slice(0, 10)} 09:00:00`,
			patient: '张三',
			status: '已完成'
		},
		complaint: {
			type: category,
			occurredAt: filedAt,
			description,
			evidence: [
				{ id: `${id}-hospital`, kind: 'hospital', label: '医院现场', detail: '订单关联现场记录', path: '/static/images/dispute-evidence-hospital.jpg' },
				{ id: `${id}-order`, kind: 'document', label: '订单记录', detail: '平台订单服务记录' }
			]
		},
		response: {
			type: '其他',
			submittedAt: handledAt,
			description: '我已收到平台关于本次服务情况的核查通知，并提交了相关记录供平台审核。',
			evidence: [
				{ id: `${id}-route`, kind: 'route', label: '行程记录', detail: '订单关联的服务行程' },
				{ id: `${id}-response`, kind: 'chat', label: '沟通记录', detail: '服务期间的沟通记录' }
			]
		},
		outcome: {
			breachType: category,
			reputationAction: '扣除 8 分',
			orderFunds: '按平台规则处理',
			attendantIncome: '按平台规则处理本单收益',
			acceptanceRestriction: '无',
			handledAt,
			platformExplanation: description
		}
	}
}

const violationDisputeSeeds: DisputeRecord[] = [
	createViolationDispute('dispute-violation-001', '陪诊师爽约', '202609230045', '2026-09-23 09:00', '2026-09-23 10:00', '经核实未按预约时间到达且没有提前联系用户，平台已按陪诊师爽约处理。'),
	createViolationDispute('dispute-violation-002', '陪诊师迟到', '202609180021', '2026-09-18 14:30', '2026-09-18 15:20', '服务开始时间晚于订单预约时间，平台已核实并记录本次迟到情况。'),
	createViolationDispute('dispute-violation-003', '服务态度问题', '202609150078', '2026-09-15 16:20', '2026-09-15 17:10', '平台核实服务沟通存在不足，已按服务态度问题完成处理。'),
	createViolationDispute('dispute-violation-004', '提前结束服务', '202609120033', '2026-09-12 11:10', '2026-09-12 12:00', '服务时长与订单约定不一致，平台已核实并记录提前结束服务的处理情况。')
]

export const disputesSeed: DisputeRecord[] = [
	{
		id: 'dispute-pending-001',
		category: '陪诊师爽约',
		orderNo: 'DD202409250001',
		filedAt: '2026-09-25 14:20',
		status: 'pending-response',
		responseDeadline: '2026-09-27 14:20',
		order: {
			serviceName: '陪诊就医服务',
			hospital: '九江市第一人民医院',
			appointmentAt: '2026-09-25 09:00:00',
			patient: '张三',
			status: '已完成'
		},
		complaint: {
			type: '陪诊师爽约',
			occurredAt: '2026-09-25 08:50',
			description: '我已按照约定时间到达医院，但陪诊师未按时到达，且在预约时间后多次联系未能接通电话，导致我长时间在医院等待，耽误了就医安排。',
			evidence: [
				{ id: 'pending-hospital', kind: 'hospital', label: '医院现场', detail: '就诊楼入口照片', path: '/static/images/dispute-evidence-hospital.jpg' },
				{ id: 'pending-chat', kind: 'chat', label: '聊天记录', detail: '三次联系均未收到回复' },
				{ id: 'pending-call', kind: 'call', label: '通话记录', detail: '08:45、08:50、08:55 未接通' }
			]
		}
	},
	{
		id: 'dispute-processing-001',
		category: '服务态度问题',
		orderNo: 'DD202409190056',
		filedAt: '2026-09-19 10:15',
		status: 'processing',
		order: {
			serviceName: '半天院内陪诊',
			hospital: '九江市第二人民医院',
			appointmentAt: '2026-09-19 08:30:00',
			patient: '李女士',
			status: '已完成'
		},
		complaint: {
			type: '服务态度问题',
			occurredAt: '2026-09-19 09:40',
			description: '陪诊过程中沟通不够耐心，我希望平台核实当天的服务情况。',
			evidence: [
				{ id: 'processing-hospital', kind: 'hospital', label: '医院现场', detail: '订单服务现场照片', path: '/static/images/dispute-evidence-hospital.jpg' },
				{ id: 'processing-chat', kind: 'chat', label: '聊天记录', detail: '服务过程沟通截图' },
				{ id: 'processing-call', kind: 'call', label: '通话记录', detail: '预约期间的联系记录' }
			]
		},
		response: {
			type: '其他',
			submittedAt: '2026-09-19 16:30',
			description: '服务期间我一直按照用户需要陪同就诊，沟通语气可能不够周到。我已向用户说明情况，并把当天行程和沟通记录提交平台核实。',
			evidence: [
				{ id: 'processing-route', kind: 'route', label: '行程记录', detail: '08:10 到达医院，09:15 完成陪诊' },
				{ id: 'processing-attendant-chat', kind: 'chat', label: '沟通记录', detail: '已向用户说明并致歉' },
				{ id: 'processing-record', kind: 'document', label: '就诊记录', detail: '陪同就诊记录已完成' }
			]
		}
	},
	{
		id: 'dispute-established-001',
		category: '陪诊师迟到',
		orderNo: 'DD202409150039',
		filedAt: '2026-09-15 09:20',
		status: 'established',
		order: {
			serviceName: '陪诊就医服务',
			hospital: '九江市第一人民医院',
			appointmentAt: '2026-09-15 09:00:00',
			patient: '张三',
			status: '已完成'
		},
		complaint: {
			type: '陪诊师爽约',
			occurredAt: '2026-09-15 08:50',
			description: '陪诊师未按约定时间到达，联系多次未接听，导致我在医院长时间等待。',
			evidence: [
				{ id: 'established-hospital', kind: 'hospital', label: '医院现场', detail: '就诊楼入口照片', path: '/static/images/dispute-evidence-hospital.jpg' },
				{ id: 'established-chat', kind: 'chat', label: '聊天记录', detail: '预约时间后多次联系未接通' },
				{ id: 'established-call', kind: 'call', label: '通话记录', detail: '08:45、08:50、08:55 未接通' }
			]
		},
		response: {
			type: '其他',
			submittedAt: '2026-09-15 18:30',
			description: '由于上一位服务对象就诊时间延长，行程出现延误，未能在约定时间前到达医院；期间手机处于静音状态，未能及时接听用户来电。对此给用户带来的不便深表歉意，并已提交相关行程与沟通记录供平台审核。',
			evidence: [
				{ id: 'established-route', kind: 'route', label: '行程记录', detail: '08:10 出发，09:15 抵达医院' },
				{ id: 'established-response-chat', kind: 'chat', label: '沟通记录', detail: '已向用户致歉并说明延误原因' },
				{ id: 'established-record', kind: 'document', label: '就诊记录', detail: '关联订单就诊记录' }
			]
		},
		outcome: {
			breachType: '陪诊师爽约',
			reputationAction: '扣除 8 分',
			orderFunds: '用户全额退款 ¥100.00',
			attendantIncome: '扣回本单收益 ¥85.00',
			acceptanceRestriction: '无',
			handledAt: '2026-09-26 10:20',
			platformExplanation: '经核实，陪诊师未按约定时间到达，且未提前联系用户。'
		}
	},
	{
		id: 'dispute-not-established-001',
		category: '要求线下交易',
		orderNo: 'DD202409120078',
		filedAt: '2026-09-12 16:05',
		status: 'not-established',
		order: {
			serviceName: '全程院内陪诊',
			hospital: '九江市中医医院',
			appointmentAt: '2026-09-12 14:00:00',
			patient: '王女士',
			status: '已完成'
		},
		complaint: {
			type: '要求线下交易',
			occurredAt: '2026-09-12 15:10',
			description: '我认为陪诊师提出线下交易，请平台结合双方提交的沟通记录核实。',
			evidence: [
				{ id: 'rejected-hospital', kind: 'hospital', label: '医院现场', detail: '订单服务现场照片', path: '/static/images/dispute-evidence-hospital.jpg' },
				{ id: 'rejected-chat', kind: 'chat', label: '聊天记录', detail: '双方提交的完整沟通记录' },
				{ id: 'rejected-call', kind: 'call', label: '通话记录', detail: '服务期间的联系记录' }
			]
		},
		response: {
			type: '投诉内容与事实不符',
			submittedAt: '2026-09-13 09:30',
			description: '我没有提出线下交易，服务和付款均按照平台订单进行。已提交完整沟通记录，请平台核实。',
			evidence: [
				{ id: 'rejected-route', kind: 'route', label: '行程记录', detail: '服务期间的路线记录' },
				{ id: 'rejected-response-chat', kind: 'chat', label: '沟通记录', detail: '平台内订单沟通记录' },
				{ id: 'rejected-response-document', kind: 'document', label: '就诊记录', detail: '关联订单就诊记录' }
			]
		},
		outcome: {
			breachType: '无',
			reputationAction: '未扣分',
			orderFunds: '按原订单处理',
			attendantIncome: '不扣回',
			acceptanceRestriction: '无',
			handledAt: '2026-09-14 10:20',
			platformExplanation: '结合双方提交的证据，暂未能证明存在违约行为。'
		}
	},
	...violationDisputeSeeds
]

export const violationRecordsSeed: ViolationRecord[] = [
	{
		id: 'violation-001',
		type: '爽约',
		orderNo: '202609230045',
		handledAt: '2026-09-23 09:00',
		summary: '经核实未按预约时间到达且没有提前联系用户，已按陪诊师爽约记录处理。',
		relatedDisputeId: 'dispute-violation-001'
	},
	{
		id: 'violation-002',
		type: '迟到',
		orderNo: '202609180021',
		handledAt: '2026-09-18 14:30',
		summary: '服务开始时间晚于预约时间，平台已记录本次迟到情况。',
		relatedDisputeId: 'dispute-violation-002'
	},
	{
		id: 'violation-003',
		type: '服务态度问题',
		orderNo: '202609150078',
		handledAt: '2026-09-15 16:20',
		summary: '平台核实服务沟通存在不足，已完成服务态度问题记录。',
		relatedDisputeId: 'dispute-violation-003'
	},
	{
		id: 'violation-004',
		type: '提前结束服务',
		orderNo: '202609120033',
		handledAt: '2026-09-12 11:10',
		summary: '服务时长与订单约定不一致，平台已记录提前结束服务的处理情况。',
		relatedDisputeId: 'dispute-violation-004'
	},
	{
		id: 'violation-005',
		type: '爽约',
		orderNo: 'DD202409150039',
		handledAt: '2026-09-26 10:20',
		summary: '本次争议经平台核实成立，已按陪诊师爽约记录处理。',
		relatedDisputeId: 'dispute-established-001'
	}
]
