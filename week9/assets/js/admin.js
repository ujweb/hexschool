const domain = 'https://livejs-api.hexschool.io/api/livejs/v1';
const adminOrders = `${domain}/admin/iris/orders`;

const uid = 'rUTMZQqsKWa2mYQamfURiNOB7Yx1';

const orderTable = document.querySelector('.order-table');
let orders = [];

const swiper = new Swiper('.swiper', {
	pagination: {
		el: ".swiper-pagination",
		clickable: true,
	},
	navigation: {
		nextEl: ".swiper-button-next",
		prevEl: ".swiper-button-prev",
	}
});

// 取得訂單列表
function orderListInit() {
	axios
	.get(adminOrders, {
		headers: {
			'Authorization': uid
		}
	})
	.then(response => {
		orders = response.data.orders;
		renderOrderItem(orders);
		renderOrderCategory(orders);
		renderOrderTitle(orders);
	})
	.then(() => {
		const btnOrderToggle = document.querySelectorAll('.btn-order-toggle');
		toggleOrderItem(btnOrderToggle);
		const btnDeleteOrderItem = document.querySelectorAll('.btn-order-delete');
		const clearOrderBtn = document.querySelector('.btn-clear-order');
		clickDelectOrderItem(btnDeleteOrderItem);
		if ( clearOrderBtn !== null ) {
			clickClearOrder(clearOrderBtn);
		}
	})
	.catch((error) => {
		console.error(error)
	})
}
// 渲染訂單列表
function renderOrderItem(orders) {
	// console.log(orders);
	let str = '';
	let isPaid = '';
	if ( orders.length !== 0 ) {
		document.querySelector('.swiper').style.display = 'block';
		document.querySelector('.btn-clear-order').style.display = 'inline-block';
		str = `<thead>
			<tr>
				<th>訂單編號</th>
				<th>聯絡人</th>
				<th>聯絡地址</th>
				<th>電子郵件</th>
				<th>訂單品項</th>
				<th>訂單日期</th>
				<th>訂單狀態</th>
				<th>操作</th>
			</tr>
		</thead>
		<tbody>`;
		orders.forEach(item => {
			if ( item.paid ) {
				isPaid = `<input class="btn-order-true" type="button" value="已處理">`;
			} else {
				isPaid = `<input class="btn-order-false" type="button" data-id="${item.id}" value="未處理">`;
			}
			let products = `<table>
				<tr>
					<th>品項</th>
					<th>數量</th>
					<th>金額</th>
				</tr>`;
			item.products.forEach(item => {
				// console.log(item);
				products += `<tr>
					<td>${item.title}</td>
					<td>${item.quantity}</td>
					<td>${thousandComma(item.price)}</td>
				</tr>`;
			});
			products += `<tr>
					<td colspan="3">總金額　${thousandComma(item.total)}</td>
				</tr>
			</table>`;
			str += `<tr>
				<td>${item.id}</td>
				<td>${item.user.name}<br/>${item.user.tel}</td>
				<td>${item.user.address}</td>
				<td>${item.user.email}</td>
				<td>
					<div class="btn-order-toggle"><span class="open">展開詳情</span><span class="close">收合詳情</span></div>
				</td>
				<td>${new Date(item.createdAt * 1000).toISOString().split('T')[0]}</td>
				<td>
					${isPaid}
				</td>
				<td>
					<input class="btn-order-delete" type="button" data-id="${item.id}" value="刪除">
				</td>
			</tr>
			<tr class="detail hidden">
				<td colspan="8">
					${products}
				</td>
			</tr>`;
		});
		str += '</tbody>';
	} else {
		document.querySelector('.swiper').style.display = 'none';
		document.querySelector('.btn-clear-order').style.display = 'none';
		str += `<div class="h4 color-gray-400 text-center">目前尚無訂單</div>`;
	}
	orderTable.innerHTML = str;
	let btnOrderStatus = document.querySelectorAll('.btn-order-false');
	clickModifyOrderStatus(btnOrderStatus);
}
// 收合詳細訂單品項
function toggleOrderItem(array) {
	const orderTableTbodyTr = document.querySelectorAll('.order-table tbody tr');
	array.forEach((item, index) => {
		item.addEventListener("click", function (e) {
			let showButton = e.target.parentNode;
			let nextTr = e.target.parentNode.parentNode.parentNode.nextElementSibling;
			showButton.classList.toggle('open');
			nextTr.classList.toggle('hidden');
		});
	});
}

