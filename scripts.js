function search(input) {
	$("#results tr").each(function () {
		var $tr = $(this);
		var text = $tr.find("a").text();
		if (text.indexOf(input) === -1) {
			$tr.hide();
		} else {
			$tr.show();
		}
	});
}

$(document).ready(function () {

	$("#search").on("input", function () {
		search($(this).val());
	});

	$('.dropdown-menu a').click(function (event) {
		event.preventDefault();
		$(this).closest('form')
			.find('input[name=type]')
				.val($(this).data('type'))
				.end()
			.submit();
	});

});
