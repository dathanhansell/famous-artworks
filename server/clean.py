import csv

# First, read the artists file, create a new ID for each artist, and write it to a new file
new_artists = {}
with open('artists.csv', 'r',encoding="utf-8") as f, open('artists_updated.csv', 'w', newline='',encoding="utf-8") as f_out:
    reader = csv.reader(f)
    writer = csv.writer(f_out)
    writer.writerow(next(reader))  # write the header
    for new_id, row in enumerate(reader, start=1):
        original_id = row[0]
        new_artists[original_id] = new_id
        row[0] = new_id
        writer.writerow(row)

print("New artist mapping: ", new_artists)

# Then, read the artworks file, replace the artist id with the new id, and write to a new file
with open('artworks.csv', 'r',encoding="utf-8") as f, open('artworks_updated.csv', 'w', newline='',encoding="utf-8") as f_out:
    reader = csv.reader(f)
    writer = csv.writer(f_out)
    writer.writerow(next(reader))  # write the header
    for row in reader:
        original_id = str(int(float(row[3])))
        new_id = str(new_artists.get(original_id, original_id))
        print(original_id,new_id)
        row[3] = new_id
        writer.writerow(row)
