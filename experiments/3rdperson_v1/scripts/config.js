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


exp = {max_trees: 3,
       max_str: 3,
       n_villages: 6,
       n_trials: 2,
       optimum_trials: [true, false],
       passed_tutorial: false,
       tutorial_attempts: 0,
       action_check_trials: [],
       blame_attr_trials: [],
       survey: null,
       iti: 1000};

village_colors = formatArray(palette('tol-rainbow', exp.n_villages), '#{0}');