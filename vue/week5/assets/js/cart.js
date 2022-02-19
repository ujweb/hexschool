import { detailComponent } from './detail-modal.js';
import { deleteComponent } from './delete-modal.js';
import { successComponent } from './success-modal.js';
import { dangerComponent } from './danger-modal.js';

Object.keys(VeeValidateRules).forEach(rule => {
    if (rule !== 'default') {
        VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
});

VeeValidateI18n.loadLocaleFromURL("assets/js/zh_TW.json");
// Activate the locale
VeeValidate.configure({
	generateMessage: VeeValidateI18n.localize('zh_TW'),
	validateOnInput: false, // 調整為輸入字元立即進行驗證
});


const api = {
	url: 'https://vue3-course-api.hexschool.io/v2',
	path: 'ujhwang'
}

let productDetailModal = null;
let deleteModal = null;
let successModal = null;
let dangerModal = null;

const app = Vue.createApp({
	data() {
		return {
			loading: false,
			dataloading: false,
			modal: {
				title: '',
				content: '',
				qty: 1,
				temp: {
					product: {
						title: ''
					}
				},
			},
			products: {},
			carts: {},
			cart: {
				id: ''
			},
			order: {
				data: {
					user: {},
					message: null
				}
			}
		}
	},
	components: {
		Loading: VueLoading,
		detailComponent,
		deleteComponent,
		successComponent,
		dangerComponent
	},
	mounted() {
		productDetailModal = new bootstrap.Modal(document.getElementById('productDetailModal'));
		successModal = new bootstrap.Modal(document.getElementById('successModal'));
		dangerModal = new bootstrap.Modal(document.getElementById('dangerModal'));

		deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'), {
			keyboard: false,
			backdrop: 'static',
		});

		this.getProducts()
		this.getCart()
	},
	methods: {
		getProducts() {
            let loader = this.$loading.show({
                'loader': 'dots',
				'color': '#fff',
				'background-color': "#000",
				'opacity': "0.2"
            });
			const productsUrl = `${api.url}/api/${api.path}/products/all`;
			axios.get(productsUrl)
				.then((response) => {
					// console.log(response);
					this.products = response.data.products;
					loader.hide();
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
					this.loading = '';
				})
				.catch((error) => {
					console.dir(error);
					alert(error.response.data.message)
				})
		},
		updateCart(type, id, qty = 1) {

			this.loading = id;

			const data = {
				"product_id": id,
				"qty": qty
			}

			let cartUrl = null;
			let method = null;
			if ( type === '新增購物車' ) {
				cartUrl = `${api.url}/api/${api.path}/cart`;
				method = 'post';
			} else if ( type === '編輯購物車' ) {
				cartUrl = `${api.url}/api/${api.path}/cart/${id}`;
				method = 'put';
			}

			axios[method](cartUrl, { data })
				.then((response) => {
					this.getCart();
					if ( type === '新增購物車' ) {
						this.modal.title = '新增成功';
					} else if ( type === '編輯購物車' ) {
						this.modal.title = '修改成功';
					}
					// console.log(response);
					this.loading = '';
					this.modal.content = response.data.message;
					productDetailModal.hide();
					successModal.show();
					this.modal.qty = 1;
				})
				.catch((error) => {
					console.dir(error);
					if ( type === '新增購物車' ) {
						this.modal.title = '新增失敗'
					} else if ( type === '編輯購物車' ) {
						this.modal.title = '修改失敗'
					}
					this.modal.content = error.response.data.message
					dangerModal.show();
				})
		},
		removeCart(id) {
			this.loading = id;

			let cartUrl = null;
			const type = this.modal.title;

			if ( type === '清空購物車' ) {
				cartUrl = `${api.url}/api/${api.path}/carts`;
			} else if ( type === '刪除購物車' ) {
				cartUrl = `${api.url}/api/${api.path}/cart/${id}`;
			}

			axios.delete(cartUrl)
				.then((response) => {
					// console.log(response);
					if ( type === '清空購物車' ) {
						this.modal.title = '清除成功';
					} else if ( type === '刪除購物車' ) {
						this.modal.title = '刪除成功';
					}
					this.modal.content = response.data.message;
					this.loading = '';
					this.getCart();
					this.clearTemp();
					successModal.show();
				})
				.catch((error) => {
					console.dir(error);
					if ( type === '清空購物車' ) {
						this.modal.title = '清除失敗'
					} else if ( type === '刪除購物車' ) {
						this.modal.title = '刪除失敗'
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
		openDeleteModal(product, type) {
			this.modal.title = type;
			this.cart.id = product.id;
			if ( type == '清空購物車' ) {
				this.modal.temp.title = '全部商品';
			} else if ( type == '刪除購物車' ) {
				this.modal.temp = product.product;
			}
			deleteModal.show();
		},
		clearTemp() {
			this.modal.temp = {
				product: {
					title: ''
				}
			}
		},
		isPhone(value) {
			const phoneNumber = /^(09)[0-9]{8}$/
			return phoneNumber.test(value) ? true : '請輸入正確的電話號碼'
		},
		onSubmit() {
			const orderData = this.order.data;
			// console.log(orderData);
			this.loading = 'submit';
			const orderUrl = `${api.url}/api/${api.path}/order`;
			axios.post(orderUrl, { data: orderData })
				.then((response) => {
					// console.log(response);
					this.loading = '';
					this.getCart();
					this.modal.title = response.data.message;
					this.modal.content = `
						編號：${response.data.orderId}<br/>
						總金額：${this.toNumber(response.data.total).toLocaleString()}<br/>
						成立時間：${this.toDate(response.data.create_at*1000)}
					`;
					this.openSuccessModal();
				})
				.catch((error) => {
					console.dir(error);
					this.modal.title = '送出失敗';
					this.modal.content = error.response.data.message
					dangerModal.show();
				})
		}
	},
	computed: {
		toNumber: function () {
			return function (val) {
				return Number.parseInt(val)
			}
		},
		toDate: function () {
			return function (timestamp) {
				return new Date(timestamp).toLocaleDateString("en-CA");
			}
		},
	}
});

app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

app.use(VueLoading);

app.mount('#app')
