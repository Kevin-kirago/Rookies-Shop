// ////////////////////////////////////////////////////////////////////
// STORAGE CONTROLLER
// ////////////////////////////////////////////////////////////////////
const StorageController = (function() {
	return {
		getcartData: () => {
			if (localStorage.getItem("Cart-Data") === null) {
				let data = {
					cart_items: [],
					total_price: 0
				};
				return data;
			} else {
				let data = JSON.parse(localStorage.getItem("Cart-Data"));
				return data;
			}
		},

		getProducts: () => {
			if (localStorage.getItem("Furniture-Products") === null) {
				let products = [];
				return products;
			} else {
				let products = JSON.parse(localStorage.getItem("Furniture-Products"));
				return products;
			}
		},

		saveProducts: products => {
			localStorage.setItem("Furniture-Products", JSON.stringify(products));
		},

		addItemToLocalStorage: obj => {
			if (localStorage.getItem("Cart-Data") === null) {
				let data = {
					cart_items: [],
					total_price: 0
				};

				obj.total = obj.count * obj.price;
				data.cart_items.push(obj);

				let sum = 0;
				data.cart_items.forEach(item => {
					sum += item.total;
				});
				data.total_price = sum;

				localStorage.setItem("Cart-Data", JSON.stringify(data));
			} else {
				let data = JSON.parse(localStorage.getItem("Cart-Data"));

				let inCartLS = data.cart_items.find(item => item.id === obj.id);
				if (inCartLS) {
					console.log("Item in local storage");
				} else {
					obj.total = obj.count * obj.price;
					data.cart_items.push(obj);

					let sum = 0;

					data.cart_items.forEach(item => {
						sum += item.total;
					});

					data.total_price = sum;
					localStorage.setItem("Cart-Data", JSON.stringify(data));
				}
			}
		}
	};
})();

// ////////////////////////////////////////////////////////////////////
// DATA CONTROLLER
// ////////////////////////////////////////////////////////////////////
const DataController = (function() {
	class Data {
		constructor(id, title, price, image_url) {
			this.id = id;
			this.title = title;
			this.price = price;
			this.image_url = image_url;
			this.count = 1;
			this.total = -1;
		}

		setTotal() {
			this.total = this.price * this.count;
		}

		getTotal() {
			return this.total;
		}

		static async getProducts() {
			try {
				let data = await fetch("data/products.json");
				let result = await data.json();

				let products = result.items;
				products = products.map(el => {
					const { id } = el;
					const { title, price } = el.fields;
					const image_url = el.fields.image.url;

					return {
						id,
						title,
						price,
						image_url
					};
				});

				return products;
			} catch (e) {
				console.log(e);
			}
		}
	}

	const data = StorageController.getcartData();

	return {
		addItemToDataSource: id => {
			let newItem, prodArr;

			prodArr = StorageController.getProducts().find(el => {
				if (el.id === id) {
					return el;
				}
			});

			newItem = new Data(prodArr.id, prodArr.title, prodArr.price, prodArr.image_url);
			let inCart = data.cart_items.find(cur => cur.id === newItem.id);

			if (inCart) {
				return inCart;
			} else {
				newItem.setTotal();
				data.cart_items.push(newItem);
				return newItem;
			}
		},

		calculateCartTotals: () => {
			let sum = 0;

			data.cart_items.forEach(item => {
				sum += item.total;
			});

			data.total_price = sum;
		},

		getItemProducts: async () => {
			const products = await Data.getProducts();
			return products;
		},

		getCartData: () => {
			return {
				cart_items: data.cart_items,
				total_price: data.total_price
			};
		}
	};
})();

