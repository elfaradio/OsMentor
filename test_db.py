from chromadb import PersistentClient

client = PersistentClient(path="./vector_db/chroma")

collection = client.get_collection("osmentor_chunks")

print("Collection:", collection.name)
print("Documents:", collection.count())
