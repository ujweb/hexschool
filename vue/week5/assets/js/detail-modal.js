const api = {
	url: 'https://vue3-course-api.hexschool.io/v2',
	path: 'ujhwang'
}

let productDetailModal = null;
let successModal = null;
let dangerModal = null;

// 分頁元件
export const detailComponent = {
	props: ['modal', 'loading'],
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
					<button type="button" class="btn btn-xs fs-6 p-0" data-bs-dismiss="modal" aria-label="Close" @click="modal.qty = 1">
						<span class="d-block material-icons">close</span>
					</button>
				</div>
				<form>
					<div class="row align-items-start">
						<div class="aside col-xl-5 col-lg-6">
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
									<p class="text-pre-line">
										{{ modal.temp.description }}
									</p>
								</div>
								<div class="col-lg-12 mt-1">
									<h4>說明內容</h4>
									<p class="text-pre-line">
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
										<select class="form-select" v-model.number="modal.qty">
											<option
												v-for="number in 30"
												:value="number"
												:selected="modal.qty"
												:key="modal.temp.id + number"
											>
												{{ number }}
											</option>
										</select>
										<button type="button" class="btn btn-primary" @click="$emit('emit-cart');">
											<div v-if="loading === modal.temp.id" class="spinner-border spinner-border-sm" role="status">
												<span class="visually-hidden">Loading...</span>
											</div>
											加入購物車
										</button>
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
	}
}
