const countyURL =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';

const educationURL =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';

let countyData;
let educationData;

const canvas = d3.select('#canvas');
const tooltip = d3.select('#tooltip');

let drawMap = () => {
  canvas
    .selectAll('path')
    .data(countyData)
    .enter()
    .append('path')
    .attr('d', d3.geoPath())
    .attr('class', 'county')
    .attr('fill', (countyDataItem) => {
      let id = countyDataItem['id'];
      let county = educationData.find((item) => {
        return item['fips'] === id;
      });
      let percentage = county['bachelorsOrHigher'];
      if (percentage <= 15) {
        return '#001546';
      } else if (percentage <= 30) {
        return '#0044e3';
      } else if (percentage <= 50) {
        return '#ffd976';
      } else {
        return '#ff6214';
      }
    })
    .attr('data-fips', (countyDataItem) => {
      return countyDataItem['id'];
    })
    .attr('data-education', (countyDataItem) => {
      let id = countyDataItem['id'];
      let county = educationData.find((item) => {
        return item['fips'] === id;
      });
      let percentage = county['bachelorsOrHigher'];
      return percentage;
    })
    .on('mouseover', (event, countyDataItem) => {
      tooltip.transition().style('visibility', 'visible');
      let county = educationData.find((item) => {
        return item['fips'] === countyDataItem.id;
      });
      tooltip
        .style('left', event.pageX - 200 + 'px')
        .style('top', event.pageY - 28 + 'px');
      tooltip.text(
        county['fips'] +
          ' - ' +
          county['area_name'] +
          ', ' +
          county['state'] +
          ': ' +
          county['bachelorsOrHigher'] +
          '%'
      );
      tooltip.attr('data-education', county['bachelorsOrHigher']);
    })
    .on('mouseout', (event, countyDataItem) => {
      tooltip.transition().style('visibility', 'hidden');
    });
};

d3.json(countyURL).then((data, error) => {
  if (error) {
    console.log(error);
  } else {
    countyData = topojson.feature(data, data.objects.counties).features;

    d3.json(educationURL).then((data, error) => {
      if (error) {
        console.log(error);
      } else {
        educationData = data;
        console.log(educationData);
        drawMap();
      }
    });
  }
});
