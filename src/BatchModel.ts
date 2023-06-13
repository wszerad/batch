export type Processor<I, O> = (jobs: I[]) => Promise<O[]>
export type PostProcessor<I, O, P> = (input: P, recurrent: BatchModel<I, O, P>) => Promise<O>

export class BatchModel<I, O, P = any> {
	name: string = ''
	private process: Promise<O[]> = Promise.resolve([])
	private resolve: (output: O[]) => void = () => {}
	private reject: (error: Error) => void = () => {}
	private input: I[] = []

	constructor(
		private batchProcess: Processor<I, P>,
		private postProcess: PostProcessor<I, O, P> = (item) => item as Promise<O>
	) {
	}

	private init() {
		this.process = new Promise<O[]>((res, rej) => {
			this.resolve = res
			this.reject = rej
		})
	}

	job = (job: I) => {
		if (!this.input.length) {
			this.init()
		}

		const index = this.input.push(job) - 1

		return this.process.then(data => data[index])
	}

	jobs = (jobs: I[]) => {
		if (!jobs.length) {
			return Promise.resolve([])
		}

		if (!this.input.length) {
			this.init()
		}

		const startIndex = this.input.length
		const endIndex = this.input.push(...jobs) + 1
		return this.process.then(data => data.slice(startIndex, endIndex))
	}

	async release(dependencies?: BatchModel<any, any>[]): Promise<void> {
		const items = this.input.splice(0, this.input.length)
		const res = this.resolve
		const rej = this.reject

		await this.batchProcess(items)
			.then(async data => {
				const results = Promise.all(
					data.map(item => this.postProcess(item, this))
				)

				await Promise.all(
					dependencies?.map(dep => dep.release()) || []
				)

				if (this.input.length) {
					await this.release(dependencies)
				}

				res(await results)
				return results
			})
			.catch(err => rej(err))
	}
}