document.addEventListener('DOMContentLoaded', () => {
	function setMessage(message, error) {
		errorBox.style.display = 'none'
		messageBox.style.display = 'none'

		if (error) {
			errorBox.innerText = message
			errorBox.style.display = 'block'
		} else {
			messageBox.innerText = message
			messageBox.style.display = 'block'

			setTimeout(() => messageBox.style.display = 'none', 2000)
		}
	}

	function removeSrcAttributes(obj) {
		if (Array.isArray(obj)) {
				for (let i = 0; i < obj.length; i++) {
						obj[i] = removeSrcAttributes(obj[i]);
				}
		} else if (typeof obj === 'object') {
				for (let key in obj) {
						if (key === 'src') {
								delete obj[key]; // Remove the src attribute
						} else {
								obj[key] = removeSrcAttributes(obj[key]);
						}
				}
		}
		return obj;
	}

	function cleanJSON (json) {
		if (json.jsonLinkedData){ delete(json.jsonLinkedData) }
		if (json.meta){ delete(json.meta) }

		json = removeSrcAttributes(json)

		return JSON.stringify(json, null, 2);
	}

	let input = document.querySelector('#input')
	let output = document.querySelector('#output')

	let errorBox = document.querySelector('#error')
	let messageBox = document.querySelector('#message')

	input.addEventListener('input', (e) => {
		errorBox.style.display = 'none'

		if (e.target.value?.length > 0) {
			try {
				let value = JSON.parse(e.target.value)
				let jsonString = cleanJSON(value)
				output.value = jsonString

				try {
					output.select()
					// Attempt to copy the selected text to the clipboard
					document.execCommand('copy');
					setMessage('Text copied to clipboard');
				} catch (err) {
					setMessage('Unable to copy text to clipboard');
				}
			} catch (error) {
				console.error('error', error.message)
				errorBox.innerText = error.message
				errorBox.style.display = 'block'
			}
		}
	})
})
