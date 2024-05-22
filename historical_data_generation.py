import requests
import json
import datetime as dt
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

api_key = "4zbR3QixBSuQviwp9MjKEeMK86vxaajgr7yThGdLGIe2PwYwAV0UC4EjwLrbMh1Y"

def get_klines(ticker="BTCUSD", start=None, end=None):
    if start and end:
        url = f"https://api.binance.us/api/v3/klines?symbol={ticker}&interval=1m&startTime={start}&endTime={end}"
    else:
        url = f"https://api.binance.us/api/v3/klines?symbol={ticker}&interval=1m"
    myResponse = requests.get(url)
    if myResponse.ok:
        jData = myResponse.json()
        times = []
        prices = []
        for kline in jData:
            times.append(kline[0])
            prices.append(float(kline[1]))
        return times, prices
    else:
        myResponse.raise_for_status()

@app.route('/data/<ticker>')
def data(ticker):
    curr_time = int(dt.datetime.now().timestamp() * 1000)  # Current time in milliseconds
    mins = 1440 * 14
    start_time = curr_time - mins * 60 * 1000
    times, prices = get_klines(ticker=ticker)
    return jsonify({'times': times, 'prices': prices})

if __name__ == '__main__':
    app.run(debug=True)
