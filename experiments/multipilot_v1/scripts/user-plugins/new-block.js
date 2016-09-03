jsPsych.plugins['new-block'] = (function(){
    
  var plugin = {};

  plugin.trial = function(display_element, trial){
      // If any arguments to trial are functions, evaluate them!
      trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);
      
      var tmp_text = $('#new-block').html();
      display_element.html(tmp_text);
      display_element.find('.fishing-village').attr('src', trial.fname);
      
      display_element.find('button').click(function(){
          display_element.html('');
          jsPsych.finishTrial();
      });
    
  }

  return plugin;

})();