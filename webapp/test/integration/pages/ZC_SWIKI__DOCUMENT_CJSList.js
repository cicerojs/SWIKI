sap.ui.define(['sap/fe/test/ListReport'], function(ListReport) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ListReport(
        {
            appId: 'br.com.descomplicando.swiki',
            componentId: 'ZC_SWIKI__DOCUMENT_CJSList',
            contextPath: '/ZC_SWIKI__DOCUMENT_CJS'
        },
        CustomPageDefinitions
    );
});