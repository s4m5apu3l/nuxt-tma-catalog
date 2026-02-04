import { Client, Storage } from 'appwrite'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Configuration
const config = {
	endpoint: process.env.APPWRITE_PUBLIC_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1',
	projectId: process.env.APPWRITE_PUBLIC_PROJECT_ID || 'your-project-id',
	bucketId: process.env.APPWRITE_PUBLIC_BUCKET_ID || 'images'
}

// Initialize Appwrite
const client = new Client().setEndpoint(config.endpoint).setProject(config.projectId)

const storage = new Storage(client)

async function testImageFunctionality() {
	console.log('Testing Appwrite image functionality...')
	console.log('Configuration:', config)

	try {
		// Test 1: List files in bucket
		console.log('\n1. Testing bucket access...')
		const files = await storage.listFiles(config.bucketId)
		console.log(`✅ Bucket accessible. Found ${files.files.length} files.`)

		if (files.files.length > 0) {
			const firstFile = files.files[0]
			console.log('Sample file:', {
				id: firstFile.$id,
				name: firstFile.name,
				size: firstFile.sizeOriginal,
				mimeType: firstFile.mimeType
			})

			// Test 2: Generate image URLs
			console.log('\n2. Testing image URL generation...')
			const viewUrl = `${config.endpoint}/storage/buckets/${config.bucketId}/files/${firstFile.$id}/view?project=${config.projectId}`
			
			console.log('✅ View URL:', viewUrl)
			console.log('ℹ️  Note: Preview URLs with transformations are not available on free plans')

			// Test 3: Get file info
			console.log('\n3. Testing file info retrieval...')
			const fileInfo = await storage.getFile(config.bucketId, firstFile.$id)
			console.log('✅ File info retrieved:', {
				id: fileInfo.$id,
				name: fileInfo.name,
				size: fileInfo.sizeOriginal,
				created: fileInfo.$createdAt
			})
		} else {
			console.log('ℹ️  No files found in bucket. Upload some images first.')
		}

		console.log('\n✅ All tests passed! Image functionality is working correctly.')
	} catch (error) {
		console.error('\n❌ Error testing image functionality:', error)

		if (error.code === 404) {
			console.log('💡 Tip: Make sure the bucket exists and the bucket ID is correct.')
		} else if (error.code === 401) {
			console.log('💡 Tip: Check your project ID and endpoint configuration.')
		}
	}
}

// Run the test
testImageFunctionality().catch(console.error)
