# Scrapper
This application helps you scrape reviews posted on glassdoor and yelp web pages. There is no requirement of any user credentials to access any data from either glassdoor or yelp as this application scrapes data via fetch calls.

# Setup
Clone this repository and run the below commands \

```
>$ npm i \
>$ npm start \
```

This application exposes an API with endpoint '/aggregate' and consists of following request parameters: \
For glassdoor.com provide source_name as 'glassdoor' and url as 'https://www.glassdoor.com/Reviews/Employee-Review-BAYADA-Home-Health-Care-RVW512859
38.htm'. And for yelp.com provide source_name as 'yelp' and url as 'https://www.yelp.com/biz/mathis-brothers-furniture-tulsa'. There is an optional request parameter as filter_date in case you want to filter the reviews from recent to a particular date. \




