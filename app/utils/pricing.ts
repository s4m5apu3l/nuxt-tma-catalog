import type { PricingOption, PricePeriod } from '~/types/product'

export const formatPricing = (pricing: readonly PricingOption[], locale: string): string => {
	if (!pricing || pricing.length === 0) {
		return locale === 'ru' ? 'Цена по запросу' : 'Price on request'
	}

	const sorted = [...pricing].sort((a, b) => {
		const order: Record<PricePeriod, number> = { hour: 1, day: 2, week: 3, month: 4 }
		return order[a.period] - order[b.period]
	})

	const first = sorted[0]
	if (!first) {
		return locale === 'ru' ? 'Цена по запросу' : 'Price on request'
	}

	return `${first.price} ${first.currency}/${getPeriodLabel(first.period, locale)}`
}

export const formatPricingFull = (pricing: readonly PricingOption[], locale: string): string[] => {
	if (!pricing || pricing.length === 0) return []

	return pricing.map((option) => `${option.price} ${option.currency}/${getPeriodLabel(option.period, locale)}`)
}

export const getPeriodLabel = (period: PricePeriod, locale: string): string => {
	const labels: Record<PricePeriod, Record<string, string>> = {
		hour: { en: 'hour', ru: 'час' },
		day: { en: 'day', ru: 'день' },
		week: { en: 'week', ru: 'неделю' },
		month: { en: 'month', ru: 'месяц' }
	}

	const periodLabels = labels[period]
	return periodLabels?.[locale] || periodLabels?.en || period
}

export const getMinPrice = (pricing: readonly PricingOption[]): number => {
	if (!pricing || pricing.length === 0) return 0
	return Math.min(...pricing.map((p) => p.price))
}
