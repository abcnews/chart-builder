function search(input) {
	$("#results > tr").each(function () {
		var $tr = $(this);
		var text = $tr.find("code").text();
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
