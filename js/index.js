// ////////////////////////////////////////////////////////////////////
// STORAGE CONTROLLER
// ////////////////////////////////////////////////////////////////////
const StorageController = (function() {})();

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

	const data = {
		items: [],
		total_price: 0
	};

	return {
		getItemProducts: async () => {
			const products = await Data.getProducts();
			return products;
		},

		getData: () => {
			return {
				items: data.items,
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
		navDrawer: ".navigation__drawer"
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
		dataCtrl
			.getItemProducts()
			.then(products => uiCtrl.displayShopItems(products))
			.then(() => {
				// Add item event handler
				const cartAddBtns = [...document.querySelectorAll(".item__icon-cart", ".item__icon-cart *")];
				cartAddBtns.forEach(cur => {
					cur.addEventListener("click", addItemToCart);
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

	const addItemToCart = e => {
		// Add item to the data structure
		// Add item to local storage
		// Add item to ui
		// Update totals
	};

	return {
		init: () => {
			console.log("Application has started ...");

			setUpEventListeners();
		}
	};
})(StorageController, DataController, UIController);

AppController.init();
