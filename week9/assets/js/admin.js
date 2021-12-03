const domain = 'https://livejs-api.hexschool.io/api/livejs/v1';
const productsList = `${domain}/customer/iris/products`;
const customerCarts = `${domain}/customer/iris/carts`;
const customerOrders = `${domain}/customer/iris/orders`;
const adminOrders = `${domain}/admin/iris/orders`;

const uid = 'rUTMZQqsKWa2mYQamfURiNOB7Yx1';

const swiper = new Swiper('.swiper', {
	loop: true,
	pagination: {
		el: ".swiper-pagination",
		clickable: true,
	},
	navigation: {
		nextEl: ".swiper-button-next",
		prevEl: ".swiper-button-prev",
	},
});
