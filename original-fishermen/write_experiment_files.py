import make_imgs
import random
import itertools
import pdb
def write_stim_file(filenames,f_out):
	#single line of stim output
	stim_num = 1
	print >> f_out, '{\n"stim":['
	for i in range(0,len(filenames)-1):
		filename=filenames[i]
		print >> f_out, '{"ID":' + str(stim_num) + ',\n"image": "' + filename + '"},'
		stim_num = stim_num+1
	filename = filenames[-1]
	print >> f_out, '{"ID":' + str(stim_num) + ',\n"image": "' + filename + '"}'

	print >> f_out, '],\n"prompt": "<p>The fishermen need to collect fish to sell to the traders. It is very important that they clear the road and sell as many fish as possible!</p>",'
	print >> f_out, '"question": [{"question":"What should <b>fisherman A</b> do?"}]\n}'

def choose_stimuli():
	num_fishermen = [3]
	strengths = [1,2,3]
	num_trees = range(1,4)	

	all_strengths = []
	all_trees = []	

	for num in num_fishermen:
		for trees in num_trees:
			for x in strengths:
				for y in strengths:
					for z in strengths:

						subset = (x, y, z)


						if sum(subset) > trees:
							#pdb.set_trace()
							all_trees.append(trees)
							all_strengths.append(subset)
						else:
							print trees
							print subset

	indexes = range(1,len(all_trees))
	print len(all_trees)
	random.shuffle(indexes)	

	j = 1
	for i in range(0,len(all_trees),38):
		curr_strengths = [all_strengths[index] for index in indexes[i:(i+38)]]
		curr_trees = [all_trees[index] for index in indexes[i:(i+38)]]
		filenames = make_imgs.main(curr_strengths, curr_trees)
		f_out = open('stim'+str(j)+'.json','w')
		write_stim_file(filenames, f_out)
		j = j+1
		f_out.close()
		#pdb.set_trace()

choose_stimuli()