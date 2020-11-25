import csv
from gensim.test.utils import common_texts
from gensim.utils import simple_preprocess, lemmatize
from gensim.models.doc2vec import Doc2Vec, TaggedDocument

documents = []
lyric_map = {}
with open("full.csv", "r") as fh:
    lines = csv.reader(fh, delimiter=",", quotechar="|")
    for idx, row in enumerate(lines):
        if len(row) < 3:
            continue
        name = row[0]
        if name.startswith("##"):
            continue
        song_id = row[1]
        song_lyrics = row[2]
        lyric_map[song_id] = song_lyrics
        tokens = simple_preprocess(song_lyrics, deacc=True)
        documents.append(TaggedDocument(tokens, [idx]))


# model = Doc2Vec(documents, vector_size=15, window=2, min_count=1, workers=2)
model = Doc2Vec(documents, 
        dm=1,             # Distributed mem (PV-DM)
        vector_size=50,  # Output dim
        window=4, 
        min_count=1, 
        workers=3, 
        epochs=25)
 
print("trackId\tvector\tlyrics")
for key, value in lyric_map.items():
    tokens = simple_preprocess(value, deacc=True)
    vector = model.infer_vector(tokens)
    # vector = model.infer_vector(value.split())
    print(key.strip() + "\t" + "|".join(map(str, vector)) + "\t" + value)


# documents = [TaggedDocument(doc, [i]) for i, doc in enumerate(common_texts)]
# model = Doc2Vec(documents, vector_size=5, window=2, min_count=1, workers=2)
# 
# x = model.infer_vector(["the", "quick", "brown", "fox", "jumps"])
# y = model.infer_vector(["the", "quick", "brown", "fox", "jumps"])
# print(x)
# print(y)
# print(len(common_texts))
