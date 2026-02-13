<script setup lang="ts">
import { z } from 'zod'
import type { Product, CreateProductData, PricingOption } from '~/types'

interface Props {
	product?: Product
	loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	loading: false
})

const emit = defineEmits<{
	submit: [data: CreateProductData]
	cancel: []
}>()

const { t } = useI18n()
const { categories, fetchCategories } = useCategories()

const schema = z.object({
	name: z.object({
		en: z.string().min(1, t('admin.products.errors.nameEnRequired')),
		ru: z.string().min(1, t('admin.products.errors.nameRuRequired'))
	}),
	description: z.object({
		en: z.string().min(1, t('admin.products.errors.descriptionEnRequired')),
		ru: z.string().min(1, t('admin.products.errors.descriptionRuRequired'))
	}),
	categoryId: z.string().min(1, t('admin.products.errors.categoryRequired')),
	slug: z.string().min(1, t('admin.products.errors.slugRequired')),
	contactUsername: z.string().min(1, t('admin.products.errors.contactUsernameRequired')),
	sortOrder: z.number().min(0),
	isActive: z.boolean(),
	isAvailable: z.boolean()
})

type Schema = z.output<typeof schema>

const form = reactive<Schema>({
	name: {
		en: props.product?.name.en || '',
		ru: props.product?.name.ru || ''
	},
	description: {
		en: props.product?.description.en || '',
		ru: props.product?.description.ru || ''
	},
	categoryId: props.product?.categoryId || '',
	slug: props.product?.slug || '',
	contactUsername: props.product?.contactUsername || '',
	sortOrder: props.product?.sortOrder || 0,
	isActive: props.product?.isActive ?? true,
	isAvailable: props.product?.isAvailable ?? true
})

const pricing = ref<PricingOption[]>(
	props.product?.pricing && props.product.pricing.length > 0
		? props.product.pricing.map((p) => ({ ...p }))
		: [{ period: 'day', price: 0, currency: '₽' }]
)

const images = ref<string[]>(props.product?.images ? [...props.product.images] : [])

interface FeatureItem {
	en: string
	ru: string
}

const features = ref<FeatureItem[]>(
	props.product?.features && (props.product.features.en.length > 0 || props.product.features.ru.length > 0)
		? Array.from(
				{ length: Math.max(props.product.features.en.length, props.product.features.ru.length) },
				(_, i) => ({
					en: props.product!.features.en[i] || '',
					ru: props.product!.features.ru[i] || ''
				})
			)
		: [{ en: '', ru: '' }]
)

const priceUnits = [
	{ value: 'hour', label: t('admin.products.priceUnits.hour') },
	{ value: 'day', label: t('admin.products.priceUnits.day') },
	{ value: 'week', label: t('admin.products.priceUnits.week') },
	{ value: 'month', label: t('admin.products.priceUnits.month') }
]

const currencies = [
	{ value: '₽', label: '₽ (RUB)' },
	{ value: '$', label: '$ (USD)' },
	{ value: '€', label: '€ (EUR)' },
	{ value: '฿', label: '฿ (THB)' },
	{ value: '¥', label: '¥ (CNY/JPY)' }
]

const addPricing = () => {
	pricing.value.push({ period: 'day', price: 0, currency: '₽' })
}

const removePricing = (index: number) => {
	if (pricing.value.length > 1) {
		pricing.value.splice(index, 1)
	}
}

const addFeature = () => {
	features.value.push({ en: '', ru: '' })
}

const removeFeature = (index: number) => {
	if (features.value.length > 1) {
		features.value.splice(index, 1)
	}
}

const generateSlug = (text: string): string => {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.trim()
}

watch(
	() => form.name.en,
	(newValue) => {
		if (!props.product && newValue) {
			form.slug = generateSlug(newValue)
		}
	}
)

onMounted(async () => {
	if (!categories.value.length) {
		await fetchCategories()
	}
})

const onSubmit = async () => {
	const filteredFeatures = features.value.filter((f) => f.en.trim() || f.ru.trim())

	const data = {
		name: form.name,
		description: form.description,
		categoryId: form.categoryId,
		pricing: pricing.value.filter((p) => p.price > 0),
		images: images.value,
		slug: form.slug,
		features: {
			en: filteredFeatures.map((f) => f.en.trim()).filter(Boolean),
			ru: filteredFeatures.map((f) => f.ru.trim()).filter(Boolean)
		},
		sortOrder: form.sortOrder,
		isActive: form.isActive,
		isAvailable: form.isAvailable,
		contactUsername: form.contactUsername.trim()
	}

	emit('submit', data)
}
</script>

<template>
	<UForm :schema="schema" :state="form" class="space-y-4" @submit="onSubmit">
		<UCard>
			<template #header>
				<h3 class="text-base font-semibold">{{ t('admin.products.form.basicInfo') }}</h3>
			</template>
			<div class="space-y-4">
				<UFormField :label="t('admin.products.form.nameEn')" name="name.en" required>
					<UInput v-model="form.name.en" :placeholder="t('admin.products.form.nameEnPlaceholder')" />
				</UFormField>

				<UFormField :label="t('admin.products.form.nameRu')" name="name.ru" required>
					<UInput v-model="form.name.ru" :placeholder="t('admin.products.form.nameRuPlaceholder')" />
				</UFormField>

				<UFormField :label="t('admin.products.form.descriptionEn')" name="description.en" required>
					<UTextarea
						v-model="form.description.en"
						:placeholder="t('admin.products.form.descriptionEnPlaceholder')"
						:rows="4"
					/>
				</UFormField>

				<UFormField :label="t('admin.products.form.descriptionRu')" name="description.ru" required>
					<UTextarea
						v-model="form.description.ru"
						:placeholder="t('admin.products.form.descriptionRuPlaceholder')"
						:rows="4"
					/>
				</UFormField>
			</div>
		</UCard>

		<UCard>
			<template #header>
				<div class="flex items-center justify-between">
					<h3 class="text-base font-semibold">{{ t('admin.products.form.categoryAndPrice') }}</h3>
					<UButton icon="i-lucide-plus" size="xs" color="primary" variant="soft" @click="addPricing">
						{{ t('admin.products.form.addPrice') }}
					</UButton>
				</div>
			</template>
			<div class="space-y-4">
				<UFormField :label="t('admin.products.form.category')" name="categoryId" required>
					<USelect
						v-model="form.categoryId"
						:items="categories.map((c) => ({ value: c.$id, label: c.name[$i18n.locale] }))"
						value-key="value"
						:placeholder="t('admin.products.form.categoryPlaceholder')"
					/>
				</UFormField>

				<div class="space-y-2">
					<p class="text-xs text-muted-foreground">
						{{ t('admin.products.form.priceOptional') }}
					</p>
					<div class="space-y-3">
						<div v-for="(priceItem, index) in pricing" :key="index" class="flex items-end gap-2">
							<UFormField :label="index === 0 ? t('admin.products.form.price') : ''" class="flex-1">
								<UInput v-model.number="priceItem.price" type="number" min="0" step="0.01" />
							</UFormField>

							<UFormField :label="index === 0 ? t('admin.products.form.currency') : ''" class="w-32">
								<USelect
									:model-value="priceItem.currency"
									:items="currencies"
									value-key="value"
									@update:model-value="(val: any) => (priceItem.currency = val)"
								/>
							</UFormField>

							<UFormField :label="index === 0 ? t('admin.products.form.priceUnit') : ''" class="w-32">
								<USelect
									:model-value="priceItem.period"
									:items="priceUnits"
									value-key="value"
									@update:model-value="(val: any) => (priceItem.period = val)"
								/>
							</UFormField>

							<UButton
								v-if="pricing.length > 1"
								icon="i-lucide-trash-2"
								color="error"
								variant="soft"
								size="sm"
								@click="removePricing(index)"
							/>
						</div>
					</div>
				</div>
			</div>
		</UCard>

		<UCard>
			<template #header>
				<h3 class="text-base font-semibold">{{ t('admin.products.images') }}</h3>
			</template>
			<ImageUpload v-model="images" :max-images="5" />
		</UCard>

		<UCard>
			<template #header>
				<div class="flex items-center justify-between">
					<h3 class="text-base font-semibold">{{ t('admin.products.form.features') }}</h3>
					<UButton icon="i-lucide-plus" size="xs" color="primary" variant="soft" @click="addFeature">
						{{ t('admin.products.form.addFeature') }}
					</UButton>
				</div>
			</template>
			<div class="space-y-4">
				<div v-for="(feature, index) in features" :key="index" class="space-y-2">
					<div class="flex items-start gap-2">
						<div class="flex-1 space-y-2">
							<UFormField :label="index === 0 ? t('admin.products.form.featuresEn') : ''">
								<UInput
									v-model="feature.en"
									:placeholder="t('admin.products.form.featureEnPlaceholder')"
								/>
							</UFormField>
							<UFormField :label="index === 0 ? t('admin.products.form.featuresRu') : ''">
								<UInput
									v-model="feature.ru"
									:placeholder="t('admin.products.form.featureRuPlaceholder')"
								/>
							</UFormField>
						</div>
						<UButton
							v-if="features.length > 1"
							icon="i-lucide-trash-2"
							color="error"
							variant="soft"
							size="sm"
							:class="{ 'mt-6': index === 0 }"
							@click="removeFeature(index)"
						/>
					</div>
				</div>
			</div>
		</UCard>

		<UCard>
			<template #header>
				<h3 class="text-base font-semibold">{{ t('admin.products.form.settings') }}</h3>
			</template>
			<div class="space-y-4">
				<UFormField :label="t('admin.products.form.slug')" name="slug" required>
					<UInput v-model="form.slug" :placeholder="t('admin.products.form.slugPlaceholder')" />
					<template #help>
						<span class="text-xs text-muted-foreground">
							{{ t('admin.products.form.slugHelp') }}
						</span>
					</template>
				</UFormField>

				<UFormField :label="t('product.contact.username_label')" name="contactUsername" required>
					<UInput
						v-model="form.contactUsername"
						:placeholder="t('product.contact.username_placeholder')"
						icon="i-lucide-at-sign"
					/>
					<template #help>
						<span class="text-xs text-muted-foreground">
							{{ t('product.contact.username_help') }}
						</span>
					</template>
				</UFormField>

				<UFormField :label="t('admin.products.form.sortOrder')" name="sortOrder">
					<UInput v-model.number="form.sortOrder" type="number" min="0" />
				</UFormField>

				<div class="space-y-3">
					<UFormField name="isActive">
						<UCheckbox v-model="form.isActive" :label="t('admin.products.form.isActive')" />
					</UFormField>

					<UFormField name="isAvailable">
						<UCheckbox v-model="form.isAvailable" :label="t('admin.products.form.isAvailable')" />
						<template #help>
							<span class="text-xs text-muted-foreground">
								{{ t('admin.products.form.isAvailableHelp') }}
							</span>
						</template>
					</UFormField>
				</div>
			</div>
		</UCard>

		<div class="flex items-center space-x-2">
			<UButton color="neutral" variant="ghost" block @click="emit('cancel')">
				{{ t('common.cancel') }}
			</UButton>
			<UButton type="submit" :loading="loading" color="primary" block>
				{{ product ? t('common.save') : t('common.add') }}
			</UButton>
		</div>
	</UForm>
</template>
