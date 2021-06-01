# Web Voyager: Lightweight Visualization Of Website Data

![Alt text](./final/overview.png?raw=true "Overview of Web Voyager")
*An overview of visualizing holiday data on timeanddate.com using Web Voyager. 1) Holiday type values scraped and highlighted (light blue) by clicking on a single holiday type value 2) Scraped holiday data displayed as a JSON array with auto generated property names 3) Vega-lite specification used to create the visualization 4) Visualization created from Vega-lite specification*

## Abstract

Many websites have data that we would like to visualize but it is not available in a form that can be readily used such as a JSON or CSV file. The few websites that do make their data available provide it via an API which often requires setting up an account, registering for an API key and configuring a programming environment which can be time consuming and complex.

In this work, I present an interaction model for lightweight visualization of structured website data right in the context of the website. The key idea is to provide a mechanism to scrape the desired data from the website and feed it into a visualization pipeline that enables lightweight visualization of the data without having to leave the website.

To illustrate this approach, I have implemented a Chrome browser extension called Web Voyager. Through case studies, I show that Web Voyager can be used to visualize data on real-world websites. Finally, I discuss the limitations of Web Voyager and opportunities for future work.

Team Members: Kapaya Katongo

Paper: https://github.com/Kapaya/web-voyager/blob/main/final/FinalPaper.pdf

Demo: https://youtu.be/wnvdrx_pIyM

## Setup

To test out Web Voyager you can follow these steps:
1. Clone the repository
2. Open Chrome and load its browser extensions page by pasting "chrome://extensions/" into the search bar
3. Make sure "Developer mode", in the top right, is toggled on
4. Click "Load unpacked" and select the root of the repository folder you cloned
5. Navigate to https://www.timeanddate.com/holidays/us/ and follow the steps shown in the demo video. Website data is scraped by clicking on a value while pressing the Alt key (Option on Mac)
6. While Web Voyager is active on a website, you will not be able to click on links or buttons. To close it, simply refresh the page. For convenience, the Vega-lite configuration shown in the demo video can be found in the vega-lite-configs folder