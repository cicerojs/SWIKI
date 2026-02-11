sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'br.com.descomplicando.swiki',
            componentId: 'ZC_SWIKI__DOCUMENT_CJSObjectPage',
            contextPath: '/ZC_SWIKI__DOCUMENT_CJS'
        },
        CustomPageDefinitions
    );
});