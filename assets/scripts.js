function search(input) {
	$("#results > tr").each(function () {
		var $tr = $(this);
		var $code = $tr.find("code");
		var text = $code.text();
		if (text.indexOf(input) === -1) {
			$tr.hide();
		} else {
			$tr.show();
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
		var formaction = $a.closest('.dropdown-menu').data('formaction');
		if (formaction) {
			$form.attr('action', formaction);
		}
		$form.find('input[name=type]').val($a.data('type'));
		$form.submit();
	});

});
