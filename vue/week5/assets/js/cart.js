import { detailComponent } from './detail-modal.js';
import { successComponent } from './success-modal.js';
import { dangerComponent } from './danger-modal.js';

const api = {
	url: 'https://vue3-course-api.hexschool.io/v2',
	path: 'ujhwang'
}

let productDetailModal = null;
let successModal = null;
let dangerModal = null;

const app = {
	data() {
		return {
			add: {
				loading: false
			},
			remove: {
				loading: false
			},
			modal: {
				title: '',
				content: '',
				temp: {}
			},
			products: {},
			carts: {},
			qty: 1,
			order: {
				data: {
					user: {
						name: null,
						email: null,
						tel: null,
						address: null,
					},
					message: null
				}
			}
		}
	},
	components: {
		detailComponent,
		successComponent,
		dangerComponent
	},
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

		this.getProducts()
		this.getCart()
	},
	methods: {
		getProducts() {
			const productsUrl = `${api.url}/api/${api.path}/products/all`;
			axios.get(productsUrl)
				.then((response) => {
					// console.log(response);
					this.products = response.data.products;
				})
				.catch((error) => {
					console.dir(error);
					alert(error.response.data.message)
				})
		},
		getCart() {
			const cartUrl = `${api.url}/api/${api.path}/cart`;
			axios.get(cartUrl)
				.then((response) => {
					// console.log(response);
					this.carts = response.data.data;
				})
				.catch((error) => {
					console.dir(error);
					alert(error.response.data.message)
				})
		},
		addCart(id) {
			const data = {
				product_id: id,
				qty
			}
			const cartUrl = `${api.url}/api/${api.path}/cart`;
			axios.post(cartUrl, { data })
				.then((response) => {
					this.getCart()
				})
				.catch((error) => {
					console.dir(error);
					if ( title === '新增購物車' ) {
						this.modal.title = '新增失敗'
					} else if ( title === '編輯購物車' ) {
						this.modal.title = '修改失敗'
					}
					this.modal.content = error.response.data.message
					dangerModal.show();
				})
		},
		openProductDetailModal(product) {
			// 淺拷貝：不影響原始資料（不小心按到取消也不會影響料表）
			this.modal.temp = { ...product };
			productDetailModal.show();
		},
		openSuccessModal() {
			successModal.show();
		},
		openDangerModal(product) {
			this.modal.temp = product;
			dangerModal.show();
		},
	},
	computed: {
		toNumber: function () {
			return function (val) {
				return Number.parseInt(val)
			}
		},
	}
}

Vue.createApp(app).mount('#app')
