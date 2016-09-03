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

def QRE_multi(R,t,lam, probs):
  if np.sum(R) != 0:
  	n = int(np.log2(len(R)))
	truth_table = np.asarray(list(itertools.product([True, False], repeat=n)))
	utils = np.zeros(2)
	
	'''for agent in range(0,n):
		indices = list(itertools.compress(xrange(len(truth_table[:,agent])), truth_table[:,agent]))
		probs[agent] = np.sum([R[i] for i in indices])/np.sum(R)
	'''
	for i in xrange(t):
		RP = makeRP_multi(R, probs)
		pdb.set_trace()
		for agent in range(0,n):
			indices = list(itertools.compress(xrange(len(truth_table[:,agent])), truth_table[:,agent]))
			utils[1] = 1./probs[agent]*np.sum([RP[index] for index in indices])
			utils[0] = 1./(1-probs[agent])*np.sum([RP[index] for index in list(set(xrange(len(R)))-set(indices))])
			
			probs[agent] = logit(utils,lam)[1]
		
	return probs[0] #probability that fisherman A should clear trees
  else:
	return 1

R = getRewards_multi([1,1,1],1)
p_multi = QRE_multi(R,2,2.5, np.array([.6, .5, .5]))
print p_multi


