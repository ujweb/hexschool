const api = {
	url: 'https://vue3-course-api.hexschool.io/v2',
	path: 'ujhwang'
}

let productDetailModal = null;
let successModal = null;
let dangerModal = null;

// 分頁元件
export const detailComponent = {
	props: ['modal'],
	template: `<div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
		<div class="modal-content">
		<div class="modal-body p-3">
			<div class="d-flex align-items-center justify-content-between mb-2">
			<div class="d-flex align-items-center mb-0">
				<h2 class="h1 my-0">
				{{ modal.temp.title }}
				</h2>
				<span class="badge bg-primary rounded-pill ms-1">{{ modal.temp.category }}</span>
			</div>
			<button type="button" class="btn btn-xs fs-6 p-0" data-bs-dismiss="modal" aria-label="Close">
				<span class="d-block material-icons">close</span>
			</button>
			</div>
			<form>
			<div class="row">
				<div class="col-xl-5 col-lg-6">
				<img
					v-if="modal.temp.imageUrl"
					class="img-fluid"
					:src="modal.temp.imageUrl"
					alt=""
				/>
				</div>
				<div class="col-xl-7 col-lg-6">
				<div class="row">
					<div class="col-lg-12 mt-lg-0 mt-3">
					<h4>產品描述</h4>
					<p>
						{{ modal.temp.description }}
					</p>
					</div>
					<div class="col-lg-12 mt-1">
					<h4>說明內容</h4>
					<p>
						{{ modal.temp.content }}
					</p>
					</div>
				</div>
				</div>
				<div class="col-lg-12">
				<div class="row">
					<div class="col-12 mt-1">
					<hr class="bg-secondary">
					</div>
					<div class="col-xl-8 col-lg-6 mt-1">
					<del class="fs6 mb-0 text-secondary">原價：{{ modal.temp.origin_price }}</del>
					<div class="d-flex align-items-baseline">
						<h2 class="text-primary mb-0">特價：{{ modal.temp.price }}</h2>
						<span>&nbsp;/&nbsp;{{ modal.temp.unit }}</span>
					</div>
					</div>
					<div class="col-xl-4 col-lg-6 mt-lg-1 mt-2">
					<div class="input-group">
						<select class="form-select" v-model="qty">
						<option
							v-for="number in 10"
							:value="number"
							:selected="qty"
							:key="modal.temp.id + number">{{ number }}</option>
						</select>
						<button type="button" class="btn btn-primary" @click="addToCart(modal.temp.id)">加入購物車</button>
					</div>
					</div>
				</div>
				</div>
			</div>
			</form>
		</div>
		</div>
	</div>`,
	mounted() {
		productDetailModal = new bootstrap.Modal(document.getElementById('productDetailModal'), {
			keyboard: false,
			backdrop: 'static',
		});
		successModal = new bootstrap.Modal(document.getElementById('successModal'), {
			keyboard: false
		});
		dangerModal = new bootstrap.Modal(document.getElementById('dangerModal'), {
			keyboard: false
		});
	},
	methods: {
		updateProduct(title) {

			const id = this.modal.temp.id;
			const dataProduct = {
				data: this.modal.temp
			};

			let adminProductUrl = null;
			let method = null;
			if ( title === '新增產品' ) {
				adminProductUrl = `${api.url}/api/${api.path}/admin/product`;
				method = 'post';
			} else if ( title === '編輯產品' ) {
				adminProductUrl = `${api.url}/api/${api.path}/admin/product/${id}`;
				method = 'put';
			}
			axios[method](adminProductUrl, dataProduct)
				.then(response => {
					// console.log(response);
					if ( title === '新增產品' ) {
						this.modal.title = '新增成功'
					} else if ( title === '編輯產品' ) {
						this.modal.title = '修改成功'
					}
					this.modal.content = response.data.message;
					this.modal.temp = {}
					this.$emit('emit-product');
					successModal.show();
				})
				.catch((error) => {
					console.dir(error);
					if ( title === '新增產品' ) {
						this.modal.title = '新增失敗'
					} else if ( title === '編輯產品' ) {
						this.modal.title = '修改失敗'
					}
					this.modal.content = error.response.data.message
					dangerModal.show();
				})
		},
		uploadImage(e) {
			// console.log(e);
			// console.log(e.target.parentElement.previousElementSibling.children[0]);

			const index = e.target.dataset.index;
			const type = e.target.dataset.type;
			const file = e.target.files[0];
			// console.dir(file);

			const formData = new FormData();
			formData.append('file-to-upload', file);
			// 使用 file-to-upload 是因為 Api 所需

			axios.post(`${api.url}/api/${api.path}/admin/upload`, formData)
				.then(response => {
					// console.log(response.data.imageUrl);
					if ( type === 'main' ) {
						this.modal.temp.imageUrl = response.data.imageUrl
					} else if ( type === 'sub' ) {
						this.modal.temp.imagesUrl[index] = response.data.imageUrl
					}
				})
				.catch((error) => {
					console.dir(error);
				})
		},
	}
}
