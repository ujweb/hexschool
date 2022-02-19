const api = {
	url: 'https://vue3-course-api.hexschool.io/v2',
	path: 'ujhwang'
}

let dangerModal = null;

// 危險（刪除、錯誤）訊息 modal
export const dangerComponent = {
	props: ['modal'],
	template: `<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
		<div class="modal-content">
			<div class="modal-body p-3">
				<h2 class="mb-2">{{ modal.title }}</h2>
				<p v-html="modal.content"></p>
				<div class="d-flex align-items-center justify-content-end mt-2">
					<button
						type="button"
						class="btn btn-danger"
						data-bs-dismiss="modal"
						@click="clearTemp();"
					>
						我知道了
					</button>
				</div>
			</div>
		</div>
	</div>`,
	methods: {
		clearTemp() {
			this.modal.temp = {
				product: {
					title: ''
				}
			}
		},
	},
}
