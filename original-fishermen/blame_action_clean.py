from subprocess import Popen, PIPE, call
import time
import sys
import os
import numpy as np
import matplotlib.pyplot as plt
import re
import pdb
import itertools

def getRewards_multi(strengths,trees):
	n = len(strengths) #number of fishermen
	R = np.zeros(np.power(2,n))
	truth_table = np.asarray(list(itertools.product([True, False], repeat=n)))

	for i in range(0,np.power(2,n)):
	
		tree_guys = [j for j, x in enumerate(truth_table[i,:]) if x] #who is getting the trees
		fish_guys = list(set(range(n)) - set(tree_guys))
		
		strength_sum = np.sum([strengths[tree_guy] for tree_guy in tree_guys]) #total strength of guys going for trees
		if strength_sum >= trees:
			R[i] = np.sum([strengths[fish_guy] for fish_guy in fish_guys]) #fish caught if trees are cleared
	
	return R
	
#Take in the probability of agent1, agent 2 and agent 3 choosing "0", and return expected reward table
def makeRP_multi(R,probs):
	RP = np.zeros(R.shape)
	n = probs.shape[0]
	truth_table = np.asarray(list(itertools.product([True, False], repeat=n)))
	
	for i in range(0,len(truth_table)):

		tree_guys = [j for j, x in enumerate(truth_table[i,:]) if x] #who is getting the trees
		fish_guys = list(set(range(n)) - set(tree_guys))
		
		prob_row = [probs[j] for j in tree_guys]
		prob_row = prob_row+([(1-probs[j]) for j in fish_guys])
		prob_row.append(R[i])
		
		RP[i] = np.product(prob_row)
	
	return RP
		
def logit(u, lam):
    """ vector of utilities
    """
    return np.exp(lam * u) / np.sum(np.exp(lam * u))

def QRE_multi(R,t,lam):
  if np.sum(R) != 0:
  	n = int(np.log2(len(R)))
	probs = 0.5*np.ones((n))
	truth_table = np.asarray(list(itertools.product([True, False], repeat=n)))
	utils = np.zeros(2)
	
	'''for agent in range(0,n):
		indices = list(itertools.compress(xrange(len(truth_table[:,agent])), truth_table[:,agent]))
		probs[agent] = np.sum([R[i] for i in indices])/np.sum(R)
	'''
	for i in xrange(t):
		RP = makeRP_multi(R, probs)

		for agent in range(0,n):
			indices = list(itertools.compress(xrange(len(truth_table[:,agent])), truth_table[:,agent]))
			utils[1] = 1./probs[agent]*np.sum([RP[index] for index in indices])
			utils[0] = 1./(1-probs[agent])*np.sum([RP[index] for index in list(set(xrange(len(R)))-set(indices))])
			
			probs[agent] = logit(utils,lam)[1]
		
	return probs #probability that fishermen should clear trees
  else:
	return 1

#Blame addition
def getPivotalityOptimal(R,choices,agent):

	n = len(choices)
	truth_table = np.asarray(list(itertools.product([1, 0], repeat=n)))
	
	if np.sum(R.flatten()) ==0: #checking for cases where it's impossible to get any reward
		best_idxs = np.array([[1,1,1]])
	else:
		idxs = np.argwhere(R == np.amax(R))
		best_idxs = np.asarray([truth_table[index].flatten() for index in idxs])
		
	#pdb.set_trace()	
	#if, for all possible optimal solutions, the agent made the optimal choice, they are not pivotal
	if all([idx == choices[agent] for idx in best_idxs[:,agent]]):
		return 0
	else:
		all_changes = np.transpose([abs(best_choice-np.array(choices)) for best_choice in best_idxs]) #gets all the changes for each of the optimal scenarios
		changes = sum(all_changes) #formatting list basically (with empty entries)
		min_best = np.argwhere(abs(changes - int(np.amin(changes))) < 0.000001) #finds closest optimal choices
		if all(best_idxs[min_best.flatten()][:,agent] == choices[agent]): #if closest optimal world has same choice as agent, no pivotality
			return 0
		elif len(min_best.flatten()) > 1 and not all(best_idxs[min_best.flatten()][:,agent] == 1 - choices[agent]) and choices[agent]==1: #handling edge cases
			idx_use = np.argwhere(best_idxs[:,agent] == choices[agent])
			return 1./(changes[idx_use].flatten()[0]+1)
		else:
			return 1./np.min(changes)	
	
def QRE_pivotal_optimal(R,t,lam,choices,agent,w):
	#pdb.set_trace()
	p_trees = QRE_multi(R,t,lam)[agent]
	
	pivotal = getPivotalityOptimal(R,choices,agent)
	if choices[agent] == 0:
		return p_trees*w + (1-w)*pivotal
	else:
		return (1-p_trees)*w + (1-w)*pivotal	

choices = [0,0,0]
agent = 0
w = 0.6		
t = 2
lam = 2.5

R = getRewards_multi([2,1,1],2)
p_multi = QRE_multi(R,t,lam)
print p_multi
#pdb.set_trace()
p_blame = QRE_pivotal_optimal(R,t,lam,choices, agent, w)
print p_blame


