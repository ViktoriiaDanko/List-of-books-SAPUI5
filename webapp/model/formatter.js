sap.ui.define([
	"sap/ui/core/format/DateFormat"

], function (DateFormat) {
	"use strict";

	return {
		displayDate: function (sValue) {
			var date = new Date(sValue);
			return date.toLocaleDateString();
		}
	};

});