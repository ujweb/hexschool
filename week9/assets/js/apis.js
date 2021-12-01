const domain = 'https://livejs-api.hexschool.io/api/livejs/v1';
const productsList = `${domain}/customer/iris/products`;
const customerCarts = `${domain}/customer/iris/carts`;
const customerOrders = `${domain}/customer/iris/orders`;
const adminOrders = `${domain}/admin/iris/orders`;

const productGroup = document.querySelector('.product-group');
const cartTable = document.querySelector('.cart-table');
const selectCategory = document.querySelector(".product-select");
const total = document.querySelector(".total");

let products = [];
let carts = [];
let cartNumTotal = 0;
let cartTotal = 0;

// 千分位
function thousandComma(number) {
	let num = number.toString();
	let pattern = /(-?\d+)(\d{3})/;
	while(pattern.test(num)) {
		num = num.replace(pattern, "$1,$2");
	}
	return num;
}

// 表單驗證
let forms = document.querySelectorAll(".needs-validation");
Array.prototype.slice.call(forms).forEach((form) => {
	form.addEventListener("submit", (event) => {
		if (!form.checkValidity()) {
			event.preventDefault();
			event.stopPropagation();
		}
		form.classList.add("was-validated");
	});
});

// 取得產品列表
function productListInit() {
	axios.get(productsList)
	.then(response => {
		products = response.data.products;
		renderProducts(products);
		filterCategory('全部', products);
	})
	.catch((error) => {
		console.error(error)
	})
}
// 渲染產品列表
function renderProducts(products) {
	let str = '';
	products.forEach(item => {
		str += `<div class="product-item col-lg-3 col-md-6 mt-30">
			<div class="item-img">
				<img src="${item.images}" width="100%" alt="${item.title}">
			</div>
			<div class="label h4 color-white bg-black my-0">新品</div>
			<button class="btn-addCart h4 my-0" data-id="${item.id}">加入購物車</button>
			<div class="h4 my-10">${item.title}</div>
			<div class="price-origin h4 my-0">NT$${thousandComma(item.origin_price)}</div>
			<div class="price-sale h2 my-0">NT$${thousandComma(item.price)}</div>
		</div>`;
	});
	productGroup.innerHTML = str;
}
// 篩選產品列表: 渲染
function filterCategory(category, products) {
	if (category === "全部") {
		renderProducts(products);
		return;
	} else {
		const newData = products.filter(function (item) {
			return item["category"] == category;
		});
		renderProducts(newData);
	}
}
// 篩選產品列表: select
selectCategory.addEventListener("change", function () {
	filterCategory(selectCategory.value, products);
});

// 取得購物車列表
function cartListInit() {
	axios.get(customerCarts)
	.then((response) => {
		carts = response.data.carts;
		cartTotal = response.data.finalTotal;
		renderCarts(carts);
		total.textContent = thousandComma(cartTotal);
	})
	.then(() => {
		let btnDeleteCartItem = document.querySelectorAll('.btn-delete-cart-item');
		btnDeleteCartItem.forEach(item => {
			item.addEventListener("click", function (e) {
				delectCartItem(e.target.dataset.id);
			});		  
		});
	})
	.catch((error) => {
		console.error(error)
	})
}
// 渲染購物車列表
function renderCarts(carts) {
	let str = '';
	carts.forEach(item => {
		str += `<tr>
			<td>
				<div class="img">
					<img src="${item.product.images}" alt="${item.product.title}">
				</div>
			</td>
			<td>${item.product.title}</td>
			<td>NT$${thousandComma(item.product.price)}</td>
			<td>${item.quantity}</td>
			<td>NT$${thousandComma(item.product.price * item.quantity)}</td>
			<td>
				<span class="material-icons btn-delete-cart-item" data-id="${item.id}">close</span>
			</td>
		</tr>`;
		cartNumTotal += item.quantity;
	});
	cartTable.innerHTML = str;
	cartNum(cartNumTotal);
}
// 更新右欄購物車數字
function cartNum(number) {
	let cartNumberSpan = document.querySelector('.cart-number');
	if ( number > 0 ) {
		cartNumberSpan.style.display = 'flex';
		cartNumberSpan.textContent = number;
	} else {
		cartNumberSpan.style.display = 'none';
	}
}
// 刪除購物車特定項目
function delectCartItem(id) {
	axios
	.delete(`${customerCarts}/${id}`)
	.then(() => {
	})
	.catch((error) => {
		console.error(error)
	});
}

// btnDeleteCartItem.forEach(item => {
	
// });
// console.log(btnDeleteCartItem);

// 新增購物車列表
// axios.get(customerCarts)
// .then((response) => {
// 	carts = response.data.carts;
// 	cartTotal = response.data.finalTotal;
// 	console.log(carts);
// 	renderCarts(carts);
// 	total.textContent = thousandComma(cartTotal);
// })
// .catch((error) => {
// 	console.error(error)
// })

productListInit();
cartListInit();
