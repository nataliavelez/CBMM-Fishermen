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
    
    // ———————— TUTORIAL TIMELINE ————————— //
    // Basic instructions pages
    var instructions_template = _.map(_.range(1,21), function(i) {
        var raw_template = '<p>Instructions: {0}/20</p><img class = "instruction" src = "{1}" />';
        return raw_template.format(i, instruction_images[i-1])
    })
    
    var instructions_timeline = {
        type: 'instructions',
        pages: instructions_template,
        allow_keys: false,
        show_clickable_nav: true
    };
        
    
    // Attention check
    var attn_check = {
        type: 'attn-check',
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
            console.log(!(data.all_correct))
            
            exp.passed_tutorial = data.all_correct;

            return !(data.all_correct) 
        }
    }
    
    // Instructions loop through if participant makes a mistake on the attention check 
    var loop_instructions = {
        timeline: [instructions_timeline, attn_check, oops_node],
        loop_function: function(){
            console.log('Evaluating loop...')
            console.log(exp.passed_tutorial)
            exp.tutorial_attempts += 1
            
            return !(exp.passed_tutorial)
        }
    };
    
    // ———————— MAIN TASK ————————— //
    
    var sll_survey = {
        type: 'sll-survey'
    }

    
    // ———————— INITIALIZE TASK ————————— //
    $('#start').click(function(){
        // If not in mTurk mode OR hit is accepted
        if (!turk.previewMode) {
            
        // Hide consent form, show experiment
        $('#i0').hide();
        $('#jspsych-target').show();
        
        // Starts experiment
        jsPsych.init({
            timeline: [loop_instructions],
            display_element: $('#jspsych-target'),
            default_iti: exp.pause_after_trial,
            fullscreen: false,
            show_progress_bar: false,
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