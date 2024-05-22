import csv
import random
import string
import requests
import json
from datetime import datetime, timedelta

def getData(api_key, ticker, startDate, endDate):
    # Set up the parameters for the API request
    multiplier = 1
    timespan = 'day'
    adjusted = 'true'
    sort = 'asc'
    limit = 120

    # API endpoint with the specified parameters
    api_url = f'https://api.polygon.io/v2/aggs/ticker/{ticker}/range/{multiplier}/{timespan}/{startDate}/{endDate}?adjusted={adjusted}&sort={sort}&limit={limit}&apiKey={api_key}'

    # Make the API request
    response = requests.get(api_url)

    # Check if the response was successful
    if response.status_code == 200:
        # Parse the JSON response
        data = response.json()
        return(data)
    else:
        print(f"Failed to retrieve data: {response.status_code}")


api_key = 'rwLYpV7Mp7cVDwjsjD8ppp6DfB7oAo0z'
date_from = '2023-06-26'
date_to = '2023-12-31'
ticker = 'AAPL'
result = getData(api_key, ticker, date_from, date_to)

# Function to read existing data from CSV into a dictionary
def read_csv_data(filename):
    data = {}
    try:
        with open(filename, mode='r', newline='') as file:
            reader = csv.reader(file)
            next(reader, None)  # Skip header
            for row in reader:
                if row:  # Check if row is not empty
                    date = row[0]
                    stock_data = row[1:]
                    data[date] = stock_data
    except FileNotFoundError:
        print(f"{filename} not found. A new file will be created.")
    return data

# Function to write data to CSV
def write_to_csv(filename, data):
    with open(filename, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(["Date", "Volume", "Open Price", "Close Price", "High", "Low"])
        for date, stock_data in sorted(data.items()):
            writer.writerow([date, *stock_data])

# Read existing data
filename = f'{ticker}_data.csv'
existing_data = read_csv_data(filename)

# Update existing data with new data
for day in result["results"]:
    date = str(datetime.fromtimestamp(day["t"]/1000).date())  # Convert timestamp to date string
    stock_data = [day["v"], day["o"], day["c"], day["h"], day["l"]]
    existing_data[date] = stock_data  # This will update or add new data

# Write updated data to CSV
write_to_csv(filename, existing_data)

print(f"Updated data written to {filename}")