import type { Models } from 'appwrite'
import { ID, Query } from 'appwrite'
import { ref } from 'vue'

const config = useRuntimeConfig()
// const categoriesDatabaseId: string = config.appwriteBdKey
// const categoriesDatabaseId: string = import.meta.env.NUXT_APPWRITE_BD_KEY
const categoriesDatabaseId: string = '696deae40009bb04e0fc'
const categoriesTableId: string = 'categories'
const queryLimit: number = 10

interface I_Categories extends Models.Row {
	name: string
	slug: string
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
