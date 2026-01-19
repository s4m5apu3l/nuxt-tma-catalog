import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useProducts } from '~/composables/useProducts'

// Mock Appwrite databases and storage
const mockDatabases = {
  listDocuments: vi.fn(),
  getDocument: vi.fn(),
  createDocument: vi.fn(),
  updateDocument: vi.fn(),
  deleteDocument: vi.fn()
}

const mockStorage = {
  createFile: vi.fn(),
  deleteFile: vi.fn(),
  getFileView: vi.fn()
}

// Mock Appwrite config
const mockAppwriteConfig = {
  databaseId: 'test-db',
  categoriesCollectionId: 'test-categories',
  productsCollectionId: 'test-products',
  storageBucketId: 'test-storage'
}

// Mock the appwrite utils
vi.mock('~/utils/appwrite', () => ({
  databases: mockDatabases,
  storage: mockStorage,
  appwriteConfig: mockAppwriteConfig
}))

// Mock Appwrite Query and ID
vi.mock('appwrite', () => ({
  Query: {
    orderDesc: