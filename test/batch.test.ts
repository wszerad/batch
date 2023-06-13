import { getCategoriesByNames, getMainCategoryNames, getImageList, ExpandedCategory, Category } from './data'
import { BatchModel } from '../src/BatchModel'

describe('case circular', () => {

	it('should fail in loop', async () => {
		const imageBatch = new BatchModel<string, string | null>(async (names) => {
			const nameList = await getImageList()
			return names.map(name => nameList.includes(`/img/${name}`) ? `/img/${name}` : null)
		})

		const categoryBatch = new BatchModel<string, ExpandedCategory, Category>(
			getCategoriesByNames,
			async (input, { jobs }) => {
				return {
					...input,
					subcategories: await jobs(input.subcategories),
					image: await imageBatch.job(input.name)
				}
			}
		)
		
		const names = await getMainCategoryNames()

		const categories = categoryBatch.jobs(names)
		categoryBatch.release([imageBatch])


		expect(await categories).toBe([])
	})
})