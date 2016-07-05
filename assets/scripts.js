function search(input) {
	$('#results > *').each(function () {
		var $row = $(this);
		var $code = $row.find('code');
		var text = $code.text();
		var markedText = text;
		var searchTermArr = input.split(' ');
		var match = true;
		for (var i = 0; i < searchTermArr.length; i++) {
			var searchTerm = searchTermArr[i];
			if (searchTerm.length) {
				if (text.indexOf(searchTerm) === -1) {
					match = false;
					break;
				}

				markedText = markedText.split(searchTerm).join('{' + searchTerm + '}');
			}
		}

		if (match) {
			$code.html(markedText.replace(/{/g, '<mark>').replace(/}/g, '</mark>'));
			$row.show();
		} else {
			$row.hide();
		}
	});
}

$(document).ready(function () {

	$('#search').on('input', function () {
		search($(this).val());
	});

	$('#type-filter').on('change', function () {
		var option = $(this).val();
		$('#results > *').each(function () {
			var $row = $(this);
			var text = $row.find('.label').text();
			if (text.indexOf(option) === -1) {
				$row.hide();
			} else {
				$row.show();
			}
		});
	});

	$('#type-filter-2 a').each(function () {
		var $a = $(this);
		var type = $a.data('type');
		var $results = $('#results > *');
		var total = $results.length;
		var categorised = $results.find('.label').length;
		var count;
		if (type === 'ALL') {
			count = total;
		} else if (type === 'UNKNOWN') {
			count = total - categorised;
		} else {
			count = $results.filter(function() {
				return $(this).find('.label').text() === type;
			}).length;
		}
		$a.find('.badge').text(count);
	});

	$('.dropdown-menu')
		.on('click', 'select', function(e) {
			e.stopPropagation();
		})
		.on('click', 'a', function(e) {
			e.preventDefault();
			var $a = $(this);
			var $form = $a.closest('form');
			var formaction = $a.data('formaction');
			if (formaction) {
				$form.attr('action', formaction);
			}
			$form.submit();
		});

});
