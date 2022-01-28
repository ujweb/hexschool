import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';
const app = createApp({
	data() {
		return {
			api: {
				url: 'https://vue3-course-api.hexschool.io/v2',
				path: 'ujhwang'
			},
			products: [],
			loaded: false,
			modal: {
				title: '',
				content: ''
			},
			temp: {
				// id: null,
				// title: null,
				// category: null,
				// unit: null,
				// origin_price: null,
				// price: null,
				// description: null,
				// content: null,
				// is_enabled: 1,
				// imageUrl: null,
				// imagesUrl: [],
			},
		}
	},
	mounted() {
		const token = document.cookie.replace(/(?:(?:^|.*;\s*)signinToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
		axios.defaults.headers.common.Authorization = token;
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
			const adminProductsUrl = `${this.api.url}/api/${this.api.path}/admin/products`;
			axios.get(adminProductsUrl)
				.then((response) => {
					// console.log(response.data);
					this.products = response.data.products
					this.loaded = true
				})
				.catch((error) => {
					console.dir(error);
					alert(error.response.data.message)
					window.location = 'index.html'; // 錯誤返回登入首頁
				})
		},
		addProduct() {
			const adminProductUrl = `${this.api.url}/api/${this.api.path}/admin/product`;
			const product = {
				data: this.temp
			};
			axios.post(adminProductUrl, product)
				.then((response) => {
					// console.log(response);
					this.products = response.data.products
					this.modal.title = '建立成功'
					this.modal.content = response.data.message;
					this.returnModal();
					this.getProduct();
				})
				.catch((error) => {
					console.dir(error);
				})
		},
		deleteProduct() {
			// 刪除功能
			const id = this.temp.id;
			const adminProductUrl = `${this.api.url}/api/${this.api.path}/admin/product/${id}`;
			axios.delete(adminProductUrl)
				.then((response) => {
					// console.log(response);
					this.modal.title = '刪除成功'
					this.modal.content = response.data.message;
					this.returnModal();
					this.getProduct();
				})
				.catch((error) => {
					console.dir(error);
					this.modal.title = '系統錯誤'
					this.modal.content = error.response.data.message
				})
		},
		editProduct() {
			const id = this.temp.id;
			const adminProductUrl = `${this.api.url}/api/${this.api.path}/admin/product/${id}`;
			const product = {
				data: JSON.parse(JSON.stringify(this.temp))
			};
			axios.put(adminProductUrl, product)
				.then(response => {
					// console.log(response);
					this.modal.title = '修改成功'
					this.modal.content = response.data.message;
					this.returnModal();
					this.getProduct();
				})
				.catch((error) => {
					console.dir(error);
				})
		},
		toggleEnabled() {
			const id = this.temp.id;
			const adminProductUrl = `${this.api.url}/api/${this.api.path}/admin/product/${id}`;
			
			if ( this.temp.is_enabled === 0 || this.temp.is_enabled === undefined ) {
				this.temp.is_enabled = 1
			} else if ( this.temp.is_enabled === 1 ) {
				this.temp.is_enabled = 0
			}
			const product = {
				data: JSON.parse(JSON.stringify(this.temp))
			};
			axios.put(adminProductUrl, product)
				.then(response => {
					// console.log(response);
					this.modal.title = '修改成功'
					this.modal.content = response.data.message;
					this.returnModal();
					this.getProduct();
				})
				.catch((error) => {
					console.dir(error);
				})
		},
		addImage() {
			if ( this.temp.imagesUrl === undefined ) {
				// 沒有 imagesUrl，先給空陣列
				this.temp.imagesUrl = [];
			}
			// 新增一筆空白資料，讓欄位先出來
			this.temp.imagesUrl.push('');
		},
		removeImage() {
			this.temp.imagesUrl.pop();
		},
		clearTemp() {
			this.temp = {}
		},
		returnModal() {
			const returnModal = new bootstrap.Modal(document.getElementById('returnModal'));
			returnModal.show();
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
