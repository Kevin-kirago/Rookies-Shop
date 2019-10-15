if (document.querySelector(".navigation__drawer")) {
	// fire up the navigation
	document.querySelector(".navigation__store, .navigation__store *").addEventListener("click", function() {
		document.querySelector(".navigation__drawer").classList.toggle("navigation__drawer-open");
	});

	// Close the navigation
	document.querySelector(".icon-close, icon-close *").addEventListener("click", function() {
		document.querySelector(".navigation__drawer").classList.toggle("navigation__drawer-open");
	});
}