// ////////////////////////////////////////////////////////////////////
// UI CONTROLLER
// ////////////////////////////////////////////////////////////////////
const UIController = (function() {
	const domStrings = {
		shopContainer: ".store__container",
		navDrawer: ".navigation__drawer",
		navDrawerList: ".cart__list",
		navStoreValue: ".navigation__store-value",
		cartTotal: ".cart__result-total"
	};

	return {
		// display shop items to ui
		displayShopItems: products => {
			let element,
				html = "";
			element = document.querySelector(domStrings.shopContainer);

			products.forEach(cur => {
				html = `
				<!-- Gallery Item -->
				<div class="col-1-of-3">
					<div class="item" id="item-${cur.id}">
						<div class="item__header">
							<img src=${cur.image_url} alt="product image-${cur.id}" class="item__header-img">
						</div>
						<div class="item__content">
							<div class="item__description">
								<h3 class="item__name">${cur.title}</h3>
								<div class="item__price">$<span> ${cur.price}</span></div>
							</div>
							<div class="item__icon">
								<div class="item__icon-ratings">
									<i class="ion-ios-star"></i>
									<i class="ion-ios-star"></i>
									<i class="ion-ios-star"></i>
									<i class="ion-ios-star-half"></i>
									<i class="ion-ios-star-outline"></i>
								</div>
								<div class="item__icon-cart">
									<i class="ion-android-cart"></i>
								</div>
							</div>
						</div>
					</div>
				</div>
				<!-- Gallery Item end -->
				`;

				element.insertAdjacentHTML("beforeend", html);
			});
		},

		addItemToUi: obj => {
			let html, element, inCart, cartItemID;

			element = document.querySelector(domStrings.navDrawerList);

			cartItemID = [...document.querySelectorAll(".cart__item")].map(el => {
				let itemID = el.id.split("-");
				let id = parseInt(itemID[1]);
				return id;
			});

			inCart = cartItemID.find(cur => cur === obj.id);

			if (inCart) {
				alert("Item exists in cart");
			} else {
				html = `
				<!-- Cart Item start -->
				<div class="cart__item" id="cart__item-${obj.id}">
					<figure class="cart__item-detail">
						<div class="cart__item-img">
							<img src=${obj.image_url} alt="cart-image-item">
						</div>
						<figcaption class="item__description">
							<h3 class="item__name">${obj.title}</h3>
							<div class="item__price">$<span> ${obj.price}</span></div>
						</figcaption>
					</figure>
					<div class="cart__item-adjuster">
						<div class="cart__item-icon cart__item-icon-up">
							<i class="ion-chevron-up"></i>
						</div>
						<span class="cart__item-count">${obj.count}</span>
						<div class="cart__item-icon cart__item-icon-down">
							<i class="ion-chevron-down"></i>
						</div>
					</div>
					<div class="cart__item-icon cart__item-remove">
						<i class="ion-trash-b"></i>
					</div>
				</div>
				<!-- Cart Item end -->`;

				element.insertAdjacentHTML("beforeend", html);
			}
		},

		populateCart: obj => {
			let html = "",
				element;
			element = document.querySelector(domStrings.navDrawerList);

			obj.cart_items.forEach(item => {
				html += `
				<!-- Cart Item start -->
				<div class="cart__item" id="cart__item-${item.id}">
					<figure class="cart__item-detail">
						<div class="cart__item-img">
							<img src=${item.image_url} alt="cart-image-item">
						</div>
						<figcaption class="item__description">
							<h3 class="item__name">${item.title}</h3>
							<div class="item__price">$<span> ${item.price}</span></div>
						</figcaption>
					</figure>
					<div class="cart__item-adjuster">
						<div class="cart__item-icon cart__item-icon-up">
							<i class="ion-chevron-up"></i>
						</div>
						<span class="cart__item-count">${item.count}</span>
						<div class="cart__item-icon cart__item-icon-down">
							<i class="ion-chevron-down"></i>
						</div>
					</div>
					<div class="cart__item-icon cart__item-remove">
						<i class="ion-trash-b"></i>
					</div>
				</div>
				<!-- Cart Item end -->`;
			});

			element.insertAdjacentHTML("beforeend", html);
		},

		updateTotalsUI: obj => {
			document.querySelector(domStrings.navStoreValue).textContent = obj.cart_items.length;

			document.querySelector(domStrings.cartTotal).textContent = obj.total_price;
		},

		getDomStrings: () => {
			return domStrings;
		}
	};
})();

// ////////////////////////////////////////////////////////////////////
// APP CONTROLLER
// ////////////////////////////////////////////////////////////////////
const AppController = (function(strgCtrl, dataCtrl, uiCtrl) {
	const dom = uiCtrl.getDomStrings();

	// Event handlers
	const setUpEventListeners = () => {
		// Oncontent load
		document.addEventListener("DOMContentLoaded", () => {
			dataCtrl
				.getItemProducts()
				.then(products => {
					strgCtrl.saveProducts(products);
					uiCtrl.displayShopItems(products);
				})
				.then(() => {
					// Add item event handler
					const cartAddBtns = [...document.querySelectorAll(".item__icon-cart", ".item__icon-cart *")];
					cartAddBtns.forEach(cur => {
						cur.addEventListener("click", addItemToCart);
					});
				});
		});

		// navigation
		if (document.querySelector(dom.navDrawer)) {
			// fires up the navigation
			document.querySelector(".navigation__store, .navigation__store *").addEventListener("click", function() {
				document.querySelector(dom.navDrawer).classList.toggle("navigation__drawer-open");
			});

			// Close the navigation
			document.querySelector(".icon-close, icon-close *").addEventListener("click", function() {
				document.querySelector(dom.navDrawer).classList.toggle("navigation__drawer-open");
			});
		}
	};

	const updateTotals = () => {
		// Total cart amount
		dataCtrl.calculateCartTotals();

		let data = strgCtrl.getcartData();
		// UI update
		uiCtrl.updateTotalsUI(data);
	};

	const addItemToCart = e => {
		let itemID, id, inCart;
		itemID = e.target.parentElement.parentElement.parentElement.parentElement.id;
		itemID.split("-");
		id = parseInt(itemID.split("-")[1]);

		// Add item to the data structure
		const item = dataCtrl.addItemToDataSource(id);

		// Add item to local storage
		strgCtrl.addItemToLocalStorage(item);

		// Add item to ui
		uiCtrl.addItemToUi(item);

		// Update totals
		updateTotals();
	};

	return {
		init: () => {
			console.log("Application has started ...");

			updateTotals();
			let data = strgCtrl.getcartData();

			uiCtrl.populateCart(data);
			setUpEventListeners();
		}
	};
})(StorageController, DataController, UIController);

AppController.init();