// 刪除特定訂單
function delectOrderItem(id) {
	axios
	.delete(`${adminOrders}/${id}`, {
		headers: {
			'Authorization': uid
		}
	})
	.then(() => {
		orderListInit();
		messageToggle(msgState.order.remove);
	})
	.catch((error) => {
		console.error(error)
	});
}
// 點擊刪除訂單選單
function clickDelectOrderItem(array) {
	array.forEach(item => {
		item.addEventListener("click", function (e) {
			delectOrderItem(e.target.dataset.id);
		});
	});
}

// 修改訂單處理狀態
function modifyOrderStatus(id, isPaid) {
	axios
	.put(adminOrders,
		{
			data: {
				id: id,
				paid: isPaid
			},
		},
		{
			headers: {
				'Authorization': uid
			}
		}
	)
	.then(response => {
		console.log(response);
		orderListInit();
		messageToggle(msgState.order.modify);
	})
	.catch((error) => {
		console.error(error)
	});
}
// 點擊修改訂單處理狀態
function clickModifyOrderStatus(array) {
	array.forEach(item => {
		item.addEventListener("click", function (e) {
			let id = e.target.dataset.id;
			modifyOrderStatus(id, true);
		});
	});
}

// 清空訂單
function clearOrder() {
	axios
	.delete(adminOrders, {
		headers: {
			'Authorization': uid
		}
	})
	.then(() => {
		orderListInit();
		messageToggle(msgState.order.clear);
	})
	.catch((error) => {
		console.error(error)
	});
}
// 點擊清空訂單
function clickClearOrder(clearBtn) {
	clearBtn.addEventListener("click", function () {
		clearOrder();
	});
}

// 渲染全品項營收比重圓餅圖
function renderOrderTitle(orders) {
	let orderTitleData = {};
	let orderTitleDataTop3 = [];

	// 取得各品項累積數量
	orders.forEach(item => {
		item.products.forEach(product => {
			// console.log(product);
			orderTitleData[product.title] = orderTitleData[product.title] ? (orderTitleData[product.title] + product.quantity) : product.quantity;
		});
	});
	// 取 Top3 後，再將剩餘項目數量計入「其他」
	let orderTitleDataSort = Object.entries(orderTitleData).sort((a, b) => b[1] - a[1]);
	let orderTitleDataOther = ['其他', 0];
	// console.log(orderTitleDataSort);
	orderTitleDataSort.forEach((item, index) => {
		if ( index < 3 ) {
			orderTitleDataTop3.push(item)
		} else if ( index >= 3 ) {
			orderTitleDataOther[1] += item[1];
		}
	});
	if ( orderTitleDataSort.length > 3 ) {
		orderTitleDataTop3.push(orderTitleDataOther);
	}
	// console.log(orderTitleDataTop3);

	c3.generate({
		bindto: '.chart-title',
		data: {
			type: 'pie',
			columns: orderTitleDataTop3,
		},
		color: {
			pattern: ['#DACBFF', '#9D7FEA', '#5434A7', '#301E5F']
		}
	})
}
// 渲染全產品類別營收比重圓餅圖
function renderOrderCategory(orders) {
	let orderCatagoryData = {};
	// 取得各產品類別累積數量
	orders.forEach(item => {
		item.products.forEach(product => {
			// console.log(product);
			orderCatagoryData[product.category] = orderCatagoryData[product.category] ? (orderCatagoryData[product.category] + product.quantity) : product.quantity;
		});
	});

	c3.generate({
		bindto: '.chart-category',
		data: {
			type: 'pie',
			columns: obj2ary(orderCatagoryData),
		},
		color: {
			pattern: ['#5434A7', '#9D7FEA', '#DACBFF']
		}
	})
}

orderListInit();
