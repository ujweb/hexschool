"use strict";

let hamburger = document.querySelector(".navbar-hamburger");
let slideUp = (target, duration = 500) => {
	target.style.transitionProperty = "height, margin, padding";
	target.style.transitionDuration = duration + "ms";
	target.style.boxSizing = "border-box";
	target.style.height = target.offsetHeight + "px";
	target.offsetHeight;
	target.style.overflow = "hidden";
	target.style.height = 0;
	target.style.paddingTop = 0;
	target.style.paddingBottom = 0;
	target.style.marginTop = 0;
	target.style.marginBottom = 0;
	window.setTimeout(() => {
		target.style.display = "none";
		target.style.removeProperty("height");
		target.style.removeProperty("padding-top");
		target.style.removeProperty("padding-bottom");
		target.style.removeProperty("margin-top");
		target.style.removeProperty("margin-bottom");
		target.style.removeProperty("overflow");
		target.style.removeProperty("transition-duration");
		target.style.removeProperty("transition-property");
		//alert("!");
	}, duration);
};
let slideDown = (target, duration = 500) => {
	target.style.removeProperty("display");
	let display = window.getComputedStyle(target).display;

	if (display === "none") display = "block";

	target.style.display = display;
	let height = target.offsetHeight;
	target.style.overflow = "hidden";
	target.style.height = 0;
	target.style.paddingTop = 0;
	target.style.paddingBottom = 0;
	target.style.marginTop = 0;
	target.style.marginBottom = 0;
	target.offsetHeight;
	target.style.boxSizing = "border-box";
	target.style.transitionProperty = "height, margin, padding";
	target.style.transitionDuration = duration + "ms";
	target.style.height = height + "px";
	target.style.removeProperty("padding-top");
	target.style.removeProperty("padding-bottom");
	target.style.removeProperty("margin-top");
	target.style.removeProperty("margin-bottom");
	window.setTimeout(() => {
		target.style.removeProperty("height");
		target.style.removeProperty("overflow");
		target.style.removeProperty("transition-duration");
		target.style.removeProperty("transition-property");
	}, duration);
};
let slideToggle = (target, duration = 500) => {
	if (window.getComputedStyle(target).display === "none") {
		return slideDown(target, duration);
	} else {
		return slideUp(target, duration);
	}
};
hamburger.onclick = function () {
	hamburger.classList.toggle("active");
	slideToggle(document.querySelector(".navbar-nav"), 500);
};

// ?????????
function thousandComma(number) {
	let num = number.toString();
	let pattern = /(-?\d+)(\d{3})/;
	while(pattern.test(num)) {
		num = num.replace(pattern, "$1,$2");
	}
	return num;
}

// ??????????????????
function obj2ary(obj) {
	return Object.keys(obj).map((key) => [key, obj[key]]);
}

// ????????????
let msgState = {
	cart: {
		add: {
			icon: 'add_shopping_cart',
			text: '????????????????????????',
		},
		remove: {
			icon: 'production_quantity_limits',
			text: '????????????????????????',
		},
		modify: {
			icon: 'add_shopping_cart',
			text: '?????????????????????',
		},
		clear: {
			icon: 'remove_shopping_cart',
			text: '????????????????????????',
		}
	},
	order: {
		sent: {
			icon: 'shopping_cart_checkout',
			text: '?????????????????????',
		},
		remove: {
			icon: 'delete',
			text: '?????????????????????',
		},
		clear: {
			icon: 'clear',
			text: '???????????????????????????',
		},
		modify: {
			icon: 'auto_fix_high',
			text: '???????????????????????????',
		}
	},
}

// message ??????????????????????????????
let message = document.querySelector('.message');
let messageIcon = message.children[0];
let messageText = message.children[1];
// console.log(messageIcon, messageText);
function messageToggle(state) {
	messageIcon.innerHTML = state.icon;
	messageText.innerHTML = state.text;
	message.style.display = 'flex';
	setTimeout(() => {
		message.style.display = 'none';
	}, 3000);
}
