$(document).ready(function(){
    template_html = {
        attn_check: $('#attn-check').html(),
        begin_blame: $('#begin-blame').html(),
    };
    
    $('#templates').hide();
    $('#jspsych-target').hide();
    $('#thanks').hide();
    
    
    // Preload images
    var trial_images = _.pluck(trial_order, 'img');
    var instruction_images = _.map(_.range(1,21), function(i){
        return 'images/instructions/{0}.jpg'.format(i)
    });
    
    var all_images = trial_images.concat(instruction_images);
    _.map(all_images, preloadImage);
    
    // ———————— ASSEMBLE TIMELINE ————————— //
    
    
    
    // ———————— INITIALIZE TASK ————————— //
    $('#start').click(function(){
        // If not in mTurk mode OR hit is accepted
        if (!turk.previewMode) {
            
        // Hide consent form, show experiment
        $('#i0-wrapper').hide();
        $('#jspsych-target').show();
        
        // Starts experiment
        jsPsych.init({
            timeline: experiment_timeline,
            display_element: $('#jspsych-target'),
            default_iti: exp.pause_after_trial,
            fullscreen: false,
            show_progress_bar: true,
            on_trial_start: function(){
                $('body').scrollTop(0);
            },
            on_finish: function (){
                $('#jspsych-target').hide();
                $('#thanks').show();
                
                var turkInfo = jsPsych.turk.turkInfo();
                var lastTrial = jsPsych.data.getLastTrialData();
                
                exp_data = {
                    time_in_minutes: lastTrial['time_elapsed']/1000/60,
                    system: {
                        browser: BrowserDetect.browser,
                        OS: BrowserDetect.OS,
                        width: $(window).width(),
                        height: $(window).height()
                    },
                    jspsych_raw_data: jsPsych.data.getData()
                }
                
                exp_data = jQuery.extend(exp_data, exp);
                 
                // Save to mTurk
                // (If not in mTurk, this will save to cgi-bin)
                setTimeout(function(){
                    turk.submit(exp_data);
                }, 2000);
            }
        });
        }
    });
    
    
    
    
});