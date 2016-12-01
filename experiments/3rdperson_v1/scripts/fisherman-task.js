$(document).ready(function(){
    template_html = {
        attn_check: $('#attn-check').html(),
        begin_blame: $('#begin-blame').html(),
        oops: $('#oops').html()
    };
    
    $('#templates').hide();
    $('#jspsych-target').hide();
    $('#thanks').hide();
    
    
    // Preload images
    var trial_images = _.pluck(trial_order, 'img');
    var instruction_images = formatArray(_.range(1,21), 'images/instructions/{0}.jpg');
    
    var all_images = trial_images.concat(instruction_images);
    _.map(all_images, preloadImage);
    
    // ———————— ASSEMBLE TIMELINE ————————— //
    // Basic instructions pages
    var instructions_timeline = {
        type: 'instructions',
        pages: formatArray(instruction_images, '<img class = "instruction" src = "{0}" />'),
        allow_keys: false,
        show_clickable_nav: true
    };
    
    
    // Attention check
    var attn_check = {
        type: 'attn_check',
        text: template_html['attn_check']
    };
    
    // Oops! screen is hown if participant makes a mistake on the attention check
    var oops = {
        type: 'text-with-button',
        text: template_html['oops']
    };
    
    var oops_node = {
        timeline: [oops],
        conditional_function(){
            var data = jsPsych.data.getLastTrialData();
            exp.tutorial_attempts += !(data.all_correct);
            return !(data.all_correct) 
        }
    }
    
    // Instructions loop through if participant makes a mistake on the attention check 
    var loop_instructions = {
        timeline: instructions_timeline.concat(attn_check, oops_node),
        loop_function: function(data){
            console.log(data.type)
            return data.type === 'oops'
        }
    };
    
    
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