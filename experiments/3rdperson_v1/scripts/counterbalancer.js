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
    return fish_fished
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
var village_types = [];

for (i = 1; i < n_groups+1; i++) {
    for (j = 1; j < n_groups+1; j++) {
        village_types.push([i,j]);
    }
}

var village_order = repeatArray(village_types, exp.n_villages/village_types.length, false);
var village_order = _.shuffle(village_order);