import { shallowRef } from 'vue'
import {
	disputesSeed,
	violationRecordsSeed,
	type DisputeRecord,
	type DisputeEvidence,
	type DisputeOutcome,
	type DisputeOrderSnapshot,
	type DisputeResponse,
	type DisputeResponseInput,
	type DisputeResponseType,
	type DisputeStatus,
	type ViolationRecord
} from '@/data/prototypeDisputes'

const STORAGE_KEY = 'prototype-dispute-records'
const validStatuses: DisputeStatus[] = ['pending-response', 'processing', 'established', 'not-established']
const validEvidenceKinds: DisputeEvidence['kind'][] = ['hospital', 'chat', 'call', 'route', 'document', 'image']
const validResponseTypes: DisputeResponseType[] = [
	'用户临时取消',
	'用户未按时到场',
	'已与用户协商',
	'医院/不可抗力原因',
	'投诉内容与事实不符',
	'其他'
]

function clone<T>(value: T): T {
	return JSON.parse(JSON.stringify(value)) as T
}

function isObject(value: unknown): value is Record<string, unknown> {
	return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function isEvidenceList(value: unknown): value is DisputeEvidence[] {
	return Array.isArray(value) && value.every((item) => {
		if (!isObject(item)) return false
		return typeof item.id === 'string' &&
			typeof item.kind === 'string' &&
			validEvidenceKinds.some((kind) => kind === item.kind) &&
			typeof item.label === 'string' &&
			typeof item.detail === 'string' &&
			(item.path === undefined || typeof item.path === 'string')
	})
}

function isOrderSnapshot(value: unknown): value is DisputeOrderSnapshot {
	if (!isObject(value)) return false
	return typeof value.serviceName === 'string' &&
		typeof value.hospital === 'string' &&
		typeof value.appointmentAt === 'string' &&
		typeof value.patient === 'string' &&
		typeof value.status === 'string'
}

function isDisputeResponse(value: unknown): value is DisputeResponse {
	if (!isObject(value)) return false
	return typeof value.type === 'string' &&
		validResponseTypes.some((type) => type === value.type) &&
		typeof value.description === 'string' &&
		typeof value.submittedAt === 'string' &&
		isEvidenceList(value.evidence)
}

function isDisputeOutcome(value: unknown): value is DisputeOutcome {
	if (!isObject(value)) return false
	return typeof value.breachType === 'string' &&
		typeof value.reputationAction === 'string' &&
		typeof value.orderFunds === 'string' &&
		typeof value.attendantIncome === 'string' &&
		typeof value.acceptanceRestriction === 'string' &&
		typeof value.handledAt === 'string' &&
		typeof value.platformExplanation === 'string'
}

function isDisputeRecordList(value: unknown): value is DisputeRecord[] {
	return Array.isArray(value) && value.every((item) => {
		if (!isObject(item)) return false
		const record = item
		const complaint = record.complaint
		if (!isObject(complaint)) return false
		const responseValid = record.response === undefined || isDisputeResponse(record.response)
		const outcomeValid = record.outcome === undefined || isDisputeOutcome(record.outcome)
		return typeof record.id === 'string' &&
			typeof record.category === 'string' &&
			typeof record.orderNo === 'string' &&
			typeof record.filedAt === 'string' &&
			typeof record.status === 'string' &&
			validStatuses.some((status) => status === record.status) &&
			(record.responseDeadline === undefined || typeof record.responseDeadline === 'string') &&
			isOrderSnapshot(record.order) &&
			typeof complaint.type === 'string' &&
			typeof complaint.occurredAt === 'string' &&
			typeof complaint.description === 'string' &&
			isEvidenceList(complaint.evidence) &&
			responseValid &&
			outcomeValid
	})
}

const disputes = shallowRef<DisputeRecord[]>(clone(disputesSeed))
const violations = shallowRef<ViolationRecord[]>(clone(violationRecordsSeed))
let initialized = false

function writeDisputes(records: DisputeRecord[]): boolean {
	if (typeof uni === 'undefined') return false

	try {
		uni.setStorageSync(STORAGE_KEY, JSON.stringify(records))
		return true
	} catch {
		return false
	}
}

function refresh() {
	let nextDisputes = clone(disputesSeed)
	let nextViolations = clone(violationRecordsSeed)

	if (typeof uni !== 'undefined') {
		try {
			const stored = uni.getStorageSync(STORAGE_KEY)
			if (typeof stored === 'string' && stored.trim()) {
				const parsed: unknown = JSON.parse(stored)
				if (isDisputeRecordList(parsed)) {
					const seedIds = new Set(disputesSeed.map((record) => record.id))
					const storedById = new Map(parsed.map((record) => [record.id, record]))
					nextDisputes = [
						...disputesSeed.map((record) => storedById.get(record.id) ?? clone(record)),
						...parsed.filter((record) => !seedIds.has(record.id))
					]
				}
			}
		} catch {
			// Keep the static demonstration data available when local storage is unreadable.
		}
	}

	disputes.value = nextDisputes
	violations.value = nextViolations
	initialized = true
}

function getDispute(id: string) {
	return disputes.value.find((record) => record.id === id)
}

function submitResponse(id: string, response: DisputeResponseInput): boolean {
	const index = disputes.value.findIndex((record) => record.id === id)
	if (index < 0 || disputes.value[index].status !== 'pending-response') return false

	const nextDisputes = clone(disputes.value)
	nextDisputes[index] = {
		...nextDisputes[index],
		status: 'processing',
		response: clone(response)
	}

	if (!writeDisputes(nextDisputes)) return false

	disputes.value = nextDisputes
	return true
}

export function useDisputeRecords() {
	if (!initialized) refresh()

	return {
		disputes,
		violations,
		refresh,
		getDispute,
		submitResponse
	}
}
