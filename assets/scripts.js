function search(input) {
	$("#results > *").each(function () {
		var $row = $(this);
		var $code = $row.find("code");
		var text = $code.text();
		if (text.indexOf(input) === -1) {
			$row.hide();
		} else {
			$row.show();
			if (input.length) {
				text = text.split(input).join('<mark>' + input + '</mark>');
			}
			$code.html(text);
		}
	});
}

$(document).ready(function () {

	$("#search").on("input", function () {
		search($(this).val());
	});

	$('.dropdown-menu a').click(function (event) {
		event.preventDefault();
		var $a = $(this);
		var $form = $a.closest('form');
		var formaction = $a.data('formaction');
		if (formaction) {
			$form.attr('action', formaction);
		}
		$form.find('input[name=type]').val($a.data('type'));
		$form.submit();
	});

});
