/*
sll-survey

A very simple plugin to present a post-test survey.

*/

jsPsych.plugins['sll-survey'] = (function(){

  var plugin = {};

  plugin.trial = function(display_element, trial){
      // Prepare slide
      display_element.html('');
      //$(document).unbind('click');
      
      // Load content
      var survey_content = $('#sll-survey').html();
      display_element.html(survey_content);
      
      // Save response
      display_element.find('.submit').on('click', function(e){
          e.preventDefault();
          $(this).off('click'); // Button only responds once
          
          var trial_data = {
              language : display_element.find('input.language').val(),
              enjoyment : display_element.find('select.enjoyment').val(),
              assess : display_element.find('input[name="assess"]:checked').val(),
              age : display_element.find("input.age").val(),
              gender : display_element.find("select.gender").val(),
              education : display_element.find("select.education").val(),
              comments : display_element.find("textarea.comments").val(),
          };
          
          var all_data = jQuery.extend(trial, trial_data);
          
          console.log(trial_data); // Debugging--no data saved?
          
          // Save data
          display_element.html('');
          exp.survey = all_data;
          jsPsych.finishTrial(trial_data);
      });
    
  }

  return plugin;

})();