// ——————— STEP 1: CREATE ALL POSSIBLE SCENARIOS ——————— //
// Compute payoff for a particular state (trees, strengths) and actions
// NB: By convention, 'true' means fisherman removed trees
function get_payoff(state, actions) {
    var fishermen = _.zip(state.str, actions);
    
    // Tally trees, fish
    var trees_cleared = _.reduce(fishermen, function (m, n) {
        var total = n[1] ? m + n[0] : m
        return total
    }, 0);
    
    var fish_fished = _.reduce(fishermen, function (m, n) {
        var total = !(n[1]) ? m + n[0] : m
        return total
    }, 0);
    
    // No fish caught if road to market was not cleared
    fish_fished = trees_cleared >= state.trees ? fish_fished: 0;
    return {fish: fish_fished, trees: trees_cleared}
}

// Helper function: get all payoffs for a particular state
function get_all_payoffs(state) {
    // Get all actions and payoffs
    var all_actions = combinations(3);
    
    var get_img_url = function(action) {
        var template_str = 'images/blame_stim/{0}_a{1}b{2}c{3}_a{4}b{5}c{6}.jpg'
        return template_str.format(state.trees,
                                  state.str[0],
                                  state.str[1],
                                  state.str[2],
                                  +action[0],
                                  +action[1],
                                  +action[2]);
    }
    
    var payoffs = _.map(all_actions, function(e) {
        var payoff = get_payoff(state, e);
        
        return {action: e,
                img: get_img_url(e),
                trees_cleared: payoff.trees,
                payoff: payoff.fish}
    });
    
    // Tag each action according to whether it's optimal
    var max_payoff = _.max(_.pluck(payoffs, 'payoff'));
    payoffs = _.map(payoffs, function(e) {
        return $.extend(e, {is_optimal: e.payoff == max_payoff, max_payoff: max_payoff})
    });
    
    return payoffs
}

// The main part: create all possible scenarios!
all_scenarios = []

for (t = 1; t < exp.max_trees+1; t++){
    for (str1 = 1; str1 < exp.max_str + 1; str1 ++) {
        for (str2 = 1; str2 < exp.max_str + 1; str2 ++) {
            for (str3 = 1; str3 < exp.max_str + 1; str3 ++) {
                // Create state
                var tmp_state = {'trees': t,
                                'str': [str1, str2, str3]};
                var tmp_payoffs = get_all_payoffs(tmp_state);
                
                // Get number of possible solutions
                var n_soln = _.reduce(tmp_payoffs, function(m,n) {
                    return n.is_optimal ? m + 1 : m
                }, 0);
                
                // Save scenario
                tmp_state = $.extend(tmp_state, {n_soln: n_soln});
                
                if (tmp_state.n_soln < 8) {
                    all_scenarios.push(tmp_state);
                }
                
            }
        }
    }
}

// Partition scenarios by number of solutions
scenario_groups = _.groupBy(all_scenarios, function(e){return e.n_soln});
n_groups = _.keys(scenario_groups).length;

// ——————— STEP 2: CREATE VILLAGE ORDER ——————— //
var village_types = _.map(_.range(1,4), function(i){return [i, 3]});

var village_order = repeatArray(village_types, exp.n_villages/village_types.length, false);
var village_order = _.shuffle(village_order);

// ——————— STEP 3: CREATE TRIAL ORDER ——————— //
var trial_counts = _.countBy(_.flatten(village_order)); // Number of scenarios needed from each group

// Sample n scenarios from each group
var eligible_scenarios = _.map(_.keys(scenario_groups), function(k){
    return _.sample(scenario_groups[k], trial_counts[k])
});

var eligible_scenarios = _.object(_.keys(scenario_groups), eligible_scenarios);

// Assemble trial order
var trial_order = []
for (i = 0; i < village_order.length; i++) {
    // Start new village
    village_info = {color: village_colors[i], village: i + 1};
    new_village = $.extend({}, village_info, {type: 'new-village'});
    trial_order.push(new_village);
    
    // Sample states and actions for each day
    trial_types = village_order[i];
    
    trial_states = $.map(trial_types, function(e,i){
        return eligible_scenarios[e].pop();
    });
    
    trial_actions = $.map(trial_states, function(e, i){
        var all_actions = get_all_payoffs(e)
        
        var eligible_actions = _.filter(all_actions, function(a){
            return a.is_optimal == exp.optimum_trials[i]
        });
        
        return _.sample(eligible_actions)  
    });
    
    // Combine states and actions into a single object for each day
    day_info = $.map(trial_states, function(e, i) {
        return $.extend({}, e, trial_actions[i])
    });
    
    // Assemble trials
    action_check_trial = $.extend({type: 'action-check'}, village_info, day_info[0]);
    reminder_trial = $.extend({type: 'reminder'}, village_info, day_info[0]);
    blame_attr_trial = $.extend({type: 'blame-attr', prev_day: day_info[0]}, village_info, day_info[1]);
    
    // Add trials to timeline
    trial_order = trial_order.concat([action_check_trial, reminder_trial, blame_attr_trial]);

}

console.log(trial_order)