sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'br/com/descomplicando/swiki/test/integration/FirstJourney',
		'br/com/descomplicando/swiki/test/integration/pages/ZC_SWIKI__DOCUMENT_CJSList',
		'br/com/descomplicando/swiki/test/integration/pages/ZC_SWIKI__DOCUMENT_CJSObjectPage'
    ],
    function(JourneyRunner, opaJourney, ZC_SWIKI__DOCUMENT_CJSList, ZC_SWIKI__DOCUMENT_CJSObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('br/com/descomplicando/swiki') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheZC_SWIKI__DOCUMENT_CJSList: ZC_SWIKI__DOCUMENT_CJSList,
					onTheZC_SWIKI__DOCUMENT_CJSObjectPage: ZC_SWIKI__DOCUMENT_CJSObjectPage
                }
            },
            opaJourney.run
        );
    }
);