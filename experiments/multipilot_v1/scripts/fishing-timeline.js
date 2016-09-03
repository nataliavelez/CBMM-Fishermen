$(document).ready(function(){
    // Hide trial templates
    $('#templates').hide();
    
    // ———— Setting up fishing trials ———— //
    // Preload stimuli
    var img_names = _.pluck(trial_order, 'fname');
    _.map(img_names, preloadImage);

    // Each block will loop until subjects reach criterion
    var looping_trials = _.map(trial_order, function(trial){
        return {timeline: [trial],
               loop_function: function(){
                   var data = jsPsych.data.getLastTrialData();
                   console.log(data.is_max)
                   return !data.is_max
               }}
    });

    // ———— Putting slides in between ———— //
    // Announce the beginning of a new block

    // Add feedback after each trial

    // Leave room for comments at the end of the game

    // ———— Assembling the timeline ———— //

    // ———— Initializing jsPsych ———— //
    jsPsych.init({
        display_element: $('#jspsych-target'),
        timeline: looping_trials,
        on_finish: function(){
            // Save data to cgi-bin
            var data = jsPsych.data.getData();
             $.post("https://web.stanford.edu/~nvelez/cgi-bin/multipilot/submit_results.php",{expData: JSON.stringify(data)});
            
            // Show data on browser
            jsPsych.data.displayData();
        }
    });
});