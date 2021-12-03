window.addEventListener("scroll", function(e) {
	let scrollTop = window.pageYOffset|| document.documentElement.scrollTop || document.body.scrollTop;
	if ( scrollTop > 200 ) {
		document.querySelector('.side-fixed').style.display = 'block';
	} else {
		document.querySelector('.side-fixed').style.display = 'none';
	}
}, false);

const domain = 'https://livejs-api.hexschool.io/api/livejs/v1';
const productsList = `${domain}/customer/iris/products`;
const customerCarts = `${domain}/customer/iris/carts`;
const customerOrders = `${domain}/customer/iris/orders`;
const adminOrders = `${domain}/admin/iris/orders`;

const productGroup = document.querySelector('.product-group');
const cartTable = document.querySelector('.cart-table');
const selectCategory = document.querySelector(".product-select");
const orderForm = document.querySelector(".form-group");
const btnSendOrder = document.querySelector(".btn-send-order");

let products = [];
let carts = [];
let orderUser = {};
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

// 取得產品列表
function productListInit() {
	axios
	.get(productsList)
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
			<button class="btn-add-cart h4 my-0" data-id="${item.id}">加入購物車</button>
			<div class="h4 my-10">${item.title}</div>
			<div class="price-origin h4 my-0">NT$${thousandComma(item.origin_price)}</div>
			<div class="price-sale h2 my-0">NT$${thousandComma(item.price)}</div>
		</div>`;
	});
	productGroup.innerHTML = str;
	let btnAddCartItem = document.querySelectorAll('.btn-add-cart');
	clickAddCartItem(btnAddCartItem);
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
	axios
	.get(customerCarts)
	.then(response => {
		carts = response.data.carts;
		cartTotal = response.data.finalTotal;
		renderCarts(carts);
	})
	.then(() => {
		let btnDeleteCartItem = document.querySelectorAll('.btn-delete-cart-item');
		let clearBtn = document.querySelector('.btn-clear-cart');
		clickDelectCartItem(btnDeleteCartItem);
		if ( clearBtn !== null ) {
			clickClearCart(clearBtn);
		}
	})
	.catch((error) => {
		console.error(error)
	})
}
// 渲染購物車列表
function renderCarts(carts) {
	let str = '';
	cartNumTotal = 0;
	if ( carts.length !== 0 ) {
		str = `<thead>
			<tr>
				<th>品項</th>
				<th></th>
				<th>單價</th>
				<th>數量</th>
				<th>金額</th>
				<th></th>
			</tr>
		</thead>`;
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
		str += `<tfoot>
			<td colspan="3">
				<button class="btn-clear-cart h4 my-0">刪除所有品項</button>
			</td>
			<td class="total-amount text-right" colspan="3">
				<span class="d-inline-block h4 my-0 mr-50">總金額</span>
				<span class="total d-inline-block h1 my-0">NT$${thousandComma(cartTotal)}</span>
			</td>
		</tfoot>`;
	} else {
		str += `<div class="h4 color-gray-400 text-center">您的購物車還是空的唷</div>`;
	}
	cartNum(cartNumTotal);
	cartTable.innerHTML = str;
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

// 新增項目至購物車
function addCartItem(id) {
	axios
	.post(customerCarts, {
		"data": {
			"productId": id,
			"quantity": 1
		}
	})
	.then(() => {
		cartListInit();
	})
	.catch((error) => {
		console.error(error)
	});
}
// 點擊新增項目至購物車
function clickAddCartItem(array) {
	array.forEach(item => {
		item.addEventListener("click", function (e) {
			addCartItem(e.target.dataset.id);
		});
	});
}

// 刪除購物車特定項目
function delectCartItem(id) {
	axios
	.delete(`${customerCarts}/${id}`)
	.then(() => {
		cartListInit();
	})
	.catch((error) => {
		console.error(error)
	});
}
// 點擊刪除購物車特定項目
function clickDelectCartItem(array) {
	array.forEach(item => {
		item.addEventListener("click", function (e) {
			delectCartItem(e.target.dataset.id);
		});
	});
}

// 清空購物車
function clearCart() {
	axios
	.delete(customerCarts)
	.then(() => {
		cartListInit();
	})
	.catch((error) => {
		console.error(error)
	});
}
// 點擊清空購物車
function clickClearCart(clearBtn) {
	clearBtn.addEventListener("click", function () {
		clearCart();
	});
}

// 送出訂單
function sendOrder(orderUser) {
	axios
    .post(customerOrders, {
      data: {
        user: orderUser,
      },
    })
	.then(response => {
		if ( response.data.status ) {
			cartListInit();
		}
	})
	.catch((error) => {
		console.error(error)
	})
};
btnSendOrder.addEventListener('click', function(event) {
	event.preventDefault();
	event.stopPropagation();
	if ( cartNumTotal !== 0 ) {
		// 購物車有東西時，表單驗證
		event.target.parentNode.classList.add("was-validated");

		// 確認表單是否有東西沒填
		if ( orderForm[0].value === '' || orderForm[1].value === '' || orderForm[2].value === '' || orderForm[3].value === '' || orderForm[4].value === '' ) {
			return;
		}

		// 表單都有填寫資料整合到 obj: orderUser
		orderUser['name'] = orderForm[0].value;
		orderUser['tel'] = orderForm[1].value;
		orderUser['email'] = orderForm[2].value;
		orderUser['address'] = orderForm[3].value;
		orderUser['payment'] = orderForm[4].value;
		sendOrder(orderUser);
	} else {
		alert('您的購物車還是空的唷');
		return;
	}
})

productListInit();
cartListInit();
