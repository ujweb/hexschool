import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';

import { pagination } from './pagination.js';
import { productComponent } from './product-modal.js';
import { successComponent } from './success-modal.js';
import { dangerComponent } from './danger-modal.js';

const api = {
	url: 'https://vue3-course-api.hexschool.io/v2',
	path: 'ujhwang'
}

let productModal = null;
let successModal = null;
let dangerModal = null;

const app = createApp({
	data() {
		return {
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
	components: {
		pagination,
		productComponent,
		successComponent,
		dangerComponent
	},
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

		const token = document.cookie.replace(/(?:(?:^|.*;\s*)signinToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
		axios.defaults.headers.common.Authorization = token;
		this.checkSignin();
	},
	methods: {
		checkSignin() {
			const checkUserApi = `${api.url}/api/user/check`
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
		getProduct(page = 1) {
			const adminProductsUrl = `${api.url}/api/${api.path}/admin/products?page=${page}`;
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
		toggleEnabled(product) {
			const id = product.id;
			const adminProductUrl = `${api.url}/api/${api.path}/admin/product/${id}`;
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
					successModal.show();
				})
				.catch((error) => {
					console.dir(error);
					this.modal.title = '修改失敗'
					this.modal.content = error.response.data.message
					dangerModal.show();
				})
		},
		openProductModal(title, product) {
			// 淺拷貝：不影響原始資料（不小心按到取消也不會影響料表）
			this.modal.temp = { ...product };
			productModal.show();
		},
		openSuccessModal() {
			successModal.show();
		},
		openDangerModal(product) {
			this.modal.temp = product;
			dangerModal.show();
		},
		logout() {
			const logoutUrl = `${api.url}/logout`;
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
