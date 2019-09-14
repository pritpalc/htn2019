#%%
from pathlib import Path, PosixPath
from pprint import PrettyPrinter
from collections import defaultdict
from json import dump

pp = PrettyPrinter(indent=2)

def splitName(name : Path):
    i = name.parts.index('male')  if 'male' in filename.parts else name.parts.index('female')
    return {
        'category': name.parts[:i],
        'style':name.parts[i+1:],
        'gender':name.parts[i]
    }


filenames = []
for filename in Path('.').glob('**/*.png'):
    if 'male' in filename.parts or 'female' in filename.parts:
        filenames.append(splitName(filename))

index = defaultdict(lambda: {'male':[],'female':[]})

for fileInfo in filenames:
    index['/'.join(fileInfo['category'])][fileInfo['gender']].append('/'.join(fileInfo['style']))


with open('index.js', "w") as f:
    dump(index,f, indent=2)
#%%
