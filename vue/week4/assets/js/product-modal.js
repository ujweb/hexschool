const api = {
	url: 'https://vue3-course-api.hexschool.io/v2',
	path: 'ujhwang'
}

let productModal = null;
let successModal = null;
let dangerModal = null;

// 分頁元件
export const productComponent = {
	props: ['modal'],
	template: `<div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
		<div class="modal-content">
			<div class="modal-body p-3">
				<h2 class="mb-2">{{ modal.title }}</h2>
				<form>
					<div class="row">
					<div class="col-md-8">
						<div class="row">
						<div class="col-md-5">
							<div class="form-floating mb-2">
								<input
									type="text"
									class="form-control border-0 border-bottom border-secondary"
									id="floatingTitle"
									placeholder="請輸入標題"
									v-model="modal.temp.title"
								/>
								<label for="floatingTitle">請輸入標題</label>
							</div>
							<div class="form-floating mb-2">
								<input
									type="text"
									class="form-control border-0 border-bottom border-secondary"
									id="floatingCategory"
									placeholder="請輸入分類"
									v-model="modal.temp.category"
								/>
								<label for="floatingCategory">請輸入分類</label>
							</div>
							<div class="form-floating mb-2">
								<input
									type="text"
									class="form-control border-0 border-bottom border-secondary"
									id="floatingUnit"
									placeholder="請輸入單位"
									v-model="modal.temp.unit"
								/>
								<label for="floatingUnit">請輸入單位</label>
							</div>
							<div class="form-floating mb-2">
								<input
									type="number"
									class="form-control border-0 border-bottom border-secondary"
									id="floatingOrigin"
									placeholder="請輸入原價"
									v-model="modal.temp.origin_price"
								/>
								<label for="floatingOrigin">請輸入原價</label>
							</div>
							<div class="form-floating mb-2">
								<input
									type="number"
									class="form-control border-0 border-bottom border-secondary"
									id="floatingSelling"
									placeholder="請輸入售價"
									v-model="modal.temp.price"
								/>
								<label for="floatingSelling">請輸入售價</label>
							</div>
						</div>
						<div class="col-md-7">
							<div class="row mx-auto">
								<div class="col-md-8 px-0 form-floating mb-2" :class="{ 'col-md-12': modal.temp.imageUrl }">
									<input
										type="text"
										class="form-control border-0 border-bottom border-secondary"
										id="floatingMainPic"
										v-model="modal.temp.imageUrl"
										placeholder="請輸入主圖網址或上傳圖片"
									/>
									<label for="floatingMainPic">請輸入主圖網址或上傳圖片</label>
								</div>
								<div class="col-md-4 py-1 pe-0 mb-2 position-relative" v-show="!modal.temp.imageUrl">
									<button
										class="d-block w-100 h-100 btn btn-sm btn-light"
										type="button"
									>
										上傳圖片
									</button>
									<input
										type="file"
										class="d-block w-100 h-100 position-absolute top-0 start-0 opacity-0"
										id="file"
										placeholder="上傳圖片"
										data-type="main"
										@change="uploadImage"
									/>
								</div>
							</div>
							<img
								v-if="modal.temp.imageUrl"
								class="img-fluid"
								:src="modal.temp.imageUrl"
								alt=""
							/>
						</div>
						<div class="col-md-12">
							<div class="form-floating mb-2">
								<textarea
									class="form-control border-0 border-bottom border-secondary"
									placeholder="Leave a comment here"
									id="floatingDescription"
									style="height: 100px"
									v-model="modal.temp.description"
								></textarea>
								<label for="floatingDescription">請輸入產品描述</label>
							</div>
							<div class="form-floating mb-2">
								<textarea
									class="form-control border-0 border-bottom border-secondary"
									placeholder="Leave a comment here"
									id="floatingContent"
									style="height: 100px"
									v-model="modal.temp.content"
								></textarea>
								<label for="floatingContent">請輸入說明內容</label>
							</div>
							<div class="form-check mb-2">
								<input
									class="form-check-input"
									type="checkbox"
									value="is_enabled"
									id="checkEnable"
									v-model.number="modal.temp.is_enabled"
									:true-value="1"
									:false-value="0"
								/>
								<label class="form-check-label" for="checkEnable">
									是否啟用
								</label>
							</div>
						</div>
						</div>
					</div>
					<div class="col-md-4">
						<h3 class="mb-2">多圖新增</h3>
						<div class="row">
							<div class="col-12 mb-2" v-for="(image, index) in modal.temp.imagesUrl" :key="index">
								<div class="row mx-auto">
									<div class="col-md-8 px-0 form-floating mb-2" :class="{ 'col-md-12': image }">
										<input
											type="text"
											class="form-control border-0 border-bottom border-secondary"
											:id="'floatingPic' + index"
											v-model="modal.temp.imagesUrl[index]"
											placeholder="請輸入網址或上傳圖片"
										/>
										<label :for="'floatingPic' + index">請輸入網址或上傳圖片</label>
									</div>
									<div class="col-md-4 py-1 pe-0 mb-2 position-relative" v-show="!image">
										<button
											class="d-block w-100 h-100 btn btn-sm btn-light"
											type="button"
										>
											上傳圖片
										</button>
										<input
											type="file"
											class="d-block w-100 h-100 position-absolute top-0 start-0 opacity-0"
											id="file"
											placeholder="上傳圖片"
											:data-index="index"
											data-type="sub"
											@change="uploadImage"
										/>
									</div>
								</div>
								<img
									class="img-fluid"
									v-show="image"
									:src="image"
									alt=""
								/>
							</div>
						</div>
						<button
							class="d-block w-100 btn btn-sm btn-primary mb-2"
							type="button"
							v-if="!modal.temp.imagesUrl?.length || modal.temp.imagesUrl[modal.temp.imagesUrl.length - 1]"
							@click="addImage"
						>
							新增圖片
						</button>
						<button
							class="d-block w-100 btn btn-sm btn-outline-danger mb-2"
							type="button"
							v-else
							@click="removeImage"
						>
							刪除圖片
						</button>
					</div>
					</div>
					<div class="d-flex align-items-center justify-content-end mt-2">
						<button type="button" class="btn btn-outline-primary me-1" data-bs-dismiss="modal">取消</button>
						<button
							type="button"
							class="btn btn-primary"
							data-bs-dismiss="modal"
							@click="updateProduct(modal.title);"
						>
							確認
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>`,
	mounted() {
		productModal = new bootstrap.Modal(document.getElementById('productModal'), {
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
		addImage() {
			if ( this.modal.temp.imagesUrl === undefined ) {
				// 沒有 imagesUrl，先給空陣列
				this.modal.temp.imagesUrl = [];
			}
			// 新增一筆空白資料，讓欄位先出來
			this.modal.temp.imagesUrl.push('');
		},
		removeImage() {
			this.modal.temp.imagesUrl.pop();
		},
	}
}
