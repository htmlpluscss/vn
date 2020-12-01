( swiperContainer => {

	if(!swiperContainer.length) {

		return;

	}

	let swiperInit = window.Swiper;

	Array.from(swiperContainer, swipe => {

		let mySwipe = null,
			toggleSwipe = null,
			resetSwipe = null;

		const swipeNav = document.createElement('div'),
			  processStep = swipe.classList.contains('swiper-container--process');

		swipeNav.className = 'swiper-pagination';

		swipe.appendChild(swipeNav);

		// eager
		Array.from(swipe.querySelectorAll('[loading="lazy"]'), img => img.setAttribute('loading','eager'));

		resetSwipe = () => {

			if(mySwipe) {

				mySwipe.destroy(false,true);
				mySwipe = undefined;

			}

		}

		if (processStep) {

			let inViewport = true;

			if ('IntersectionObserver' in window) {

				const options = {
					root: null,
					rootMargin: '0px',
					threshold: [0.3]
				};

				const callback = (entries, observer) => {

					Array.prototype.forEach.call(entries, (entry) => {

						inViewport = entry.isIntersecting;

					});

				};

				const observer = new IntersectionObserver(callback, options);

				observer.observe(document.querySelector('.process__right'));

			}

			const current = swipe.querySelector('.process__swiper-current'),
				  total = swipe.querySelectorAll('.swiper-slide').length,
				  processBtn = document.querySelectorAll('.process__btn'),
				  circle = document.querySelector('.process__btn.is-active circle'),
				  pi2r = parseInt(circle.getAttribute('r')) * 2 * Math.PI;

			let idTimer = null;

			const Circle = (btn, circle) => {

				btn.classList.add('is-active');

				let count = 0;

				idTimer = setInterval( () => {

					if(count === 100) {

						swipe.swiper.slideNext();

					}

					if(inViewport) {

						count++;

					}

					circle.setAttribute('stroke-dasharray', pi2r / 100 * count + ' ' + pi2r);

				}, 50);

			}

			toggleSwipe = () => {

				resetSwipe();

				if(window.innerWidth < 1200) {

					mySwipe = new Swiper(swipe, {
						loop: true,
						autoHeight: true,
						preloadImages: false,
						pagination: {
							el: swipeNav,
							clickable: true,
							bulletElement: 'button',
							bulletClass: 'button',
							bulletActiveClass: 'is-active'
						},
						on: {
							slideChangeTransitionEnd: () => {
								current.textContent = (swipe.swiper.realIndex % total + 1);
							}
						}
					});

				} else {

					mySwipe = new Swiper(swipe, {
						preloadImages: false,
						direction: 'vertical',
						loop: true,
						on: {
							init: () => {

								Array.from(processBtn, (btn,index) =>
									btn.addEventListener('click', () =>
										swipe.swiper.slideToLoop(index)));

								Circle(processBtn[0],circle);

							},
							slideChangeTransitionEnd: () => {

								clearInterval(idTimer);

								Array.from(processBtn, (btn,index) => {

									const old = index < swipe.swiper.realIndex,
										  circle = btn.querySelector('circle');

									if(index === swipe.swiper.realIndex % total) {

										Circle(btn,circle);

									}
									else {

										if(old) {

											btn.classList.add('is-active');
											circle.setAttribute('stroke-dasharray', '0 0');

										}
										else {

											btn.classList.remove('is-active');

										}

									}

								});

							}
						}
					});


				}

			}

		}

		PubSub.subscribe('windowWidthResize', () => {

			if (window.Swiper) {

				toggleSwipe();

			}

		});

		PubSub.subscribe('swiperJsLoad', toggleSwipe);

		if(!swiperInit) {

			swiperInit = true;

			const script = document.createElement('script');

			script.async = true;
			script.src = '/js/swiper.min.js';

			script.onload = () => PubSub.publish('swiperJsLoad');

			setTimeout( () => document.head.appendChild(script), window.pageYOffset === 0 ? 70 : 100);

		}

	});

})(document.querySelectorAll('.swiper-container'));