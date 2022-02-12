import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';

let productModal = null;
let successModal = null;
let errorModal = null;

const app = createApp({
	data() {
		return {
			api: {
				url: 'https://vue3-course-api.hexschool.io/v2',
				path: 'ujhwang'
			},
			page: 1,
			products: [],
			paginations: {},
			loaded: false,
			modal: {
				title: '',
				content: '',
				temp: {}
			},
		}
	},
	mounted() {

		productModal = new bootstrap.Modal(document.getElementById('productModal'), {
			keyboard: false,
			backdrop: 'static',
		});

		successModal = new bootstrap.Modal(document.getElementById('successModal'), {
			keyboard: false
		});

		errorModal = new bootstrap.Modal(document.getElementById('errorModal'), {
			keyboard: false
		});

		const token = document.cookie.replace(/(?:(?:^|.*;\s*)signinToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
		axios.defaults.headers.common.Authorization = token;
		this.page = parseInt(new URL(window.location.href).searchParams.get('page'));
		this.checkSignin();
	},
	methods: {
		checkSignin() {
			const checkUserApi = `${this.api.url}/api/user/check`
			axios.post(checkUserApi)
				.then((response) => {
					// console.log(response);
					this.getProduct();
				})
				.catch((error) => {
					console.dir(error);
					alert(error.response.data.message)
					window.location = 'index.html'; // 錯誤返回登入首頁
				})
		},
		getProduct() {
			const adminProductsUrl = `${this.api.url}/api/${this.api.path}/admin/products?page=${this.page}`;
			axios.get(adminProductsUrl)
				.then((response) => {
					// console.log(response);
					this.paginations = response.data.pagination
					this.products = response.data.products
					this.loaded = true
				})
				.catch((error) => {
					console.dir(error);
					alert(error.response.data.message)
					window.location = 'index.html'; // 錯誤返回登入首頁
				})
		},
		updateProduct(title, product) {

			const id = this.modal.temp.id;
			const dataProduct = {
				data: this.modal.temp
			};

			let adminProductUrl = null;
			let method = null;
			if ( title === '新增產品' ) {
				adminProductUrl = `${this.api.url}/api/${this.api.path}/admin/product`;
				method = 'post';
			} else if ( title === '編輯產品' ) {
				adminProductUrl = `${this.api.url}/api/${this.api.path}/admin/product/${id}`;
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
					this.clearTemp();
					this.getProduct();
					this.openSuccessModal();
				})
				.catch((error) => {
					console.dir(error);
					if ( title === '新增產品' ) {
						this.modal.title = '新增失敗'
					} else if ( title === '編輯產品' ) {
						this.modal.title = '修改失敗'
					}
					this.modal.content = error.response.data.message
					errorModal.show();
				})
		},
		toggleEnabled(product) {
			const id = product.id;
			const adminProductUrl = `${this.api.url}/api/${this.api.path}/admin/product/${id}`;
			this.modal.temp = product;

			const dataProduct = {
				data: this.modal.temp
			};

			if ( this.modal.temp.is_enabled === 0 || this.modal.temp.is_enabled === undefined ) {
				this.modal.temp.is_enabled = 1
			} else if ( this.modal.temp.is_enabled === 1 ) {
				this.modal.temp.is_enabled = 0
			}
			axios.put(adminProductUrl, dataProduct)
				.then(response => {
					// console.log(response);
					this.modal.title = '修改成功'
					this.modal.content = response.data.message;
					this.getProduct();
					this.openSuccessModal();
				})
				.catch((error) => {
					console.dir(error);
					this.modal.title = '修改失敗'
					this.modal.content = error.response.data.message
					errorModal.show();
				})
		},
		deleteProduct(product) {
			// 刪除功能
			// console.log(product.id);
			const id = product.id;
			const adminProductUrl = `${this.api.url}/api/${this.api.path}/admin/product/${id}`;
			axios.delete(adminProductUrl)
				.then((response) => {
					// console.log(response);
					this.modal.title = '刪除成功'
					this.modal.content = response.data.message;
					this.closeModal();
					this.openSuccessModal();
					this.getProduct();
				})
				.catch((error) => {
					console.dir(error);
					this.modal.title = '系統錯誤'
					this.modal.content = error.response.data.message
					this.openErrorModal();
				})
		},
		openProductModal(title, product) {
			// 淺拷貝：不影響原始資料（不小心按到取消也不會影響料表）
			this.modal.temp = { ...product };
			productModal.show();
		},
		openErrorModal(product) {
			this.modal.temp = product;
			errorModal.show();
		},
		openSuccessModal() {
			successModal.show();
		},
		closeModal() {
			productModal.hide();
			successModal.hide();
			errorModal.hide();
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
		clearTemp() {
			this.modal.temp = {}
		},
		logout() {
			const logoutUrl = `${this.api.url}/logout`;
			axios.post(logoutUrl)
				.then((response) => {
					window.location = 'index.html'; // 登出成功後返回登入首頁
				})
				.catch((error) => {
					console.dir(error);
					alert(error.response.data.message)
				})
		}
	}
})
app.mount('#app')
