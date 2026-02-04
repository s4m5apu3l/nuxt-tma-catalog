import { Client, Databases } from 'appwrite'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Configuration
const config = {
	endpoint: process.env.APPWRITE_PUBLIC_ENDPOINT,
	projectId: process.env.APPWRITE_PUBLIC_PROJECT_ID,
	databaseId: process.env.APPWRITE_PUBLIC_BD_KEY,
	productsCollection: process.env.APPWRITE_PUBLIC_COLLECTION_PRODUCTS_ID
}

// Initialize Appwrite
const client = new Client()
	.setEndpoint(config.endpoint)
	.setProject(config.projectId)

const databases = new Databases(client)

// Sample image IDs (you would replace these with actual uploaded image IDs)
const sampleImages = {
	electronics: [
		'sample_iphone_1',
		'sample_iphone_2',
		'sample_macbook_1',
		'sample_macbook_2'
	],
	sports: [
		'sample_bike_1',
		'sample_bike_2'
	],
	photography: [
		'sample_camera_1',
		'sample_camera_2'
	]
}

async function addImagesToProducts() {
	console.log('Adding sample images to products...')

	try {
		// Get all products
		const products = await databases.listDocuments(
			config.databaseId,
			config.productsCollection
		)

		console.log(`Found ${products.documents.length} products`)

		for (const product of products.documents) {
			let imagesToAdd = []

			// Assign images based on product category
			if (product.categoryId === 'category_electronics') {
				if (product.slug === 'iphone-15-pro') {
					imagesToAdd = sampleImages.electronics.slice(0, 2)
				} else if (product.slug === 'macbook-pro-16') {
					imagesToAdd = sampleImages.electronics.slice(2, 4)
				}
			} else if (product.categoryId === 'category_sports') {
				imagesToAdd = sampleImages.sports
			} else if (product.categoryId === 'category_photography') {
				imagesToAdd = sampleImages.photography
			}

			if (imagesToAdd.length > 0) {
				console.log(`Adding ${imagesToAdd.length} images to ${product.name}`)

				await databases.updateDocument(
					config.databaseId,
					config.productsCollection,
					product.$id,
					{
						images: imagesToAdd
					}
				)

				console.log(`✅ Updated ${product.name}`)
			}
		}

		console.log('\n✅ All products updated with sample images!')
		console.log('\n💡 Note: These are placeholder image IDs.')
		console.log('   In a real scenario, you would:')
		console.log('   1. Upload actual images to Appwrite Storage')
		console.log('   2. Get the real file IDs from the upload response')
		console.log('   3. Use those IDs instead of placeholder values')

	} catch (error) {
		console.error('\n❌ Error adding images to products:', error)
	}
}

// Run the script
addImagesToProducts().catch(console.error)