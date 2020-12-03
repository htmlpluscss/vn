( modal => {

	if(!modal) {

		return;

	}

	const items = modal.querySelectorAll('.modal__item'),
		  btns = document.querySelectorAll('[data-modal]');

	let windowScroll = window.pageYOffset;

	modal.addEventListener('click', event => {

		if(event.target.closest('.modal__close')){

			VN.hideModal();

		}

	});

	VN.hideModal = () => {

		document.body.classList.remove('modal-show');
		window.scrollTo(0,windowScroll);

		setTimeout( () => document.documentElement.classList.remove('scroll-behavior-off'));

		VN.activeModal = false;

	};

	VN.modalShow = selector => {

		if(!VN.activeModal){

			windowScroll = window.pageYOffset;

		}

		VN.activeModal = modal.querySelector('.modal__item--' + selector);

		Array.from(items, el => el.classList.toggle('visuallyhidden', el !== VN.activeModal));

		document.documentElement.classList.add('scroll-behavior-off');

		setTimeout( () => {

			document.body.classList.add('modal-show');
			window.scrollTo(0,0);

			VN.activeModal.focus();

		});

	};

	Array.from(btns, el =>
		el.addEventListener('click',()=>
			VN.modalShow(el.getAttribute('data-modal'))));

})(document.querySelector('.modal'));