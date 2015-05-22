requirejs.config({
  baseUrl: '../',
  paths: {
    'underscore':                'bower_components/underscore/underscore',
    'jquery':                    'bower_components/jquery/dist/jquery',
    'jquery.boiler':             'bower_components/jquery-boiler/jquery.boiler',
    'gemini.support':            'bower_components/gemini-support/gemini.support',
    'gemini':                    'bower_components/gemini-loader/gemini',
    'gemini.respond':            'bower_components/gemini-respond/gemini.respond',
  }
});

require(['gemini', 'gemini.sticky'], function(G){
  $('#js-sticky').sticky();
});
