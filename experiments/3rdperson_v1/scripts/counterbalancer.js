/*
STEP 1: EXPERIMENT CONFIGURATION

Options:
max_trees, max_str
    [numeric]
    The maximum number of trees and stregth per fishermen, respectively.
    
n_trials
    [obs]
    Number of observations per subject

optimum_trials
    [array]
    Must have as many elements as there are trials in n_trials. True if fishermen act optimally.
    
first_trial
    [numeric]
    The type of trial to be displayed first

iti
    [numeric]
    Inter-trial interval, in ms
*/

// STEP 2: CREATE ALL POSSIBLE SCENARIOS
// Helper functions: return all possible actions


// Helper function: calculate payoff
// state is an object with the following keys:
//      trees [numeric]: # of trees
//      str [array]: strength of each fisherman
//  actions [array]: action of each fisherman (true = cleared trees)

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
    return fish_fished
}

// Helper function: get all payoffs
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
        return {action: e,
                img: get_img_url(e),
                payoff: get_payoff(state, e)}
    });
    
    // Tag each action according to whether it's optimal
    var max_payoff = _.max(_.pluck(payoffs, 'payoff'));
    payoffs = _.map(payoffs, function(e) {
        return $.extend(e, {is_optimal: e.payoff == max_payoff, max_payoff: max_payoff})
    });
    
    return payoffs
}

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
                all_scenarios.push(tmp_state);
            }
        }
    }
}

scenario_groups = _.groupBy(all_scenarios, function(e){return e.n_soln});

// GET BLOCK ORDER
var block_order = repeatArray([1,2,3], exp.n_villages/3, true);

// SAMPLE TRIALS
trial_order = [];

for (i = 0; i < exp.n_villages; i++) {
    tmp_trials = [];
    
    for (t = 0; t < exp.optimum_trials.length; t++) {
        var t =  _.sample(scenario_groups[exp.block_order[i][t]]);
        var t_payoffs = get_all_payoffs(t);
        var t_actions = _.filter(t_payoffs, function(e) { return exp.optimum_trials[t] ? e.is_optimal : !(e.is_optimal) });
        
        t_info = $.extend(t, _.sample(t_actions), {type: 'fisherman-game'});
        tmp_trials.push(t_info);
    }
    
    trial_order.push(tmp_trials)
}
