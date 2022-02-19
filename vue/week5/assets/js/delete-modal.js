const api = {
	url: 'https://vue3-course-api.hexschool.io/v2',
	path: 'ujhwang'
}

let successModal = null;
let dangerModal = null;

export const deleteComponent = {
	props: ['modal', 'loading'],
	template: `<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
		<div class="modal-content">
			<div class="modal-body p-3">
				<h2 class="mb-2">{{ modal.title }}</h2>
				<p>
					是否刪除 <b class="text-danger">{{ modal.temp.title }}</b><br />
					提醒您，刪除後將無法恢復
				</p>
				<div class="d-flex align-items-center justify-content-end mt-2">
					<button
						type="button"
						class="btn btn-outline-danger me-1"
						data-bs-dismiss="modal"
						@click="clearTemp();"
					>
						取消
					</button>
					<button
						type="button"
						class="btn btn-danger"
						data-bs-dismiss="modal"
						@click="$emit('emit-delete');"
					>
						確認
					</button>
				</div>
			</div>
		</div>
	</div>`,
	data() {
		return {
		};
	},
	mounted() {
		successModal = new bootstrap.Modal(document.getElementById('successModal'));
		dangerModal = new bootstrap.Modal(document.getElementById('dangerModal'));
	},
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
