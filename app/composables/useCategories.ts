import type { Models } from 'appwrite'
import { Query } from 'appwrite'

const config = useRuntimeConfig()

const categoriesDatabaseId: string = config.public.appwriteBdKey
const categoriesTableId: string = config.public.appwriteCollectionCategories
const queryLimit: number = 10

interface I_Categories extends Models.Row {
	name: string
	slug: string
	imgId?: string
}

const current = ref<I_Categories[] | null>(null)

export const useCategories = () => {
	const fetch = async (): Promise<void> => {
		try {
			const res = await useAppwrite().tablesDB.listRows({
				databaseId: categoriesDatabaseId,
				tableId: categoriesTableId,
				queries: [Query.orderDesc('$createdAt'), Query.limit(queryLimit)]
			})
			// const promise = await useAppwrite().account.createAnonymousSession()
			console.dir(res)

			current.value = res.rows as unknown as I_Categories[]
		} catch (er) {
			console.error(er)
		}
	}

	// Add new idea to the database,
	// Change the value of the current object
	// const add = async (idea: Idea): Promise<void> => {
	// 	const response = await tablesDB.createRow({
	// 		databaseId: ideasDatabaseId,
	// 		tableId: ideasTableId,
	// 		rowId: ID.unique(),
	// 		data: idea
	// 	})
	// 	current.value = [response, ...(current.value as Idea[])].slice(0, 10) as Idea[]
	// }

	// const remove = async (id: string): Promise<void> => {
	// 	await tablesDB.deleteRow({
	// 		databaseId: ideasDatabaseId,
	// 		tableId: ideasTableId,
	// 		rowId: id
	// 	})
	// 	await fetch() // Refetch ideas to ensure we have 10 items
	// }

	return {
		// add,
		current,
		fetch
		// remove
	}
}
