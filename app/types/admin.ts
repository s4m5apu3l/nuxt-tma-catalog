export interface AdminUser {
	$id: string
	email: string
	name: string
	role: 'admin' | 'superadmin'
	isActive: boolean
	createdAt: string
}

export interface LoginCredentials {
	email: string
	password: string
}

export interface AdminSession {
	$id: string
	userId: string
	expire: string
	provider: string
	providerUid: string
	providerAccessToken: string
	providerAccessTokenExpiry: string
	providerRefreshToken: string
	ip: string
	osCode: string
	osName: string
	osVersion: string
	clientType: string
	clientCode: string
	clientName: string
	clientVersion: string
	clientEngine: string
	clientEngineVersion: string
	deviceName: string
	deviceBrand: string
	deviceModel: string
	countryCode: string
	countryName: string
	current: boolean
}
