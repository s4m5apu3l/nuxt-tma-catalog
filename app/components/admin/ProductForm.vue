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
	price: z.number().min(0, t('admin.products.errors.priceMin')),
	priceUnit: z.enum(['hour', 'day', 'week', 'month']),
	slug: z.string().min(1, t('admin.products.errors.slugRequired')),
	sortOrder: z.number().min(0),
	isActive: z.boolean(),
	isAvailable: z.boolean()
})

type Schema = z.output<typeof schema>

const getFirstPricing = (product?: Product): { price: number; priceUnit: 'hour' | 'day' | 'week' | 'month' } => {
	if (product?.pricing && product.pricing.length > 0) {
		const firstPrice = product.pricing[0]
		return {
			price: firstPrice?.price ?? 0,
			priceUnit: firstPrice?.period ?? 'day'
		}
	}
	return { price: 0, priceUnit: 'day' }
}

const firstPricing = getFirstPricing(props.product)

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
	price: firstPricing.price,
	priceUnit: firstPricing.priceUnit,
	slug: props.product?.slug || '',
	sortOrder: props.product?.sortOrder || 0,
	isActive: props.product?.isActive ?? true,
	isAvailable: props.product?.isAvailable ?? true
})

const images = ref<string[]>(props.product?.images ? [...props.product.images] : [])

const priceUnits = [
	{ value: 'hour', label: t('admin.products.priceUnits.hour') },
	{ value: 'day', label: t('admin.products.priceUnits.day') },
	{ value: 'week', label: t('admin.products.priceUnits.week') },
	{ value: 'month', label: t('admin.products.priceUnits.month') }
]

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
	const pricing: PricingOption[] = [
		{
			period: form.priceUnit,
			price: form.price
		}
	]

	const data = {
		name: form.name,
		description: form.description,
		categoryId: form.categoryId,
		pricing,
		images: images.value,
		slug: form.slug,
		sortOrder: form.sortOrder,
		isActive: form.isActive,
		isAvailable: form.isAvailable
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
				<h3 class="text-base font-semibold">{{ t('admin.products.form.categoryAndPrice') }}</h3>
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

				<div class="grid grid-cols-2 gap-4">
					<UFormField :label="t('admin.products.form.price')" name="price" required>
						<UInput v-model.number="form.price" type="number" min="0" step="0.01" />
					</UFormField>

					<UFormField :label="t('admin.products.form.priceUnit')" name="priceUnit" required>
						<USelect v-model="form.priceUnit" :items="priceUnits" value-key="value" />
					</UFormField>
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
