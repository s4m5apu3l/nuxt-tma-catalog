import { Client, Databases, Storage, ID } from 'appwrite'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { config as dotenvConfig } from 'dotenv'

// Load environment variables
dotenvConfig()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuration - using actual environment variables
const config = {
	endpoint: process.env.APPWRITE_PUBLIC_ENDPOINT,
	projectId: process.env.APPWRITE_PUBLIC_PROJECT_ID,
	databaseId: process.env.APPWRITE_PUBLIC_BD_KEY,
	categoriesCollectionId: process.env.APPWRITE_PUBLIC_COLLECTION_CATEGORIES_ID,
	productsCollectionId: process.env.APPWRITE_PUBLIC_COLLECTION_PRODUCTS_ID,
	bucketId: process.env.APPWRITE_PUBLIC_BUCKET_ID
}

// Initialize Appwrite
const client = new Client().setEndpoint(config.endpoint).setProject(config.projectId)

const databases = new Databases(client)
const storage = new Storage(client)

async function uploadSampleImage() {
	try {
		// Create a simple sample image file (you can replace this with an actual image)
		const sampleImagePath = path.join(__dirname, '..', 'public', 'placeholder-image.svg')

		if (!fs.existsSync(sampleImagePath)) {
			console.log('Sample image not found, creating a placeholder...')
			return null
		}

		const fileBuffer = fs.readFileSync(sampleImagePath)
		const file = new File([fileBuffer], 'sample-product.svg', { type: 'image/svg+xml' })

		console.log('Uploading sample image...')
		const uploadedFile = await storage.createFile(config.bucketId, ID.unique(), file)

		console.log('Image uploaded successfully:', uploadedFile.$id)
		return uploadedFile.$id
	} catch (error) {
		console.error('Error uploading image:', error)
		return null
	}
}

async function createSampleCategory() {
	try {
		console.log('Creating sample category...')

		const categoryData = {
			name: JSON.stringify({
				en: 'Electronics',
				ru: 'Электроника'
			}),
			description: JSON.stringify({
				en: 'Electronic devices and gadgets',
				ru: 'Электронные устройства и гаджеты'
			}),
			slug: 'electronics',
			icon: '📱',
			sortOrder: 1,
			isActive: true
		}

		const category = await databases.createDocument(
			config.databaseId,
			config.categoriesCollectionId,
			ID.unique(),
			categoryData
		)

		console.log('Category created successfully:', category.$id)
		return category.$id
	} catch (error) {
		console.error('Error creating category:', error)

		// Try to find existing category
		try {
			const categories = await databases.listDocuments(config.databaseId, config.categoriesCollectionId)

			if (categories.documents.length > 0) {
				console.log('Using existing category:', categories.documents[0].$id)
				return categories.documents[0].$id
			}
		} catch (listError) {
			console.error('Error listing categories:', listError)
		}

		return null
	}
}

async function createSampleProduct(categoryId, imageId) {
	try {
		console.log('Creating sample product...')

		const productData = {
			categoryId: categoryId,
			name: JSON.stringify({
				en: 'Sample Smartphone',
				ru: 'Образец смартфона'
			}),
			description: JSON.stringify({
				en: 'A high-quality smartphone with advanced features for daily use.',
				ru: 'Высококачественный смартфон с передовыми функциями для ежедневного использования.'
			}),
			price: 299,
			priceUnit: 'USD/day',
			images: imageId ? [imageId] : [],
			slug: 'sample-smartphone',
			features: JSON.stringify({
				en: ['5G connectivity', 'High-resolution camera', 'Long battery life'],
				ru: ['5G подключение', 'Камера высокого разрешения', 'Долгое время работы батареи']
			}),
			isAvailable: true,
			isActive: true,
			sortOrder: 1,
			contactMessage: JSON.stringify({
				en: "Hi! I'm interested in renting the Sample Smartphone. Could you provide more details?",
				ru: 'Привет! Меня интересует аренда образца смартфона. Можете предоставить больше деталей?'
			})
		}

		const product = await databases.createDocument(
			config.databaseId,
			config.productsCollectionId,
			ID.unique(),
			productData
		)

		console.log('Product created successfully:', product.$id)
		return product.$id
	} catch (error) {
		console.error('Error creating product:', error)
		return null
	}
}

async function main() {
	console.log('Starting sample product creation...')
	console.log('Configuration:', {
		endpoint: config.endpoint,
		projectId: config.projectId,
		databaseId: config.databaseId,
		bucketId: config.bucketId
	})

	try {
		// Step 1: Upload sample image
		const imageId = await uploadSampleImage()

		// Step 2: Create or get category
		const categoryId = await createSampleCategory()

		if (!categoryId) {
			console.error('Failed to create or find category. Aborting.')
			return
		}

		// Step 3: Create sample product
		const productId = await createSampleProduct(categoryId, imageId)

		if (productId) {
			console.log('✅ Sample product created successfully!')
			console.log('Product ID:', productId)
			console.log('Category ID:', categoryId)
			if (imageId) {
				console.log('Image ID:', imageId)
			}
		} else {
			console.log('❌ Failed to create sample product')
		}
	} catch (error) {
		console.error('Error in main process:', error)
	}
}

// Run the script
main().catch(console.error)
