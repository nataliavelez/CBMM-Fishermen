import sys
from PIL import Image
from PIL import ImageFont
from PIL import ImageDraw 
import math
import pdb

def convert_white_to_transparent(img):
	datas = img.getdata()
	#pdb.set_trace()
	newData = []
	for item in datas:
		if item[0] >= 250 and item[1] >= 250 and item[2] >= 250:
			newData.append((255, 255, 255, 0))
		else:
			newData.append(item)

	img.putdata(newData)
	return img
def convert_green_to_transparent(img):
	datas = img.getdata()
	#pdb.set_trace()
	newData = []
	for item in datas:
		if item[0] >= 150 and item[1] >= 150 and item[2] <= 100:
			newData.append((155, 187, 89, 0))
		else:
			newData.append(item)

	img.putdata(newData)
	return img	
def add_text(img,text, location, font_size):
 draw = ImageDraw.Draw(img)
 #font = ImageFont.load_default()
 font = ImageFont.truetype("/Library/Fonts/Arial.ttf", font_size)
 draw.text(location,text,(0,0,0),font=font)
 return img

def add_muscles(num_muscles, location, img, muscle_img):
	spacing = muscle_img.size[0]/2.
	curr_loc = location[0]
	location_y = location[1]

	for muscle in range(0,num_muscles):
		curr_loc = curr_loc + spacing
		img.paste(muscle_img,(int(curr_loc),location_y),mask=muscle_img)
	return img

def main(strengths, trees, dirname="stimuli/"):
    img_dir = "image_components/"
    filenames=[]
    image_arr = ['tree.png','fisherman.png','Background.png','road.png','pond.png','strength.png']
    images = map(Image.open, [img_dir+image for image in image_arr])    
    
    widths, heights = zip(*(i.size for i in images))    
 
    total_width = widths[2]
    max_height = heights[2] 
    road_len = heights[3]    
 
    letters = ['a','b','c','d','e','f','g','h','i','j','k']
    for scenario in range(0,len(trees)):
    	new_im = Image.new('RGB', (total_width, max_height))
    	new_im.paste(images[2], (0,0)) #just the background
    	
    	road_position = total_width/2. - widths[3]/2. #subtract out half the road
    	new_im.paste(images[3], (int(road_position), 0)) #adding road
    	
    	#Adding the trees
    	num_trees = trees[scenario]
    	tree_spacing = int((road_len-10.)/(num_trees+1))
    	tree_offset = 2
    	
    	#Convert tree image to have transparency
    	tree_img = images[0]
    	tree_img = tree_img.convert('RGBA')
    	tree_img = convert_white_to_transparent(tree_img)
    	#pdb.set_trace()
    	
    	scale_factor = 1./max(math.sqrt(num_trees/2.),1)
    	tree_img = tree_img.resize((int(widths[0]*scale_factor), int(heights[0]*scale_factor)))
    	#tree_img.convert('RGBA')
    	for tree in range(0,trees[scenario]):
    		new_im.paste(tree_img,(int(total_width/2.-tree_img.size[0]/2.),tree_offset),mask=tree_img)
    		tree_offset = tree_offset+tree_spacing
    		
    	#Add in a number for easy understanding of number of trees
    	location = (int(total_width/2. - widths[3]*1.5), road_len+32)
    	new_im = add_text(new_im,"(# trees=" + str(num_trees) + ")", location, 32)
    	
    	
    	#Adding the fishermen
    	num_fishermen = len(strengths[0])
    	angle_shift = 180./(num_fishermen-1)
    	offset_overall = 0
    	center_y = road_len*2./3
    	curr_angle = 0#angle_shift/2.
    	offset_fishermen_x = 80
    	offset_fishermen_y = -20
    	
    	radius_y = total_width/3.*4/5.
    	radius_x = total_width/3.*4/5.
    	#pdb.set_trace()
    	print num_fishermen
    	scale_factor = 1./max(math.sqrt((num_fishermen-2)/2.),1)
    	for fishermen in range(0,num_fishermen):
    		#print curr_angle
    		if curr_angle <= 90:
    			x_pos = total_width/2. - radius_x*math.cos(curr_angle*math.pi/180.)
    			y_pos = center_y+radius_y*math.sin(curr_angle*math.pi/180.)
    		else:
    			x_pos = total_width/2. + radius_x*math.cos((180. - curr_angle)*math.pi/180.)
    			y_pos = center_y+radius_y*math.sin((180.-curr_angle)*math.pi/180.)
    		
    		pond = images[4].resize((int(widths[4]*scale_factor), int(heights[4]*scale_factor)))
    		pond_rad = pond.size[0]/2.
    		
    		#Put the fishermen in - they need to be scaled and made transparent
    		fishermen_img = images[1].resize((int(widths[1]*scale_factor), int(heights[1]*scale_factor)))
    		fishermen_img = fishermen_img.convert('RGBA')
    		#pdb.set_trace()
    		#fishermen_img = convert_green_to_transparent(fishermen_img)
    		
    		new_im.paste(pond,(int(x_pos - pond_rad), int(y_pos - pond_rad - offset_overall)), mask =pond)
    		if curr_angle <= 90:
    			fishermen_x = int(x_pos - pond_rad - offset_fishermen_x)
    			fishermen_y = int(y_pos + offset_fishermen_y-offset_overall)
    			new_im.paste(fishermen_img,(fishermen_x, fishermen_y),mask=fishermen_img)
    		else:
    			fishermen_x = int(x_pos + offset_fishermen_x)
    			fishermen_y = int(y_pos + offset_fishermen_y-offset_overall)
    			new_im.paste(fishermen_img,(fishermen_x, fishermen_y),mask=fishermen_img)
    
    		#Add fisherman labels
    		fontSize = 24
    		location = (int(x_pos-pond_rad),int(y_pos - pond_rad - fontSize*1.2))
    		new_im = add_text(new_im,"Fisherman " + letters[fishermen].upper(), location, fontSize)

    		location=(int(fishermen_x-60), int(fishermen_y+fishermen_img.size[1]+15))
    		curr_angle = curr_angle + angle_shift
    		
    		new_im = add_text(new_im,"Strength: " , location, fontSize)	
    
    		#Add in the muscles!
    
    		muscle_img = images[5].convert('RGBA')
    		muscle_img = muscle_img.resize((int(widths[5]*scale_factor/2.),int(heights[5]*scale_factor/2.)))
    		muscle_img = convert_white_to_transparent(muscle_img)
    		#pdb.set_trace()
    		new_im = add_muscles(strengths[scenario][fishermen], (location[0]+80,location[1]-int(muscle_img.size[1]/3.)), new_im, muscle_img)
    
    
    	filename = str(num_trees) + "_" + ''.join([a + str(b) for a,b in zip(letters,strengths[scenario])]) 	
    	new_im.save(dirname + filename + '.png',"PNG")
    	filenames.append(filename+'.png')
    return filenames

'''if __name__ == "__main__"
	strengths = [[1,1,1,1,1,5], [1,1,1,1,5],[1,1,1,1,1,1,6]]
	trees = [5,4,6]
	filenames = main(strengths, trees)
	print filenames'''

