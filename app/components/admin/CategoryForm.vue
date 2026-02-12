<script setup lang="ts">
import type { Category, CreateCategoryData, UpdateCategoryData } from '~/types'
import { z } from 'zod'

interface Props {
	category?: Category
	loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	loading: false
})

const emit = defineEmits<{
	submit: [data: CreateCategoryData | UpdateCategoryData]
	cancel: []
}>()

const { t } = useI18n()

const schema = z.object({
	name: z.object({
		en: z.string().min(1, t('admin.categories.errors.nameEnRequired')),
		ru: z.string().min(1, t('admin.categories.errors.nameRuRequired'))
	}),
	description: z.object({
		en: z.string().optional(),
		ru: z.string().optional()
	}),
	icon: z.string().min(1, t('admin.categories.errors.iconRequired')),
	slug: z.string().min(1, t('admin.categories.errors.slugRequired')),
	sortOrder: z.number().min(0),
	isActive: z.boolean()
})

type Schema = z.output<typeof schema>

const form = reactive<Schema>({
	name: {
		en: props.category?.name.en || '',
		ru: props.category?.name.ru || ''
	},
	description: {
		en: props.category?.description.en || '',
		ru: props.category?.description.ru || ''
	},
	icon: props.category?.icon || '',
	slug: props.category?.slug || '',
	sortOrder: props.category?.sortOrder || 0,
	isActive: props.category?.isActive ?? true
})

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
		if (!props.category && newValue) {
			form.slug = generateSlug(newValue)
		}
	}
)

const onSubmit = async (_event: any) => {
	const data = props.category
		? ({ $id: props.category.$id, ...form } as UpdateCategoryData)
		: (form as CreateCategoryData)

	emit('submit', data)
}
</script>

<template>
	<UForm :schema="schema" :state="form" class="space-y-4" @submit="onSubmit">
		<UCard>
			<template #header>
				<h3 class="text-base font-semibold">{{ t('admin.categories.form.nameEn') }}</h3>
			</template>
			<div class="space-y-4">
				<UFormField :label="t('admin.categories.form.nameEn')" name="name.en" required>
					<UInput v-model="form.name.en" :placeholder="t('admin.categories.form.nameEnPlaceholder')" />
				</UFormField>

				<UFormField :label="t('admin.categories.form.nameRu')" name="name.ru" required>
					<UInput v-model="form.name.ru" :placeholder="t('admin.categories.form.nameRuPlaceholder')" />
				</UFormField>
			</div>
		</UCard>

		<UCard>
			<template #header>
				<h3 class="text-base font-semibold">{{ t('admin.categories.form.descriptionEn') }}</h3>
			</template>
			<div class="space-y-4">
				<UFormField :label="t('admin.categories.form.descriptionEn')" name="description.en">
					<UTextarea
						v-model="form.description.en"
						:placeholder="t('admin.categories.form.descriptionEnPlaceholder')"
						:rows="3"
					/>
				</UFormField>

				<UFormField :label="t('admin.categories.form.descriptionRu')" name="description.ru">
					<UTextarea
						v-model="form.description.ru"
						:placeholder="t('admin.categories.form.descriptionRuPlaceholder')"
						:rows="3"
					/>
				</UFormField>
			</div>
		</UCard>

		<UCard>
			<template #header>
				<h3 class="text-base font-semibold">{{ t('admin.categories.form.icon') }}</h3>
			</template>
			<div class="space-y-4">
				<UFormField :label="t('admin.categories.form.icon')" name="icon" required>
					<div class="space-y-3">
						<UInput v-model="form.icon" :placeholder="t('admin.categories.form.iconPlaceholder')" size="lg">
							<template #leading>
								<span class="text-2xl">{{ form.icon || '🏠' }}</span>
							</template>
						</UInput>
						<div>
							<p class="text-xs font-medium text-muted-foreground mb-2">Quick select:</p>
							<div class="flex flex-wrap gap-2">
								<UButton
									v-for="emoji in [
										'🏠',
										'🛒',
										'📱',
										'💻',
										'🎮',
										'👕',
										'🍔',
										'🚗',
										'📚',
										'⚽',
										'🎵',
										'🎨',
										'💼',
										'🏋️',
										'🌿'
									]"
									:key="emoji"
									size="sm"
									variant="outline"
									class="text-lg"
									@click="form.icon = emoji"
								>
									{{ emoji }}
								</UButton>
							</div>
						</div>
						<div class="text-xs text-muted-foreground">
							<p>
								More emojis:
								<a
									href="https://emojipedia.org"
									target="_blank"
									rel="noopener"
									class="text-primary hover:underline"
								>
									emojipedia.org
								</a>
								or
								<a
									href="https://getemoji.com"
									target="_blank"
									rel="noopener"
									class="text-primary hover:underline"
								>
									getemoji.com
								</a>
							</p>
						</div>
					</div>
					<template #help>
						<span class="text-xs text-muted-foreground">
							{{ t('admin.categories.form.iconHelp') }}
						</span>
					</template>
				</UFormField>

				<UFormField :label="t('admin.categories.form.slug')" name="slug" required>
					<UInput v-model="form.slug" :placeholder="t('admin.categories.form.slugPlaceholder')" />
					<template #help>
						<span class="text-xs text-muted-foreground">
							{{ t('admin.categories.form.slugHelp') }}
						</span>
					</template>
				</UFormField>

				<UFormField :label="t('admin.categories.form.sortOrder')" name="sortOrder">
					<UInput
						v-model.number="form.sortOrder"
						type="number"
						min="0"
						:placeholder="t('admin.categories.form.sortOrderPlaceholder')"
					/>
				</UFormField>

				<UFormField name="isActive">
					<UCheckbox v-model="form.isActive" :label="t('admin.categories.form.isActive')" />
					<template #help>
						<span class="text-xs text-muted-foreground">
							{{ t('admin.categories.form.isActiveHelp') }}
						</span>
					</template>
				</UFormField>
			</div>
		</UCard>

		<div class="flex items-center space-x-2">
			<UButton color="neutral" variant="ghost" block @click="emit('cancel')">
				{{ t('common.cancel') }}
			</UButton>
			<UButton type="submit" :loading="loading" color="primary" block>
				{{ category ? t('common.save') : t('common.add') }}
			</UButton>
		</div>
	</UForm>
</template>
