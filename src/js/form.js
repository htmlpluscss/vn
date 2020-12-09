( forms => {

	if(!forms.length) {

		return;

	}

	VN.readySubscribe = data => {

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
			url = url + '&c=VN.readySubscribe';
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


// mailer

( forms => {

	if(!forms.length) {

		return;

	}

	//reCaptcha v3

	let reCaptchaOFF = true;
	const PUBLIC_KEY = '6LdEIvkZAAAAAKkOVmnhwgc0hpKueZkUglPfuow2';

	const loadReCaptcha = () => {

		if(reCaptchaOFF) {

			reCaptchaOFF = false;

			const script = document.createElement('script');

			script.async = true;
			script.src = 'https://www.google.com/recaptcha/api.js?render=' + PUBLIC_KEY;

			document.head.appendChild(script);

		}

	};

	Array.from(forms, form => {

		form.addEventListener('input', () => loadReCaptcha());

		form.addEventListener('reset', () => form.classList.remove('is-done'));

		form.addEventListener('submit', event => {

			event.preventDefault();

			const form = event.target,
				  url = form.getAttribute('action'),
				  formData = new FormData(form),
				  formBtnSubmit = form.querySelector('.form__submit');

			if(formBtnSubmit) {

				formBtnSubmit.disabled = true;

			}

			// reCaptcha

			if (typeof(grecaptcha) == 'undefined') {

				alert('Ошибка отправки! Google reCaptcha не загрузилась, пожалуйста сообщите администратору.');

			} else {

				grecaptcha.ready( () => {

					grecaptcha.execute(PUBLIC_KEY).then( token => {

						formData.append('g_recaptcha_response', token);

						fetch(url, {

							method: 'POST',
							body: formData

						})
						.then( response => {

							console.log(response);

							if (response.ok) {

								form.reset();
								form.classList.add('is-done');

							} else {

								alert("Ошибка HTTP: " + response.status);

							}

						});

					});

				});

			}

		});

	});

})(document.querySelectorAll('.form-mailer'));