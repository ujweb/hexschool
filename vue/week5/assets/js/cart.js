const api = {
	url: 'https://vue3-course-api.hexschool.io/v2',
	path: 'ujhwang'
}

let productModal = null;
let successModal = null;
let dangerModal = null;

const app = {
    data() {
        return {
            products: {},
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
	mounted() {
        this.getProducts()
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
	},
}

Vue.createApp(app).mount('#app')
