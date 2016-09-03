// Get number of trials by type - the number of possible blocks is limited by the trials that we have least of
// (here, the trials with 3 optima)
n_trials_by_type = _.map(scenarios, function (e) {return e.length});
n_blocks_by_type = _.min(n_trials_by_type);

// Extract subsets of trials from all possible trials
all_trials = scenarios.map(function(e) {
    tmp_arr = _.shuffle(e);
    return tmp_arr.slice(0, n_blocks_by_type);
});
trial_source = all_trials.slice(); // Create copy (to be used for counterbalancing later)

// Interleave blocks with different # of optima
block_order = repeatArray(_.range(all_trials.length), n_blocks_by_type, true);

// Select trial order
trial_order = [];
for (block = 0; block < block_order.length; block++) {
    block_type = block_order[block];
    new_trial =  trial_source[block_type].shift();
    trial_order.push(new_trial);
}

// Add trial type, number, and image information to all trials
for (t = 0; t < trial_order.length; t++) {
    // Add fishing village
    var fbase = '{0}_a{1}b{2}c{3}.png'; // Filename pattern
    var fparams = [trial_order[t]['trees']].concat(trial_order[t]['strengths']); // Parameters for filename
    var fname = fbase.format.apply(fbase, fparams); // Full filename
    
    trial_order[t]['type'] = 'fishing-game';
    trial_order[t]['num'] = t+1;
    trial_order[t]['fname'] = fname;
}