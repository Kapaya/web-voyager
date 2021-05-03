# Instant Web Charts

## Overview

Instant Web Charts is a Chrome browser extension that lets you perform lightweight visualizations of data on a website right on the website. Often times, websites have data that we want to visualize but not in a form we can work with such as JSON or CSV files. Some of the websites that don't provide their data as a downloadable JSON or CSV file make it available via an API. However, getting data from an API typically involves creating an account, acquiring an API key and setting up a programming environment. This is often more trouble than is worth.

Instant Web Charts illustrates one approach for lightweight visualization of website data right in the context of the website. You start out by scraping the data on the website that you want to visualize into an array of JSON objects. Then, you can write a Vega-Lite specification (https://vega.github.io/vega-lite/) that uses the scraped website data to create a visualization such as a bar chart. Just like that, you can get visualization of data on a website right in the website!

## Setup

To test out Instant Web Charts you can follow these steps:
1. Clone the repository
2. Open Chrome and load its browser extensions page by pasting chrome://extensions/ into the search bar
3. Make sure "Developer mode", in the top right, is toggled on
4. Click "Load unpacked" and select the root of the repository folder you cloned
5. Navigate to https://www.timeanddate.com/holidays/us/ and follow the steps shown in the milestone video: https://www.loom.com/share/98206c5a65cb43709033aed019dce06c

As this is a prototype, not everything might go as expected so make sure to follow the exact sequence of steps shown in the video.