export interface Category {
	name: string
	level: number
	subcategories: string[]
}

export interface ExpandedCategory {
	name: string
	level: number
	image: string | null
	subcategories: ExpandedCategory[]
}

const categories: Category[] = [
	{
		name: 'category-1',
		level: 0,
		subcategories: [
			'sub-category-1'
		]
	},
	{
		name: 'category-2',
		level: 0,
		subcategories: [
			'sub-category-1',
			'sub-category-2'
		]
	},
	{
		name: 'category-3',
		level: 0,
		subcategories: [
			'sub-category-3',
			'sub-category-4',
			'sub-category-5'
		]
	},
	{
		name: 'sub-category-1',
		level: 1,
		subcategories: [
			'sub-sub-category-5'
		]
	},
	{
		name: 'sub-category-2',
		level: 1,
		subcategories: [
			'sub-sub-category-4'
		]
	},
	{
		name: 'sub-category-3',
		level: 1,
		subcategories: [
			'sub-sub-category-3'
		]
	},
	{
		name: 'sub-category-4',
		level: 1,
		subcategories: [
			'sub-sub-category-2'
		]
	},
	{
		name: 'sub-category-5',
		level: 1,
		subcategories: [
			'sub-sub-category-1'
		]
	},
	{
		name: 'sub-sub-category-1',
		level: 2,
		subcategories: []
	},
	{
		name: 'sub-sub-category-2',
		level: 2,
		subcategories: []
	},
	{
		name: 'sub-sub-category-3',
		level: 2,
		subcategories: []
	},
	{
		name: 'sub-sub-category-4',
		level: 2,
		subcategories: []
	},
	{
		name: 'sub-sub-category-5',
		level: 2,
		subcategories: []
	},
]

const images = [
	'/img/category-1',
	'/img/category-2',
	'/img/sub-category-1',
	'/img/sub-category-2',
	'/img/sub-category-4',
	'/img/sub-category-5',
	'/img/sub-sub-category-3',
]

const sleep = () => {
	return new Promise((res) => {
		setTimeout(res, 50)
	})
}

export const getMainCategoryNames = async () => {
	await sleep()
	return categories
		.filter(item => item.level === 0)
		.map(item => item.name)
}

export const getCategoriesByNames = async (names: string[]) => {
	await sleep()
	return categories.filter(item => names.includes(item.name))
}

export const getImageList = async () => {
	await sleep()
	return images
}