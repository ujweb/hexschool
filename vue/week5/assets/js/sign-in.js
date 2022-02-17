import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';
const app = createApp({
    data() {
        return {
            api: {
                url: 'https://vue3-course-api.hexschool.io/v2',
                path: 'ujhwang'
            },
            user: {
                username: '',
                password: '',
            },
            error: '',
        }
    },
    methods: {
        login() {
            const signinApi = `${this.api.url}/admin/signin`;
            axios
                .post(signinApi, this.user)
                .then((response) => {
                    // console.log(response);
                    const { token, expired } = response.data;
                    // console.log(token, expired, new Date(expired));
                    document.cookie = `signinToken=${token}; expires=${new Date(expired)}`;
                    // return false
                    window.location = 'products.html';
                })
                .catch((error) => {
					// console.dir(error);
                    this.error = error.response.data.error.message;
                });
        },
    }
})
app.mount('#app')
