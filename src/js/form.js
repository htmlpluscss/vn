( forms => {

	if(!forms.length) {

		return;

	}

	window.readySubscribe = data => {

		console.log(data);

		const form = document.querySelector('.form-subscribe.is-send');

		form.classList.remove('is-send');

		form.querySelector('.form-subscribe__result').innerHTML = data.msg;

		form.classList.add('is-done');

		form.querySelector('.form-subscribe__submit').disabled = false;

		if(data.result === "success"){

		}

		if(data.result === "error"){

			setTimeout( () => form.classList.remove('is-done'), 5000);

		}

	};

	const getQueryString = formData => {

		let pairs = [];

		for (let [key, value] of formData.entries()) {

			pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));

		}

		return pairs.join('&');

	}

	Array.from(forms, form => {

		form.addEventListener('submit', event => {

			event.preventDefault();

			let url = form.getAttribute('action');

			url = url.replace("/post?u=", "/post-json?u=");
			url = url + '&c=window.readySubscribe';
			url = url + '&' + getQueryString(new FormData(form));

			form.classList.add('is-send');
			form.querySelector('.form-subscribe__submit').disabled = true;

			const script = document.createElement('script');

			script.async = true;
			script.src = url

			document.head.appendChild(script);

		});

	});

})(document.querySelectorAll('.form-subscribe'));