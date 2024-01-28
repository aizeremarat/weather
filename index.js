require('dotenv').config();
const express = require('express');
var request = require('request');

const app = express();

app.use('/static', express.static('public'));

const apiKey = process.env.WEATHER_OPEN_API_KEY;
const QUOTE_API_URL = 'https://api.api-ninjas.com/v1/quotes';
const JSON_PLACEHOLDER_URL = process.env.JSON_PLACEHOLDER_URL


app.get('/weather', (httpReq, httpRes) => {
    const city = httpReq.query.city
    request(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`, { method: 'GET' }, (err, res) => {
        if (err != null) {
            console.log('err', err)

            httpRes.json({ err })
        } else {
            httpRes.json(JSON.parse(res.body))
        }
    })
})


app.get('/posts/:id', (req, httpRes) => {
    const id = req.params.id
    console.log(id)
    request(`${JSON_PLACEHOLDER_URL}/posts/` + id, (err, res) => {
        httpRes.json(JSON.parse(res.body))
    })
})

app.get('/posts', (_, httpRes) => {
    request(`${JSON_PLACEHOLDER_URL}/posts/`, (err, res) => {
        if (err) {
            httpRes.status(500).json({ error: 'Error fetching posts' });
            return;
        }
        httpRes.json(JSON.parse(res.body));
    });
});

app.get('/jokes', (httpReq, httpRes) => {
    request(`${JOKE_API_URL}/ten`, {
        method: 'GET',
    }, (err, res) => {
        if (err != null) {
            httpRes.json({ err })
        } else {
            httpRes.json(JSON.parse(res.body))
        }
    })
})



app.get('/quotes', (httpReq, httpRes) => {
    const category = 'happiness';
    const limit = 10;

    const requestOptions = {
        url: `${QUOTE_API_URL}?category=${category}&limit=${limit}`,
        method: 'GET',
    };

    request(requestOptions, (err, res, body) => {
        if (err) {
            httpRes.status(500).json({ error: 'Internal Server Error' });
        } else if (res.statusCode !== 200) {
            httpRes.status(res.statusCode).json({ error: body });
        } else {
            httpRes.json(JSON.parse(body));
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});