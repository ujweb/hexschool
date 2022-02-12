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
				<h2 class="mb-2">刪除產品</h2>
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
					@click="deleteProduct(modal.temp); clearTemp();"
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
		dangerModal = new bootstrap.Modal(document.getElementById('dangerModal'), {
			keyboard: false
		});
	},
	methods: {
		deleteProduct(product) {
			// console.log(product.id);
			const id = product.id;
			const adminProductUrl = `${api.url}/api/${api.path}/admin/product/${id}`;
			axios.delete(adminProductUrl)
				.then((response) => {
					// console.log(response);
					this.modal.title = '刪除成功'
					this.modal.content = response.data.message;
					dangerModal.hide();
                    this.$emit('emit-delete');
                    this.$emit('emit-open-success');
				})
				.catch((error) => {
					console.dir(error);
					this.modal.title = '系統錯誤'
					this.modal.content = error.response.data.message
				})
		},
		clearTemp() {
			this.modal.temp = {}
		},
	},
}
