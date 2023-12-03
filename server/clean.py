import pandas as pd

# Read the CSV file
df = pd.read_csv('./artworks.csv')

# Keep only the necessary columns
df = df[['Title', 'Date', 'Medium', 'Artist ID']]

# Convert 'Artist ID' to numeric
df['Artist ID'] = pd.to_numeric(df['Artist ID'], errors='coerce')

# Keep only the rows where 'Artist ID' is less than or equal to 1000
df = df[df['Artist ID'] <= 1000]

# Remove artworks so that if there are multiple artworks made in one year by one artist it only keeps the first one
df = df.drop_duplicates(subset=['Date', 'Artist ID'], keep='first')

# Write the cleaned data back to the CSV file
df.to_csv('./artworks_clean.csv', index=False)
